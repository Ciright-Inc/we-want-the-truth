"use client";

import { useState } from "react";
import Link from "next/link";
import { SiteFooter } from "@/components/marketing/site-footer";
import { SiteHeader } from "@/components/marketing/site-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SecureDomainPage() {
  const [domain, setDomain] = useState("");
  const [result, setResult] = useState<{ available?: boolean; priceCents?: number } | null>(null);
  const [loading, setLoading] = useState(false);

  async function check() {
    setLoading(true);
    try {
      const res = await fetch(`/api/domain/search?domain=${encodeURIComponent(domain)}`);
      const data = await res.json();
      setResult(data);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-white text-black">
      <SiteHeader />
      <main className="mx-auto max-w-xl flex-1 px-4 py-14">
        <h1 className="text-3xl font-bold">Secure your case domain</h1>
        <p className="mt-3 text-sm text-neutral-700">Search availability. Checkout, provisioning, and DNS steps integrate with Stripe and the domain abstraction layer.</p>
        <div className="mt-8 space-y-4">
          <div>
            <Label htmlFor="domain">Desired domain</Label>
            <Input id="domain" placeholder="example-case.com" value={domain} onChange={(e) => setDomain(e.target.value)} className="mt-1" />
          </div>
          <Button type="button" variant="destructive" onClick={check} disabled={loading || domain.length < 3}>
            {loading ? "Checking…" : "Check availability"}
          </Button>
          {result && (
            <div className="rounded-sm border border-neutral-200 p-4 text-sm">
              <p className="font-semibold">{result.available ? "Potentially available (stub check)" : "Unavailable (reserved stub)"}</p>
              {result.priceCents != null && <p className="mt-2 text-neutral-600">Illustrative registrar price: ${(result.priceCents / 100).toFixed(2)}</p>}
              <p className="mt-2 text-xs text-neutral-500">Add AWS/hosting pass-through + $49.99 setup at Stripe checkout when keys are configured.</p>
            </div>
          )}
        </div>
        <p className="mt-10 text-sm">
          <Link href="/pricing" className="underline">
            View full pricing
          </Link>
        </p>
      </main>
      <SiteFooter />
    </div>
  );
}
