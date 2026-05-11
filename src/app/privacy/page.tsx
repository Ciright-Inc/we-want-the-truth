import { SiteFooter } from "@/components/marketing/site-footer";
import { SiteHeader } from "@/components/marketing/site-header";
import { AlertTriangle, Database, LockKeyhole, ShieldCheck } from "lucide-react";

const sections = [
  {
    title: "Controller",
    body: "The operator of We Want The Truth acts as data controller for platform accounts, billing metadata, and operational logs. Tenants control publication choices for case materials shown on their configured public pages.",
  },
  {
    title: "Data we process",
    bullets: [
      "Account identifiers (email, hashed password, and optional profile fields).",
      "Tenant configuration, uploaded files, and editorial metadata you provide.",
      "Technical telemetry such as page views, video-play analytics, and security logs.",
      "Billing metadata processed with Stripe; full card numbers are not stored in our application database.",
    ],
  },
  {
    title: "Legal bases (GDPR)",
    body: "We rely on contract performance for service delivery, legitimate interests for platform security and product improvement, and consent where required for non-essential processing.",
  },
  {
    title: "Your rights",
    body: "Where applicable, you may request access, rectification, erasure, restriction, portability, and objection. You may contact the operator through addresses listed on the marketing site and can lodge a complaint with your supervisory authority.",
  },
  {
    title: "Deletion and export",
    body: "Administrators can remove content from public display. Technical backups may persist for a limited retention window. Structured export tooling can be extended per tenant configuration.",
  },
  {
    title: "Cookies",
    body: "Session cookies are used for authentication and secure access. If non-essential analytics cookies are introduced, they are disclosed and controlled through consent mechanisms.",
  },
  {
    title: "Stripe",
    body: "Payments are processed under Stripe's privacy policy. We store only Stripe customer and subscription identifiers required to run billing operations.",
  },
  {
    title: "Document storage",
    body: "Files are stored in AWS S3 or compatible object storage with signed URL access and tenant-scoped keys. A malware-scan integration hook is available for deployment hardening.",
  },
];

export default function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <SiteHeader />
      <main className="hero-surface flex-1 border-b border-border/60">
        <section className="mx-auto max-w-6xl px-4 pb-16 pt-14 sm:px-6 sm:pb-20 sm:pt-16">
          <div className="rounded-2xl border border-border/70 bg-card/95 p-6 shadow-soft-sm ring-1 ring-black/[0.02] dark:ring-white/[0.04] sm:p-8">
            <div className="max-w-3xl space-y-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand dark:text-red-400">Legal</p>
              <h1 className="font-serif text-3xl font-semibold tracking-tight sm:text-4xl">Privacy Policy</h1>
              <p className="text-sm text-muted-foreground">Last updated: May 11, 2026 (GDPR-aware framing)</p>
              <div className="rounded-xl border border-brand/15 bg-brand-muted/35 px-4 py-3 text-sm leading-relaxed text-muted-foreground dark:border-brand/25 dark:bg-brand/10">
                <span className="inline-flex items-center gap-1.5 font-medium text-foreground">
                  <LockKeyhole className="h-4 w-4 text-brand dark:text-red-400" aria-hidden />
                  Privacy summary:
                </span>{" "}
                We collect only operational data required to provide service functionality, security, and billing workflows.
              </div>
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
                  {section.body ? (
                    <p className="mt-3 text-sm leading-7 text-muted-foreground sm:text-[0.96rem]">{section.body}</p>
                  ) : null}
                  {section.bullets ? (
                    <ul className="mt-3 space-y-2 text-sm leading-7 text-muted-foreground sm:text-[0.96rem]">
                      {section.bullets.map((item) => (
                        <li key={item} className="flex gap-2">
                          <Database className="mt-1 h-4 w-4 shrink-0 text-brand dark:text-red-400" aria-hidden />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </article>
              ))}
            </div>

            <div className="mt-8 rounded-xl border border-amber-300/55 bg-amber-50/90 p-4 text-xs leading-relaxed text-amber-900 dark:border-amber-700/45 dark:bg-amber-950/30 dark:text-amber-100">
              <p className="inline-flex items-center gap-1.5 font-medium">
                <AlertTriangle className="h-3.5 w-3.5" aria-hidden />
                Public content warning:
              </p>{" "}
              Publishing a public case page may expose information worldwide. You are responsible for redaction, third-party rights, and lawful basis for publication.
            </div>

            <div className="mt-4 rounded-xl border border-border/70 bg-neutral-50/90 p-4 text-xs leading-relaxed text-muted-foreground dark:bg-neutral-950/40">
              <p className="inline-flex items-center gap-1.5 font-medium text-foreground">
                <ShieldCheck className="h-3.5 w-3.5 text-brand dark:text-red-400" aria-hidden />
                Compliance note:
              </p>{" "}
              This policy describes processing roles and data behavior at platform level; tenant operators remain responsible for the legality of published content.
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
