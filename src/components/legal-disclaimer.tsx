export function PlatformDisclaimer({ className = "" }: { className?: string }) {
  return (
    <aside
      className={`rounded-xl border border-border/80 bg-card p-6 text-sm leading-relaxed text-neutral-700 shadow-soft-sm dark:border-border dark:bg-card dark:text-neutral-300 ${className}`}
    >
      <p className="font-semibold tracking-tight text-brand dark:text-red-400">Important</p>
      <ul className="mt-3 list-disc space-y-2 pl-5 marker:text-brand/50 dark:marker:text-red-400/50">
        <li>This platform is not legal advice.</li>
        <li>Users are solely responsible for the accuracy, legality, ownership, and publication rights of all content.</li>
        <li>We provide software tools only.</li>
        <li>All accusations must be presented as allegations unless legally proven.</li>
        <li>Users control their data, content, and responsibility.</li>
        <li>Public voting and comments are opinion only and are not a legal verdict.</li>
      </ul>
    </aside>
  );
}

export function JuryVoteDisclaimer() {
  return <p className="text-xs text-neutral-600 dark:text-neutral-400">Public jury votes are opinion only and are not legal findings.</p>;
}
