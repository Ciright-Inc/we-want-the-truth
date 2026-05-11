export default function SuperAdminStripePage() {
  return (
    <div className="p-8 lg:p-12">
      <h1 className="text-2xl font-bold">Stripe / Billing</h1>
      <p className="mt-3 max-w-2xl text-sm text-neutral-600">
        Configure product and price IDs for Advanced Admin, Video, Comments, domain setup, and pass-through fees. Webhook route:{" "}
        <code className="rounded bg-neutral-100 px-1">/api/stripe/webhook</code>.
      </p>
    </div>
  );
}
