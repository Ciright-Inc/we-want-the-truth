import { SiteFooter } from "@/components/marketing/site-footer";
import { SiteHeader } from "@/components/marketing/site-header";

export default function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white text-black">
      <SiteHeader />
      <main className="mx-auto max-w-3xl flex-1 px-4 py-14">
        <h1 className="text-3xl font-bold">Privacy Policy</h1>
        <p className="mt-4 text-sm text-neutral-600">Last updated: May 11, 2026 (GDPR-aware framing)</p>

        <section className="mt-10 space-y-3 text-sm leading-relaxed text-neutral-800">
          <h2 className="text-xl font-semibold text-black">Controller</h2>
          <p>The operator of We Want The Truth acts as a data controller for platform accounts, billing metadata, and operational logs. Tenants control publication of case materials on their configured public pages.</p>

          <h2 className="mt-8 text-xl font-semibold text-black">Data we process</h2>
          <ul className="list-disc space-y-2 pl-5">
            <li>Account identifiers (email, hashed password, optional profile fields).</li>
            <li>Tenant configuration, uploaded files, and editorial metadata you provide.</li>
            <li>Technical telemetry such as page views, video play analytics, and security logs.</li>
            <li>Payment data handled by Stripe (we do not store full card numbers on our application database).</li>
          </ul>

          <h2 className="mt-8 text-xl font-semibold text-black">Legal bases (GDPR)</h2>
          <p>We rely on contract performance for service delivery, legitimate interests for security and product improvement, and consent where required (for example, non-essential cookies where applicable).</p>

          <h2 className="mt-8 text-xl font-semibold text-black">Your rights</h2>
          <p>You may request access, rectification, erasure, restriction, portability, and objection where applicable. Contact the operator through the addresses published on the marketing site. You may also lodge a complaint with your supervisory authority.</p>

          <h2 className="mt-8 text-xl font-semibold text-black">Deletion and export</h2>
          <p>Administrators can remove content from public display; underlying backups may persist for a limited technical retention window. Export tooling can be extended per tenant for structured matter exports.</p>

          <h2 className="mt-8 text-xl font-semibold text-black">Cookies</h2>
          <p>Session cookies support authentication. Additional analytics cookies, if introduced, will be disclosed and configured through a consent mechanism.</p>

          <h2 className="mt-8 text-xl font-semibold text-black">Stripe</h2>
          <p>Payments are processed subject to Stripe&apos;s privacy policy. We store Stripe customer and subscription identifiers required to operate billing.</p>

          <h2 className="mt-8 text-xl font-semibold text-black">Document storage</h2>
          <p>Files are stored in AWS S3 (or compatible object storage) with access controlled through signed URLs and tenant-scoped keys. A virus-scan placeholder hook exists for integration.</p>

          <h2 className="mt-8 text-xl font-semibold text-black">Public content warning</h2>
          <p className="rounded-sm border border-red-200 bg-red-50 p-3 text-red-900">
            Publishing a public case page may expose information worldwide. You are responsible for redaction, third-party rights, and lawful basis for publication.
          </p>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
