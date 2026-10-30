import { CATEGORIES, TOPICS } from "@/lib/constants";

/**
 * The floor lines leaving the sign.
 *
 * `LineStrip` is the unlabelled band of four thin lines, one per topic
 * category in lane order, that runs out from under the indigo top sign on
 * every page. `LineLegend` is the compact key on the landing page: each
 * category's line swatch, name and topics, read once to learn which colour
 * leads to which department, then the two line patterns that tell primary
 * sources from secondary reporting. The strip is decorative; the legend's
 * labels are a real list.
 */

const TOPIC_LABEL = new Map(TOPICS.map((t) => [t.id, t.label]));

export function LineStrip() {
  return (
    <div className="flex flex-col gap-1 py-1" aria-hidden="true">
      {CATEGORIES.map((c) => (
        <span
          key={c.id}
          data-wake
          style={{ "--line": `var(--cat-${c.id})` } as React.CSSProperties}
          className="line-solid block h-1"
        />
      ))}
    </div>
  );
}

export function LineLegend() {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-8">
      <ul className="grid grid-cols-2 gap-x-4 gap-y-3 sm:flex sm:flex-wrap sm:gap-x-8">
        {CATEGORIES.map((c) => (
          <li
            key={c.id}
            style={{ "--line": `var(--cat-${c.id})` } as React.CSSProperties}
            className="min-w-0"
          >
            <span className="flex items-center gap-2 font-display text-[0.8125rem] font-semibold text-ink">
              <span aria-hidden="true" className="line-solid h-1 w-5 shrink-0" />
              {c.label}
            </span>
            <span className="mt-0.5 block ps-7 font-display text-xs leading-snug text-ink-3">
              {c.topics.map((t) => TOPIC_LABEL.get(t) ?? t).join(" · ")}
            </span>
          </li>
        ))}
      </ul>
      <ul
        aria-label="סוג המקור"
        className="flex flex-wrap gap-x-6 gap-y-2 border-t border-rule pt-3 sm:shrink-0 sm:border-t-0 sm:pt-0"
      >
        <li className="flex items-center gap-2 font-display text-xs text-ink-2">
          <span aria-hidden="true" className="line-solid h-1 w-6 shrink-0" />
          קו רציף: מקור ראשוני
        </li>
        <li className="flex items-center gap-2 font-display text-xs text-ink-2">
          <span aria-hidden="true" className="line-dashed-x h-1 w-6 shrink-0" />
          קו מקווקו: דיווח משני
        </li>
      </ul>
    </div>
  );
}
