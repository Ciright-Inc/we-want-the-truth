import { notFound } from "next/navigation";
import { getTenantAdminContext } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminBillingPage({ params }: { params: { tenantSlug: string } }) {
  const ctx = await getTenantAdminContext(params.tenantSlug);
  if (!ctx) notFound();

  const subs = await prisma.subscription.findMany({
    where: { tenantId: ctx.tenant.id },
    include: { addOns: true, invoices: { orderBy: { createdAt: "desc" }, take: 15 } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-6 lg:p-10">
      <h1 className="text-2xl font-bold">Billing</h1>
      <p className="mt-2 max-w-2xl text-sm text-neutral-600 dark:text-neutral-400">Stripe customer and subscription identifiers stored here; extend with Customer Portal links when keys are live.</p>
      <div className="mt-8 space-y-6">
        {subs.map((s) => (
          <div key={s.id} className="rounded-sm border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-950">
            <p className="font-semibold">Subscription {s.id.slice(0, 8)}…</p>
            <p className="text-sm text-neutral-600">Status: {s.status}</p>
            <p className="text-sm text-neutral-600">Stripe customer: {s.stripeCustomerId ?? "—"}</p>
            <p className="text-sm text-neutral-600">Stripe subscription: {s.stripeSubId ?? "—"}</p>
            <p className="mt-2 text-sm font-medium">Active add-ons</p>
            <ul className="list-disc pl-5 text-sm">
              {s.addOns
                .filter((a) => a.active)
                .map((a) => (
                  <li key={a.id}>
                    {a.type} {a.stripePriceId ? `(${a.stripePriceId})` : ""}
                  </li>
                ))}
            </ul>
            <p className="mt-3 text-sm font-medium">Recent invoices</p>
            <ul className="text-sm text-neutral-700 dark:text-neutral-300">
              {s.invoices.map((inv) => (
                <li key={inv.id}>
                  {inv.createdAt.toLocaleDateString()} — {(inv.amountCents / 100).toFixed(2)} {inv.currency.toUpperCase()} — {inv.status}
                </li>
              ))}
            </ul>
          </div>
        ))}
        {!subs.length && <p className="text-sm text-neutral-600">No subscription rows yet.</p>}
      </div>
    </div>
  );
}
