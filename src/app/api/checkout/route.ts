import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey) {
    return NextResponse.json({ error: "Stripe is not configured" }, { status: 500 });
  }

  let imageUrl: string;
  try {
    const body = (await req.json()) as { imageUrl?: string };
    if (!body.imageUrl) {
      return NextResponse.json({ error: "imageUrl is required" }, { status: 400 });
    }
    imageUrl = body.imageUrl;
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const origin =
    process.env.NEXT_PUBLIC_SITE_URL ??
    req.headers.get("origin") ??
    "http://localhost:3000";
  const stripe = new Stripe(stripeKey);

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: "Custom Art Poster",
              description: "A beautiful watercolor print of your child's drawing, shipped to your door.",
              images: [imageUrl],
            },
            unit_amount: 3900,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      shipping_address_collection: {
        allowed_countries: ["SE", "NO", "DK", "FI", "DE", "FR", "NL", "GB", "US", "AU"],
      },
      metadata: { imageUrl },
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Stripe error";
    console.error("[/api/checkout]", message);
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
