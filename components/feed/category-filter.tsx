"use client";

import { useEffect, useRef } from "react";
import { CATEGORIES, TOPICS, UNCATEGORIZED } from "@/lib/constants";
import type { CategoryId } from "@/lib/constants";
import type { TopicId } from "@/lib/schema";

/**
 * The main filter: the four line categories, each with its topics as
 * text-only sub-filters beneath it.
 *
 * Inclusive, not exclusive: nothing selected shows everything; once anything
 * is selected, an item shows when ANY of its topics is selected — not just
 * the first one that sets its line colour. A category is a shorthand for all
 * of its topics: it reads checked when every one is selected and mixed when
 * only some are. Israel sits outside every category and gets a plain chip.
 */

const TOPIC_LABEL = new Map(TOPICS.map((t) => [t.id, t.label]));

export function CategoryFilter({
  selected,
  topicCounts,
  categoryCounts,
  onToggleTopic,
  onToggleCategory,
  onClear,
}: {
  selected: TopicId[];
  topicCounts: Partial<Record<TopicId, number>>;
  categoryCounts: Partial<Record<CategoryId, number>>;
  onToggleTopic: (id: TopicId) => void;
  onToggleCategory: (id: CategoryId) => void;
  onClear: () => void;
}) {
  const on = new Set(selected);

  return (
    <fieldset>
      <legend className="font-display text-sm font-semibold text-ink">
        קטגוריות ונושאים
      </legend>
      <div className="mt-1 flex min-h-10 items-center justify-between gap-3">
        <p className="text-xs leading-snug text-ink-3">
          {selected.length > 0
            ? "מוצגים פריטים שאחד מהנושאים שלהם נבחר."
            : "ללא בחירה מוצג הכול."}
        </p>
        {selected.length > 0 && (
          <button
            type="button"
            onClick={onClear}
            className="min-h-11 sm:min-h-10 shrink-0 font-display text-xs text-ink-2 underline hover:text-ink"
          >
            הצג הכול
          </button>
        )}
      </div>

      <ul className="mt-3 flex flex-col gap-3">
        {CATEGORIES.map((c) => {
          const count = c.topics.filter((t) => on.has(t)).length;
          return (
            <li
              key={c.id}
              style={{ "--line": `var(--cat-${c.id})` } as React.CSSProperties}
            >
              <CategoryRow
                label={c.label}
                checked={count === c.topics.length}
                mixed={count > 0 && count < c.topics.length}
                count={categoryCounts[c.id] ?? 0}
                onChange={() => onToggleCategory(c.id)}
              />
              <ul className="ms-[2.375rem] flex flex-col">
                {c.topics.map((t) => (
                  <li key={t}>
                    <TopicRow
                      label={TOPIC_LABEL.get(t) ?? t}
                      checked={on.has(t)}
                      count={topicCounts[t] ?? 0}
                      onChange={() => onToggleTopic(t)}
                    />
                  </li>
                ))}
              </ul>
            </li>
          );
        })}
      </ul>

      <div className="mt-3 flex flex-wrap gap-2 border-t border-rule pt-3">
        {UNCATEGORIZED.map((t) => (
          <button
            key={t}
            type="button"
            aria-pressed={on.has(t)}
            onClick={() => onToggleTopic(t)}
            className="min-h-11 sm:min-h-10 border border-rule px-3 font-display text-[0.8125rem] font-medium text-ink-2 hover:border-ink-3 hover:text-ink aria-pressed:border-sign aria-pressed:bg-sign aria-pressed:text-sign-ink"
          >
            {TOPIC_LABEL.get(t) ?? t}
            <span className="tnum ms-2 text-xs opacity-75">{topicCounts[t] ?? 0}</span>
          </button>
        ))}
      </div>
    </fieldset>
  );
}

function CategoryRow({
  label,
  checked,
  mixed,
  count,
  onChange,
}: {
  label: string;
  checked: boolean;
  mixed: boolean;
  count: number;
  onChange: () => void;
}) {
  // `indeterminate` exists only as a DOM property, never as an attribute.
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (ref.current) ref.current.indeterminate = mixed;
  }, [mixed]);

  return (
    <label className="flex min-h-11 sm:min-h-10 cursor-pointer items-center gap-2.5 font-display text-sm font-semibold text-ink">
      {/* See search-box.tsx: extensions restyle inputs before hydration;
          this covers this element's attributes only. */}
      <input
        ref={ref}
        suppressHydrationWarning
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="size-4 accent-[var(--sign)]"
      />
      <span aria-hidden="true" className="line-solid h-1 w-6 shrink-0" />
      <span className="grow">{label}</span>
      <span className="tnum text-xs font-normal text-ink-3">{count}</span>
    </label>
  );
}

function TopicRow({
  label,
  checked,
  count,
  onChange,
}: {
  label: string;
  checked: boolean;
  count: number;
  onChange: () => void;
}) {
  return (
    <label className="flex min-h-11 sm:min-h-9 cursor-pointer items-center gap-2.5 font-display text-[0.8125rem] text-ink-2 hover:text-ink">
      <input
        suppressHydrationWarning
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="size-3.5 accent-[var(--sign)]"
      />
      <span className="grow">{label}</span>
      <span className="tnum text-xs text-ink-3">{count}</span>
    </label>
  );
}
