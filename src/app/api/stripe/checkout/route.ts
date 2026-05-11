import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";

/** Creates a Checkout Session — wire price IDs via env (STRIPE_PRICE_*). */
export async function POST(req: Request) {
  const stripe = getStripe();
  if (!stripe) return NextResponse.json({ error: "Stripe not configured" }, { status: 501 });

  const body = (await req.json().catch(() => ({}))) as { priceId?: string; tenantId?: string; successUrl?: string; cancelUrl?: string };
  if (!body.priceId) return NextResponse.json({ error: "priceId required" }, { status: 400 });

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: body.priceId, quantity: 1 }],
    success_url: body.successUrl || `${process.env.NEXT_PUBLIC_APP_URL}/pricing?success=1`,
    cancel_url: body.cancelUrl || `${process.env.NEXT_PUBLIC_APP_URL}/pricing?canceled=1`,
    metadata: { tenantId: body.tenantId || "" },
  });

  return NextResponse.json({ url: session.url });
}
