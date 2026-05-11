import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const stripe = getStripe();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripe || !secret) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 501 });
  }

  const sig = req.headers.get("stripe-signature");
  if (!sig) return NextResponse.json({ error: "Missing signature" }, { status: 400 });

  const raw = await req.text();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(raw, sig, secret);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  async function syncSubscription(stripeSubId: string, status: Stripe.Subscription.Status) {
    const dbSub = await prisma.subscription.findFirst({ where: { stripeSubId } });
    if (!dbSub) return;
    const statusMap: Record<string, "ACTIVE" | "PAST_DUE" | "CANCELED" | "INCOMPLETE" | "TRIALING"> = {
      active: "ACTIVE",
      past_due: "PAST_DUE",
      canceled: "CANCELED",
      incomplete: "INCOMPLETE",
      trialing: "TRIALING",
    };
    const st = statusMap[status] ?? "INCOMPLETE";
    await prisma.subscription.update({
      where: { id: dbSub.id },
      data: {
        status: st,
      },
    });
    if (st === "CANCELED") {
      await prisma.subscriptionAddOn.updateMany({
        where: { subscriptionId: dbSub.id },
        data: { active: false },
      });
    }
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const tenantId = session.metadata?.tenantId;
      if (tenantId) {
        await prisma.tenant.update({
          where: { id: tenantId },
          data: { status: "ACTIVE" },
        });
      }
      break;
    }
    case "customer.subscription.updated":
    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      await syncSubscription(sub.id, sub.status);
      break;
    }
    case "invoice.paid":
    case "invoice.payment_failed": {
      const inv = event.data.object as Stripe.Invoice;
      const sid = typeof inv.subscription === "string" ? inv.subscription : inv.subscription?.id;
      if (sid) {
        const sub = await stripe.subscriptions.retrieve(sid);
        await syncSubscription(sub.id, sub.status);
      }
      break;
    }
    default:
      break;
  }

  return NextResponse.json({ received: true });
}
