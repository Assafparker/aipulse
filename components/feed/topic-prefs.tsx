"use client";

import { CATEGORIES, TOPICS, UNCATEGORIZED } from "@/lib/constants";
import type { TopicId } from "@/lib/schema";
import type { UserState } from "@/lib/user-state";

/**
 * Topic preferences: each topic is "more", "less", or neutral.
 *
 * The choice highlights matching tags in the feed, and under the "by
 * preferences" sort it also drives the order. A topic marked "less" only
 * dims its items — nothing here hides anything. Listed in category order,
 * matching the filter above it.
 */

const TOPIC_BY_ID = new Map(TOPICS.map((t) => [t.id, t]));
const ORDERED = [...CATEGORIES.flatMap((c) => c.topics), ...UNCATEGORIZED]
  .map((id) => TOPIC_BY_ID.get(id))
  .filter((t) => t !== undefined);

const CHOICES: { value: 1 | -1 | 0; label: string; glyph: React.ReactNode }[] = [
  { value: 1, label: "יותר", glyph: <path d="M8 3.5v9M3.5 8h9" /> },
  { value: 0, label: "ניטרלי", glyph: <circle cx="8" cy="8" r="1.4" fill="currentColor" stroke="none" /> },
  { value: -1, label: "פחות", glyph: <path d="M3.5 8h9" /> },
];

export function TopicPrefs({
  prefs,
  onSet,
}: {
  prefs: UserState["prefs"];
  onSet: (topic: TopicId, value: 1 | -1 | 0) => void;
}) {
  return (
    <fieldset>
      <legend className="font-display text-sm font-semibold text-ink">העדפות נושא</legend>
      <ul className="mt-3 flex flex-col gap-0.5">
        {ORDERED.map((t) => {
          const current = prefs[t.id] ?? 0;
          return (
            <li key={t.id} className="flex min-h-11 sm:min-h-10 items-center gap-2">
              <span className="grow font-display text-sm text-ink-2">{t.label}</span>
              <span
                className="flex"
                role="group"
                aria-label={`העדפה עבור ${t.label}`}
              >
                {CHOICES.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    aria-pressed={current === c.value}
                    aria-label={`${c.label} — ${t.label}`}
                    title={c.label}
                    onClick={() => onSet(t.id, c.value)}
                    className="-ms-px grid size-9 place-items-center border border-rule text-ink-3 first:ms-0 hover:text-ink aria-pressed:relative aria-pressed:border-sign aria-pressed:bg-sign aria-pressed:text-sign-ink"
                  >
                    <svg
                      viewBox="0 0 16 16"
                      width="14"
                      height="14"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      aria-hidden="true"
                      focusable="false"
                    >
                      {c.glyph}
                    </svg>
                  </button>
                ))}
              </span>
            </li>
          );
        })}
      </ul>
    </fieldset>
  );
}
