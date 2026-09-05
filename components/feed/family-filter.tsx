"use client";

import { FamilyIcon } from "@/components/ui/family-icon";
import { FAMILIES } from "@/lib/constants";
import type { FamilyId } from "@/lib/schema";

/**
 * Source-family toggles.
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
      <legend className="text-sm font-medium">משפחות מקור</legend>
      <ul className="mt-2 flex flex-col gap-1.5">
        {FAMILIES.filter((f) => !f.gap).map((f) => (
          <li key={f.id}>
            <label className="flex cursor-pointer items-center gap-2 text-sm text-ink-2 hover:text-ink">
              <input
                type="checkbox"
                checked={!off.has(f.id)}
                onChange={() => onToggle(f.id)}
                className="accent-[var(--accent)]"
              />
              <FamilyIcon fam={f.id} size={14} />
              <span className="grow">{f.label}</span>
              <span className="tnum text-xs text-ink-3">
                {counts[f.id] ?? 0}
              </span>
            </label>
          </li>
        ))}
      </ul>

      {FAMILIES.filter((f) => f.gap).map((f) => (
        <p key={f.id} className="mt-3 text-xs leading-relaxed text-ink-3">
          <span className="font-medium">{f.label}:</span> {f.gap}
        </p>
      ))}
    </fieldset>
  );
}
