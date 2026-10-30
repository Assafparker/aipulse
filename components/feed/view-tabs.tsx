"use client";

export type View = "all" | "pinned" | "saved" | "read";

const TABS: { id: View; label: string }[] = [
  { id: "all", label: "הכול" },
  { id: "pinned", label: "מוצמדים" },
  { id: "saved", label: "שמורים" },
  { id: "read", label: "נקראו" },
];

/** The four views, set as one segmented sign plate. */
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
      <ul className="grid grid-cols-4">
        {TABS.map(({ id, label }) => (
          <li key={id} className="-ms-px first:ms-0">
            <button
              type="button"
              aria-pressed={view === id}
              onClick={() => onChange(id)}
              className="flex min-h-12 w-full flex-col items-center justify-center border border-rule font-display text-[0.8125rem] font-medium text-ink-2 hover:text-ink aria-pressed:relative aria-pressed:border-sign-line aria-pressed:bg-sign aria-pressed:text-sign-ink"
            >
              {label}
              {/* The count inherits the button's colour outright, so it
                  keeps full contrast in both states. */}
              <span className="tnum text-xs leading-4">{counts[id]}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
