"use client";

export type View = "all" | "pinned" | "saved" | "read";

const TABS: { id: View; label: string }[] = [
  { id: "all", label: "הכול" },
  { id: "pinned", label: "מוצמדים" },
  { id: "saved", label: "שמורים" },
  { id: "read", label: "נקראו" },
];

export function ViewTabs({
  view,
  counts,
  onChange,
}: {
  view: View;
  counts: Record<View, number>;
  onChange: (v: View) => void;
}) {
  return (
    <nav aria-label="תצוגות">
      <ul className="flex flex-wrap gap-2">
        {TABS.map(({ id, label }) => (
          <li key={id}>
            <button
              type="button"
              aria-pressed={view === id}
              onClick={() => onChange(id)}
              className="rounded-md border border-line px-2.5 py-1 text-sm text-ink-2 hover:border-line-2 hover:text-ink aria-pressed:border-accent aria-pressed:bg-accent-soft aria-pressed:text-accent-ink"
            >
              {label}{" "}
              <span className="tnum text-xs text-ink-3">{counts[id]}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
