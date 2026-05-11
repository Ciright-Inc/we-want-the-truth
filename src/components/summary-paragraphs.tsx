export function SummaryParagraphs({ text, className = "" }: { text: string; className?: string }) {
  const parts = text.split(/\n\s*\n/).filter(Boolean);
  return (
    <div className={className}>
      {parts.map((p, i) => (
        <p key={i} className="mb-4 last:mb-0 whitespace-pre-wrap leading-relaxed">
          {p}
        </p>
      ))}
    </div>
  );
}
