import Link from "next/link";
import { SiteFooter } from "@/components/marketing/site-footer";
import { SiteHeader } from "@/components/marketing/site-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function PricingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white text-black dark:bg-black dark:text-white">
      <SiteHeader />
      <main className="mx-auto max-w-6xl flex-1 px-4 py-14">
        <h1 className="text-3xl font-bold tracking-tight">Pricing</h1>
        <p className="mt-3 max-w-2xl text-neutral-700 dark:text-neutral-300">Transparent economics. Core tools to manage your record are free; infrastructure and advanced controls are billed fairly.</p>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Base platform</CardTitle>
              <Badge variant="success">Free to manage content</Badge>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-neutral-700 dark:text-neutral-300">
              <p>Organize matter data, publish public pages, and retain ownership of your material.</p>
              <p className="font-medium text-black dark:text-white">You own and control all data. We provide the tool only.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Paid add-ons</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between border-b border-neutral-100 py-2 dark:border-neutral-800">
                <span>Super Admin / Advanced Controls</span>
                <span className="font-semibold">$9.99/mo</span>
              </div>
              <div className="flex justify-between border-b border-neutral-100 py-2 dark:border-neutral-800">
                <span>Video Management</span>
                <span className="font-semibold">$9.99/mo</span>
              </div>
              <div className="flex justify-between py-2">
                <span>Comment Management</span>
                <span className="font-semibold">$9.99/mo</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-8 border-red-200 dark:border-red-900/50">
          <CardHeader>
            <CardTitle className="text-red-800 dark:text-red-300">Domain and deployment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-neutral-700 dark:text-neutral-300">
            <p>Domain registration at pass-through registrar cost.</p>
            <p>AWS / hosting deployment pass-through.</p>
            <p className="font-semibold text-black dark:text-white">$49.99 platform setup and service fee per onboarding.</p>
            <p>All card charges are processed through Stripe.</p>
          </CardContent>
        </Card>

        <p className="mt-8 text-sm text-neutral-600 dark:text-neutral-400">
          <Link href="/secure-domain" className="font-semibold text-red-700 underline dark:text-red-400">
            Start domain checkout
          </Link>
        </p>
      </main>
      <SiteFooter />
    </div>
  );
}
