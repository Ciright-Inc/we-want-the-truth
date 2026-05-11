"use client";

import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { ArrowRight, KeyRound, LockKeyhole, Mail, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function Form() {
  const sp = useSearchParams();
  const callbackUrl = sp.get("callbackUrl") || "/super-admin";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const nextFieldErrors: { email?: string; password?: string } = {};
    if (!email.trim()) nextFieldErrors.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) nextFieldErrors.email = "Enter a valid email.";
    if (!password) nextFieldErrors.password = "Password is required.";
    if (Object.keys(nextFieldErrors).length) {
      setFieldErrors(nextFieldErrors);
      return;
    }
    setFieldErrors({});
    setLoading(true);
    setError(null);
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    setLoading(false);
    if (res?.error) {
      setError("Invalid credentials.");
      return;
    }
    window.location.href = callbackUrl;
  }

  return (
    <div className="hero-surface flex min-h-screen items-center justify-center px-4 py-10 sm:px-6">
      <div className="w-full max-w-md rounded-2xl border border-border/70 bg-card/95 p-6 shadow-soft ring-1 ring-black/[0.03] dark:ring-white/[0.06] sm:p-8">
        <div className="mb-6 space-y-4">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-muted text-brand dark:bg-brand/20 dark:text-red-400">
            <LockKeyhole className="h-5 w-5" aria-hidden />
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand dark:text-red-400">Restricted Access</p>
            <h1 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-foreground">Super admin login</h1>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Platform operations only. Use an authorized super-admin account to continue.</p>
          </div>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email" className="text-foreground">
              Email
            </Label>
            <div className="relative mt-1.5">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (fieldErrors.email) setFieldErrors((prev) => ({ ...prev, email: undefined }));
                }}
                className="h-11 border-border/80 bg-background pl-9"
              />
            </div>
            {fieldErrors.email ? <p className="mt-1 text-xs text-red-600 dark:text-red-400">{fieldErrors.email}</p> : null}
          </div>
          <div>
            <Label htmlFor="password" className="text-foreground">
              Password
            </Label>
            <div className="relative mt-1.5">
              <KeyRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (fieldErrors.password) setFieldErrors((prev) => ({ ...prev, password: undefined }));
                }}
                className="h-11 border-border/80 bg-background pl-9"
              />
            </div>
            {fieldErrors.password ? <p className="mt-1 text-xs text-red-600 dark:text-red-400">{fieldErrors.password}</p> : null}
          </div>
          {error && <p className="text-sm font-medium text-red-600 dark:text-red-400">{error}</p>}
          <Button type="submit" size="lg" className="w-full" disabled={loading}>
            {loading ? "Signing in..." : "Sign in to Console"}
            {!loading ? <ArrowRight className="ml-1.5 h-4 w-4" aria-hidden /> : null}
          </Button>
        </form>

        <p className="mt-5 inline-flex items-center gap-1.5 whitespace-nowrap text-xs leading-relaxed text-muted-foreground">
          <ShieldCheck className="h-3.5 w-3.5 text-brand dark:text-red-400" aria-hidden />
          Access is monitored and restricted to verified platform operators.
        </p>
      </div>
    </div>
  );
}

export default function SuperAdminLoginPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading…</div>}>
      <Form />
    </Suspense>
  );
}
