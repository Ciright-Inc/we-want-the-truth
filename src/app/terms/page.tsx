import { SiteFooter } from "@/components/marketing/site-footer";
import { SiteHeader } from "@/components/marketing/site-header";
import { ShieldCheck } from "lucide-react";

const sections = [
  {
    title: "Nature of the service",
    body: "We Want The Truth provides software tools only. The platform is not legal advice, not a law firm, not litigation funding, and not a substitute for courts or regulators. Users are solely responsible for the accuracy, legality, ownership, and publication rights of all content. Allegations should be presented as allegations unless legally proven. Public comments and voting are opinion-based features and are not legal verdicts.",
  },
  {
    title: "User ownership and license",
    body: "You retain ownership of content you lawfully upload. You grant the platform a limited license to host, transmit, and display your content solely to operate the service you configure, including public pages you choose to publish.",
  },
  {
    title: "Platform non-liability",
    body: "To the maximum extent permitted by law, the platform and its operators disclaim liability for disputes between users and third parties, for outcomes of public commentary or voting, and for decisions made based on information presented through the software.",
  },
  {
    title: "Content responsibility",
    body: "You warrant that you have the right to publish your materials and that your use complies with applicable law. You agree to indemnify the platform against claims arising from your content or configuration, except where prohibited by law.",
  },
  {
    title: "Takedown policy",
    body: "We maintain a legal and abuse queue for reported content. We may remove or restrict content that violates law, these terms, or urgent safety requirements, and we may log significant actions in audit systems where configured.",
  },
  {
    title: "Privacy",
    body: "Please review the Privacy Policy for data categories, retention, international transfers, and GDPR-oriented rights.",
  },
  {
    title: "Moderation",
    body: "Tenant administrators may moderate comments where the comment-management add-on is active. The platform may enforce baseline technical safeguards such as rate limits, malware scanning hooks, and account restrictions.",
  },
  {
    title: "Subscriptions and billing",
    body: "Add-on subscriptions renew until canceled through Stripe. Failed payments may suspend paid features while preserving tenant content. Domain registration and infrastructure may be billed as pass-through fees plus the stated onboarding fee.",
  },
  {
    title: "Refunds",
    body: "Domain registration and third-party infrastructure fees generally follow registrar and cloud provider policies. Platform fees may be refundable where required by law or as described at checkout.",
  },
  {
    title: "Domain ownership",
    body: "Domains registered on your behalf are held in your name where the registrar supports it; otherwise, custodial arrangements are disclosed at purchase. Connecting an existing domain requires DNS verification and may require transfer steps based on registrar policy.",
  },
];

export default function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <SiteHeader />
      <main className="hero-surface flex-1 border-b border-border/60">
        <section className="mx-auto max-w-6xl px-4 pb-16 pt-14 sm:px-6 sm:pb-20 sm:pt-16">
          <div className="rounded-2xl border border-border/70 bg-card/95 p-6 shadow-soft-sm ring-1 ring-black/[0.02] dark:ring-white/[0.04] sm:p-8">
            <div className="max-w-3xl space-y-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand dark:text-red-400">Legal</p>
              <h1 className="font-serif text-3xl font-semibold tracking-tight sm:text-4xl">Terms of Service</h1>
              <p className="text-sm text-muted-foreground">Last updated: May 11, 2026</p>
              {/* <div className="rounded-xl border border-brand/15 bg-brand-muted/35 px-4 py-3 text-sm leading-relaxed text-muted-foreground dark:border-brand/25 dark:bg-brand/10">
                <span className="inline-flex items-center gap-1.5 font-medium text-foreground">
                  <AlertTriangle className="h-4 w-4 text-brand dark:text-red-400" aria-hidden />
                  Important:
                </span>{" "}
                This platform provides software infrastructure and publication tooling. It does not provide legal advice.
              </div> */}
            </div>

            <div className="mt-8 space-y-4">
              {sections.map((section, index) => (
                <article
                  key={section.title}
                  className="rounded-xl border border-border/70 bg-background/90 p-5 ring-1 ring-black/[0.015] dark:ring-white/[0.03] sm:p-6"
                >
                  <h2 className="flex items-center gap-2.5 text-lg font-semibold tracking-tight text-foreground sm:text-[1.2rem]">
                    <span className="inline-flex h-7 min-w-7 items-center justify-center rounded-md bg-brand-muted px-1.5 text-xs font-semibold text-brand dark:bg-brand/20 dark:text-red-400">
                      {index + 1}
                    </span>
                    {section.title}
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground sm:text-[0.96rem]">{section.body}</p>
                </article>
              ))}
            </div>

            <div className="mt-8 rounded-xl border border-border/70 bg-neutral-50/90 p-4 text-xs leading-relaxed text-muted-foreground dark:bg-neutral-950/40">
              <p className="inline-flex items-center gap-1.5 font-medium text-foreground">
                <ShieldCheck className="h-3.5 w-3.5 text-brand dark:text-red-400" aria-hidden />
                Documentation note:
              </p>{" "}
              These terms describe platform operation and allocation of responsibilities. For data handling details, see the Privacy Policy.
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
