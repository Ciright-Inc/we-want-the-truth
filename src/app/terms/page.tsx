import { SiteFooter } from "@/components/marketing/site-footer";
import { SiteHeader } from "@/components/marketing/site-header";

export default function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white text-black">
      <SiteHeader />
      <main className="mx-auto max-w-3xl flex-1 px-4 py-14">
        <h1 className="text-3xl font-bold">Terms of Service</h1>
        <p className="mt-4 text-sm text-neutral-600">Last updated: May 11, 2026</p>

        <h2 className="mt-10 text-xl font-semibold">1. Nature of the service</h2>
        <p className="mt-2 text-sm leading-relaxed text-neutral-800">
          We Want The Truth provides software tools only. The platform is not legal advice, not a law firm, not litigation funding, and not a substitute for courts or regulators. This platform is not legal advice. Users are solely responsible for the accuracy, legality, ownership, and publication rights of all content. We provide software tools only. All accusations must be presented as allegations unless legally proven. Users control their data, content, and responsibility. Public voting and comments are opinion only and are not a legal verdict.
        </p>

        <h2 className="mt-8 text-xl font-semibold">2. User ownership and license</h2>
        <p className="mt-2 text-sm leading-relaxed text-neutral-800">
          You retain ownership of content you lawfully upload. You grant the platform a limited license to host, transmit, and display your content solely to operate the service you configure (including public pages you publish).
        </p>

        <h2 className="mt-8 text-xl font-semibold">3. Platform non-liability</h2>
        <p className="mt-2 text-sm leading-relaxed text-neutral-800">
          To the maximum extent permitted by law, the platform and its operators disclaim liability for disputes between users and third parties, for outcomes of public commentary or voting, and for decisions you make based on information presented through the software.
        </p>

        <h2 className="mt-8 text-xl font-semibold">4. Content responsibility</h2>
        <p className="mt-2 text-sm leading-relaxed text-neutral-800">
          You warrant that you have the right to publish your materials and that your use complies with applicable law. You indemnify the platform against claims arising from your content or configuration, except where prohibited by law.
        </p>

        <h2 className="mt-8 text-xl font-semibold">5. Takedown policy</h2>
        <p className="mt-2 text-sm leading-relaxed text-neutral-800">
          We maintain a legal and abuse queue for reported content. We may remove or restrict content that violates law, these terms, or urgent safety requirements, and will document significant actions in audit logs where configured.
        </p>

        <h2 className="mt-8 text-xl font-semibold">6. Privacy</h2>
        <p className="mt-2 text-sm leading-relaxed text-neutral-800">
          See the Privacy Policy for data categories, retention, international transfers, and your GDPR-oriented rights.
        </p>

        <h2 className="mt-8 text-xl font-semibold">7. Moderation</h2>
        <p className="mt-2 text-sm leading-relaxed text-neutral-800">
          Tenant administrators may moderate comments where the comment management add-on is active. The platform may enforce baseline technical limits (rate limits, malware scanning hooks, and account restrictions).
        </p>

        <h2 className="mt-8 text-xl font-semibold">8. Subscriptions and billing</h2>
        <p className="mt-2 text-sm leading-relaxed text-neutral-800">
          Add-on subscriptions renew until canceled in Stripe. Failed payments may suspend paid features while preserving tenant content. Domain registration and infrastructure may be billed as pass-through fees plus the stated setup fee.
        </p>

        <h2 className="mt-8 text-xl font-semibold">9. Refunds</h2>
        <p className="mt-2 text-sm leading-relaxed text-neutral-800">
          Domain registration and third-party infrastructure fees generally follow registrar and cloud provider policies. Platform fees may be refundable where required by law or as described at checkout.
        </p>

        <h2 className="mt-8 text-xl font-semibold">10. Domain ownership</h2>
        <p className="mt-2 text-sm leading-relaxed text-neutral-800">
          Domains registered on your behalf are held in your name where the registrar supports it; otherwise, custodial arrangements will be disclosed at purchase. Connecting an existing domain requires DNS verification and may require transfer steps depending on your registrar.
        </p>
      </main>
      <SiteFooter />
    </div>
  );
}
