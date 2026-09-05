"use client";

import { TOPICS } from "@/lib/constants";
import type { TopicId } from "@/lib/schema";
import type { UserState } from "@/lib/user-state";

/**
 * Topic preferences: each topic is "more", "less", or neutral.
 *
 * The choice highlights matching tags in the feed, and under the "by
 * preferences" sort it also drives the order. A topic marked "less" only
 * dims its items — nothing here hides anything.
 */

const CHOICES: { value: 1 | -1 | 0; label: string; short: string }[] = [
  { value: 1, label: "יותר", short: "+" },
  { value: 0, label: "ניטרלי", short: "·" },
  { value: -1, label: "פחות", short: "−" },
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
      <legend className="text-sm font-medium">נושאים</legend>
      <ul className="mt-2 flex flex-col gap-1.5">
        {TOPICS.map((t) => {
          const current = prefs[t.id] ?? 0;
          return (
            <li key={t.id} className="flex items-center gap-2">
              <span className="grow text-sm text-ink-2">{t.label}</span>
              <span
                className="flex gap-1"
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
                    className="size-6 rounded border border-line text-xs text-ink-3 hover:border-line-2 hover:text-ink aria-pressed:border-accent aria-pressed:bg-accent-soft aria-pressed:text-accent-ink"
                  >
                    {c.short}
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
