"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function LoginForm({ tenantSlug }: { tenantSlug: string }) {
  const sp = useSearchParams();
  const callbackUrl = sp.get("callbackUrl") || `/t/${tenantSlug}`;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await signIn("credentials", {
      email,
      password,
      tenantSlug,
      redirect: false,
    });
    setLoading(false);
    if (res?.error) {
      setError("Invalid credentials or tenant mismatch.");
      return;
    }
    window.location.href = callbackUrl;
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="text-2xl font-bold">Login</h1>
      <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">Case: {tenantSlug}</p>
      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1" />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="mt-1" />
        </div>
        {error && <p className="text-sm text-red-700">{error}</p>}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Signing in…" : "Sign in"}
        </Button>
      </form>
      <p className="mt-6 text-sm text-neutral-600 dark:text-neutral-400">
        No account?{" "}
        <Link href={`/t/${tenantSlug}/register`} className="font-semibold underline">
          Register
        </Link>
      </p>
    </div>
  );
}

export default function TenantLoginPage({ params }: { params: { tenantSlug: string } }) {
  return (
    <Suspense fallback={<div className="p-8 text-sm">Loading…</div>}>
      <LoginForm tenantSlug={params.tenantSlug} />
    </Suspense>
  );
}
