"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type Row = { id: string; body: string; createdAt: string; user: { name: string | null; email: string } };

export function CommentSection({
  tenantSlug,
  comments,
  canComment,
}: {
  tenantSlug: string;
  comments: Row[];
  canComment: boolean;
}) {
  const { status } = useSession();
  const router = useRouter();
  const [body, setBody] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit() {
    if (status !== "authenticated") {
      router.push(`/t/${tenantSlug}/login?callbackUrl=${encodeURIComponent(`/t/${tenantSlug}#comments`)}`);
      return;
    }
    setLoading(true);
    setMsg(null);
    try {
      const res = await fetch(`/api/tenants/${tenantSlug}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Failed");
      setBody("");
      setMsg("Comment submitted and is pending review where moderation applies.");
      router.refresh();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="comments" className="scroll-mt-24 space-y-4">
      <h2 className="text-xl font-semibold">Public Comments</h2>
      <p className="text-sm text-neutral-600 dark:text-neutral-400">Registration is required to comment. Comments may be moderated.</p>
      {canComment && (
        <div className="space-y-2">
          <Textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="Share a factual, respectful comment…" rows={4} />
          <Button type="button" onClick={submit} disabled={loading || body.trim().length < 3}>
            Submit Comment
          </Button>
          {msg && <p className="text-sm text-neutral-700 dark:text-neutral-300">{msg}</p>}
        </div>
      )}
      {!canComment && (
        <p className="rounded-sm border border-neutral-200 bg-neutral-50 p-3 text-sm dark:border-neutral-800 dark:bg-neutral-900">
          Comment management is not active for this tenant. Please upgrade to enable submissions.
        </p>
      )}
      <ul className="space-y-3">
        {comments.map((c) => (
          <li key={c.id} className="rounded-sm border border-neutral-200 p-3 text-sm dark:border-neutral-800">
            <p className="text-xs font-medium text-neutral-500">{new Date(c.createdAt).toLocaleString()}</p>
            <p className="mt-1 font-medium">{c.user.name || c.user.email}</p>
            <p className="mt-2 whitespace-pre-wrap text-neutral-800 dark:text-neutral-200">{c.body}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
