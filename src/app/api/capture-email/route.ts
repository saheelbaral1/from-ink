import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

// Best-effort email capture. This route must NEVER block the checkout flow:
// if the table is missing or the insert fails, we log and still return ok so
// the client can proceed to Stripe.
export async function POST(req: NextRequest) {
  let email: string;
  let imageUrl: string | null = null;

  try {
    const body = (await req.json()) as { email?: string; imageUrl?: string };
    if (!body.email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(body.email)) {
      return NextResponse.json({ error: "A valid email is required" }, { status: 400 });
    }
    email = body.email.trim();
    imageUrl = body.imageUrl ?? null;
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  let stored = false;
  try {
    const supabase = getSupabaseAdmin();
    const { error } = await supabase
      .from("email_captures")
      .insert({ email, image_url: imageUrl });

    if (error) {
      // Table missing / RLS / etc. — log, don't block checkout.
      console.error("[/api/capture-email] insert failed:", error.message);
    } else {
      stored = true;
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Supabase unavailable";
    console.error("[/api/capture-email]", message);
  }

  // Always log so the email is at least recoverable from server logs if the
  // table doesn't exist yet.
  if (!stored) {
    console.info(`[/api/capture-email] captured (unstored): ${email} · ${imageUrl ?? "no image"}`);
  }

  return NextResponse.json({ ok: true, stored });
}
