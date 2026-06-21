import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { randomUUID } from "crypto";
import { sendOrderConfirmation } from "@/lib/email";

interface GelatoOrderPayload {
  orderType: string;
  orderReferenceId: string;
  customerReferenceId: string;
  currency: string;
  items: Array<{
    itemReferenceId: string;
    productUid: string;
    files: Array<{ type: string; url: string }>;
    quantity: number;
  }>;
  shippingAddress: {
    firstName: string;
    lastName: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    postCode: string;
    country: string;
    email: string;
  };
}

export async function POST(req: NextRequest) {
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripeKey || !webhookSecret) {
    console.error("[webhook] Stripe env vars missing");
    return NextResponse.json({ error: "Stripe not configured" }, { status: 500 });
  }

  // Raw body required for signature verification — must read before any parsing
  const rawBody = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    const stripe = new Stripe(stripeKey);
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Signature verification failed";
    console.error("[webhook] signature error:", message);
    return NextResponse.json({ error: message }, { status: 400 });
  }

  // Acknowledge immediately; only process the one event type we care about
  if (event.type !== "checkout.session.completed") {
    return NextResponse.json({ received: true });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  console.log("[webhook] checkout.session.completed:", session.id);

  const imageUrl = session.metadata?.imageUrl;
  if (!imageUrl) {
    console.error("[webhook] No imageUrl in metadata for session", session.id);
    return NextResponse.json({ received: true });
  }

  const gelatoApiKey = process.env.GELATO_API_KEY;
  const gelatoProductUid = process.env.GELATO_PRODUCT_UID;

  if (!gelatoApiKey || !gelatoProductUid) {
    console.error("[webhook] Gelato env vars missing — skipping order creation");
    return NextResponse.json({ received: true });
  }

  // Map Stripe shipping/customer details → Gelato address
  // In Stripe v22+, shipping is under collected_information.shipping_details
  const shipping = session.collected_information?.shipping_details;
  const customerEmail = session.customer_details?.email ?? "";
  const fullName = shipping?.name ?? session.customer_details?.name ?? "";
  const spaceIdx = fullName.indexOf(" ");
  const firstName = spaceIdx > 0 ? fullName.slice(0, spaceIdx) : fullName;
  const lastName = spaceIdx > 0 ? fullName.slice(spaceIdx + 1) : "";

  const order: GelatoOrderPayload = {
    orderType: "order",
    orderReferenceId: session.id,
    customerReferenceId: customerEmail || session.id,
    currency: "EUR",
    items: [
      {
        itemReferenceId: randomUUID(),
        productUid: gelatoProductUid,
        files: [{ type: "default", url: imageUrl }],
        quantity: 1,
      },
    ],
    shippingAddress: {
      firstName,
      lastName,
      addressLine1: shipping?.address.line1 ?? "",
      addressLine2: shipping?.address.line2 ?? "",
      city: shipping?.address.city ?? "",
      postCode: shipping?.address.postal_code ?? "",
      country: shipping?.address.country ?? "",
      email: customerEmail,
    },
  };

  try {
    const gelatoRes = await fetch("https://order.gelatoapis.com/v4/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": gelatoApiKey,
      },
      body: JSON.stringify(order),
    });

    const gelatoData = (await gelatoRes.json()) as unknown;

    if (!gelatoRes.ok) {
      console.error(
        "[webhook] Gelato order FAILED (HTTP %d):\n%s",
        gelatoRes.status,
        JSON.stringify(gelatoData, null, 2),
      );
    } else {
      console.log(
        "[webhook] Gelato order CREATED:\n%s",
        JSON.stringify(gelatoData, null, 2),
      );

      // Best-effort order-confirmation email — same principle as capture-email:
      // a send failure must never fail the webhook (the Gelato order is what matters).
      if (customerEmail) {
        try {
          await sendOrderConfirmation(customerEmail, {
            imageUrl,
            productName: "Classic Matte Poster, 40×50cm",
            price: "€39",
            deliveryEstimate: "Arriving in 5–12 business days",
          });
          console.log("[webhook] confirmation email sent to", customerEmail);
        } catch (emailErr) {
          console.error("[webhook] confirmation email failed (non-fatal):", emailErr);
        }
      } else {
        console.warn("[webhook] no customer email on session — skipping confirmation email");
      }
    }
  } catch (err) {
    console.error("[webhook] Gelato fetch error:", err);
  }

  return NextResponse.json({ received: true });
}
