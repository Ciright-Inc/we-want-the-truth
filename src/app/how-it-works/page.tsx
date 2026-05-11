import Link from "next/link";
import { SiteFooter } from "@/components/marketing/site-footer";
import { SiteHeader } from "@/components/marketing/site-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const steps = [
  "Search and secure your case domain",
  "Create your case profile",
  "Upload filings, evidence, video, audio, emails, images, and PDFs",
  "Build a dated factual timeline",
  "Publish your public case page",
  "Invite the public to review, comment, and vote",
  "Manage everything from your admin panel",
];

export default function HowItWorksPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white text-black dark:bg-black dark:text-white">
      <SiteHeader />
      <main className="mx-auto max-w-6xl flex-1 px-4 py-14">
        <h1 className="text-3xl font-bold tracking-tight">How It Works</h1>
        <p className="mt-3 max-w-2xl text-neutral-700 dark:text-neutral-300">
          A disciplined workflow from domain to publication. You stay in control; the platform stays in its lane as software.
        </p>
        <ol className="mt-10 grid gap-4 md:grid-cols-2">
          {steps.map((s, i) => (
            <li key={s}>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">
                    <span className="mr-2 text-neutral-400">{String(i + 1).padStart(2, "0")}</span>
                    {s}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-neutral-600 dark:text-neutral-400">Structured for clarity and auditability at every step.</CardContent>
              </Card>
            </li>
          ))}
        </ol>
        <p className="mt-10 text-sm text-neutral-600 dark:text-neutral-400">
          Ready to begin?{" "}
          <Link href="/secure-domain" className="font-semibold text-red-700 underline dark:text-red-400">
            Secure your case domain
          </Link>
          .
        </p>
      </main>
      <SiteFooter />
    </div>
  );
}
