"use client";

import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function Form({ tenantSlug }: { tenantSlug: string }) {
  const sp = useSearchParams();
  const callbackUrl = sp.get("callbackUrl") || `/t/${tenantSlug}/admin`;
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!username.trim()) {
      setError("Username is required.");
      return;
    }
    if (!password) {
      setError("Password is required.");
      return;
    }
    setLoading(true);
    setError(null);
    const res = await signIn("credentials", {
      email: username.trim(),
      password,
      tenantSlug,
      redirect: false,
    });
    setLoading(false);
    if (res?.error) {
      setError("Access denied. Use a tenant admin or editor account for this case domain.");
      return;
    }
    window.location.href = callbackUrl;
  }

  return (
    <div className="mx-auto max-w-md px-4 py-20">
      <h1 className="text-2xl font-bold">Tenant admin login</h1>
      <p className="mt-2 text-sm text-neutral-600">{tenantSlug}</p>
      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <div>
          <Label htmlFor="username">Username</Label>
          <Input id="username" required value={username} onChange={(e) => setUsername(e.target.value)} className="mt-1" />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1" />
        </div>
        {error && <p className="text-sm text-red-700">{error}</p>}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Signing in…" : "Sign in"}
        </Button>
      </form>
    </div>
  );
}

export default function TenantAdminLoginPage({ params }: { params: { tenantSlug: string } }) {
  return (
    <Suspense fallback={<div className="p-8 text-sm">Loading…</div>}>
      <Form tenantSlug={params.tenantSlug} />
    </Suspense>
  );
}
