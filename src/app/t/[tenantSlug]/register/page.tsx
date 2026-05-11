"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlatformDisclaimer } from "@/components/legal-disclaimer";

export default function TenantRegisterPage({ params }: { params: { tenantSlug: string } }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [accept, setAccept] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!accept) {
      setError("You must accept the terms.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          tenantSlug: params.tenantSlug,
          acceptTerms: true as const,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Registration failed");
      router.push(`/t/${params.tenantSlug}/login`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-16">
      <h1 className="text-2xl font-bold">Create account</h1>
      <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">Join the public record for this matter.</p>
      <PlatformDisclaimer />
      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <div>
          <Label htmlFor="name">Display name</Label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="mt-1" />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1" />
        </div>
        <div>
          <Label htmlFor="password">Password (min 10 characters)</Label>
          <Input id="password" type="password" required minLength={10} value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1" />
        </div>
        <label className="flex items-start gap-2 text-sm">
          <input type="checkbox" checked={accept} onChange={(e) => setAccept(e.target.checked)} className="mt-1" />
          <span>I accept the Terms of Service and Privacy Policy, and I understand this platform is not legal advice.</span>
        </label>
        {error && <p className="text-sm text-red-700">{error}</p>}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Creating…" : "Register"}
        </Button>
      </form>
      <p className="mt-6 text-sm">
        <Link href={`/t/${params.tenantSlug}/login`} className="underline">
          Back to login
        </Link>
      </p>
    </div>
  );
}
