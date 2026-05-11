import { CheckCircle2, CreditCard, KeyRound, ShieldCheck, Sparkles, Webhook } from "lucide-react";

export default function SuperAdminStripePage() {
  const priceKeys = [
    "STRIPE_PRICE_ADVANCED_ADMIN",
    "STRIPE_PRICE_VIDEO",
    "STRIPE_PRICE_COMMENTS",
    "STRIPE_PRICE_DOMAIN_SETUP",
  ];

  return (
    <div className="h-full w-full">
      <div className="flex min-h-[calc(100vh-3rem)] flex-col rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm sm:p-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-red-600">Payments infrastructure</p>
            <h1 className="mt-1 font-serif text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl">Stripe / Billing</h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-neutral-600">
              Configure Stripe products, prices, and webhook processing for platform billing and add-on activation.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs font-medium text-neutral-600">
            <Sparkles className="h-3.5 w-3.5 text-red-500" aria-hidden />
            Billing mode: configuration-ready
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:mt-6 sm:gap-4 sm:grid-cols-3">
          <article className="rounded-xl border border-neutral-200 bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
            <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Core provider</p>
            <div className="mt-2 flex items-center justify-between">
              <p className="text-xl font-semibold tracking-tight text-neutral-900">Stripe</p>
              <CreditCard className="h-5 w-5 text-red-500" aria-hidden />
            </div>
          </article>
          <article className="rounded-xl border border-neutral-200 bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
            <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Webhook route</p>
            <div className="mt-2 flex items-center justify-between gap-3">
              <code className="rounded bg-neutral-100 px-2 py-1 text-xs font-medium text-neutral-800">/api/stripe/webhook</code>
              <Webhook className="h-5 w-5 shrink-0 text-red-500" aria-hidden />
            </div>
          </article>
          <article className="rounded-xl border border-neutral-200 bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
            <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Security</p>
            <div className="mt-2 flex items-center justify-between">
              <p className="text-sm font-semibold text-neutral-900">Signed events required</p>
              <ShieldCheck className="h-5 w-5 text-emerald-600" aria-hidden />
            </div>
          </article>
        </div>

        <div className="mt-5 grid gap-3 sm:mt-6 sm:gap-4 lg:grid-cols-2">
          <section className="rounded-xl border border-neutral-200 bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)] sm:p-5">
            <p className="text-sm font-semibold text-neutral-900">Required environment keys</p>
            <p className="mt-1 text-xs text-neutral-500">Set these values in deployment environment before enabling paid features.</p>
            <ul className="mt-4 space-y-2">
              <li className="inline-flex w-full items-center gap-2 rounded-md bg-neutral-50 px-3 py-2 text-xs text-neutral-700">
                <KeyRound className="h-3.5 w-3.5 text-red-500" aria-hidden />
                STRIPE_SECRET_KEY
              </li>
              <li className="inline-flex w-full items-center gap-2 rounded-md bg-neutral-50 px-3 py-2 text-xs text-neutral-700">
                <KeyRound className="h-3.5 w-3.5 text-red-500" aria-hidden />
                STRIPE_WEBHOOK_SECRET
              </li>
              <li className="inline-flex w-full items-center gap-2 rounded-md bg-neutral-50 px-3 py-2 text-xs text-neutral-700">
                <KeyRound className="h-3.5 w-3.5 text-red-500" aria-hidden />
                NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
              </li>
              {priceKeys.map((key) => (
                <li key={key} className="inline-flex w-full items-center gap-2 rounded-md bg-neutral-50 px-3 py-2 text-xs text-neutral-700">
                  <KeyRound className="h-3.5 w-3.5 text-red-500" aria-hidden />
                  {key}
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-xl border border-neutral-200 bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)] sm:p-5">
            <p className="text-sm font-semibold text-neutral-900">Activation checklist</p>
            <p className="mt-1 text-xs text-neutral-500">Recommended rollout sequence for billing setup.</p>
            <ul className="mt-4 space-y-2.5 text-sm text-neutral-700">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-600" aria-hidden />
                <span>Create Stripe products and recurring prices for each add-on module.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-600" aria-hidden />
                <span>Set all Stripe env variables in production and verify boot-time startup logs.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-600" aria-hidden />
                <span>Register webhook endpoint and enable invoice + subscription events.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-600" aria-hidden />
                <span>Run a test checkout and confirm subscription/add-on records are updated.</span>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
