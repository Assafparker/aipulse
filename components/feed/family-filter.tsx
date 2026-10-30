"use client";

import { FamilyIcon } from "@/components/ui/family-icon";
import { FAMILIES } from "@/lib/constants";
import type { FamilyId } from "@/lib/schema";

/**
 * Source-family toggles, the secondary filter. Families carry no colour —
 * colour belongs to the topic categories — only the line pattern: solid for
 * a primary source, dashed for secondary reporting.
 *
 * A family carrying a `gap` is not a source that can be scanned — social
 * networks block automated scanning — so it gets its explanation rather than
 * a checkbox. Per SPEC.md 3.2 it is shown with that text and is not counted
 * as an active source, and no item may carry fam: "social".
 */
export function FamilyFilter({
  famOff,
  counts,
  onToggle,
}: {
  famOff: FamilyId[];
  counts: Partial<Record<FamilyId, number>>;
  onToggle: (id: FamilyId) => void;
}) {
  const off = new Set(famOff);

  return (
    <fieldset>
      <legend className="font-display text-sm font-semibold text-ink">
        סוג מקור
      </legend>
      <ul className="mt-3 flex flex-col">
        {FAMILIES.filter((f) => !f.gap).map((f) => {
          const on = !off.has(f.id);
          return (
            <li key={f.id}>
              <label className="flex min-h-11 sm:min-h-10 cursor-pointer items-center gap-2.5 font-display text-sm text-ink-2 hover:text-ink">
                {/* See search-box.tsx: extensions restyle inputs before
                    hydration; this covers this element's attributes only. */}
                <input
                  suppressHydrationWarning
                  type="checkbox"
                  checked={on}
                  onChange={() => onToggle(f.id)}
                  className="size-4 accent-[var(--sign)]"
                />
                <span
                  aria-hidden="true"
                  className={`h-1 w-6 shrink-0 transition-opacity ${
                    f.tier === "primary" ? "line-solid" : "line-dashed-x"
                  } ${on ? "" : "opacity-20"}`}
                />
                <span className="text-ink-3" aria-hidden="true">
                  <FamilyIcon fam={f.id} size={15} />
                </span>
                <span className={`grow ${on ? "" : "line-through"}`}>
                  {f.label}
                </span>
                <span className="tnum text-xs text-ink-3">
                  {counts[f.id] ?? 0}
                </span>
              </label>
            </li>
          );
        })}
      </ul>

      {FAMILIES.filter((f) => f.gap).map((f) => (
        <p key={f.id} className="mt-3 text-sm leading-relaxed text-ink-3">
          <span className="font-semibold text-ink-2">{f.label}:</span> {f.gap}
        </p>
      ))}
    </fieldset>
  );
}
