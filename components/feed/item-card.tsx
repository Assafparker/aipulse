import { FamilyIcon } from "@/components/ui/family-icon";
import { CATEGORIES, FAMILIES, TOPICS, lineCategory } from "@/lib/constants";
import type { Item } from "@/lib/schema";

/**
 * One feed item: a row standing on its category's floor line.
 *
 * Deliberately imports nothing from lib/content: that module pulls in the
 * whole of items.json, and this component is in the client bundle. Anything
 * derived from the full content set arrives as a prop.
 *
 * The rail at the inline start holds one lane per topic category. The item's
 * own lane is painted in the colour of its first topic's category — solid
 * for a primary source, dashed for secondary reporting — and branches to the
 * headline. Source family stays text; it carries no colour. Rows stack with
 * no gap between them so the lanes run unbroken down the list.
 *
 * `actions` is optional. The feed passes handlers and gets the button row;
 * the archive passes none and gets no buttons, rather than three controls
 * that look live and do nothing.
 */

const FAMILY_BY_ID = new Map(FAMILIES.map((f) => [f.id, f]));
const TOPIC_BY_ID = new Map(TOPICS.map((t) => [t.id, t]));
const CATEGORY_BY_ID = new Map(CATEGORIES.map((c) => [c.id, c]));
const LANE_INDEX = new Map(CATEGORIES.map((c, i) => [c.id, i]));

export type ItemActions = {
  onPin: () => void;
  onSave: () => void;
  onRead: () => void;
};

type Props = {
  item: Item;
  pinned?: boolean;
  saved?: boolean;
  read?: boolean;
  /** Negative preference score: dimmed, never hidden (SPEC.md 5). */
  dimmed?: boolean;
  /** Topics the reader marked "more" — highlighted. */
  boosted?: ReadonlySet<string>;
  /** Headlines only: the summary, source headline and tags are collapsed. */
  compact?: boolean;
  actions?: ItemActions;
};

export function ItemCard({
  item,
  pinned = false,
  saved = false,
  read = false,
  dimmed = false,
  boosted,
  compact = false,
  actions,
}: Props) {
  const family = FAMILY_BY_ID.get(item.fam);
  const isPrimary = family?.tier === "primary";
  const cat = lineCategory(item.topics);
  const category = CATEGORY_BY_ID.get(cat);
  const laneIndex = LANE_INDEX.get(cat) ?? 0;
  const lineStyle = {
    "--line": `var(--cat-${cat})`,
    "--lane-i": laneIndex,
  } as React.CSSProperties;

  return (
    <article
      style={lineStyle}
      className={`lined flex gap-[var(--card-gap)] transition-opacity ${dimmed ? "opacity-60" : ""}`}
    >
      <div className="rail" aria-hidden="true">
        {CATEGORIES.map((c) => (
          <span key={c.id} className="lane" />
        ))}
        <span
          data-lane
          className={`lane-on ${isPrimary ? "line-solid" : "line-dashed-y"}`}
        />
      </div>

      <div className="min-w-0 grow border-b border-rule pb-5 pt-3 sm:pb-6">
        {/* Row 1 — source family and source at the start, the two dates at
            the end */}
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-display text-[0.8125rem]">
            <span className="inline-flex items-center gap-1.5 font-medium text-ink">
              <PrimaryDot primary={isPrimary} />
              <span className="text-ink-3" aria-hidden="true">
                <FamilyIcon fam={item.fam} size={16} />
              </span>
              {family?.label ?? item.fam}
            </span>
            <span className="sr-only">
              {isPrimary ? "מקור ראשוני" : "דיווח משני"}
              {compact && category ? `, ${category.label}` : ""}
            </span>
            <span className="text-ink-2">{item.src}</span>
            {pinned && (
              <span className="bg-sign px-2 py-0.5 text-xs font-medium text-sign-ink">
                מוצמד
              </span>
            )}
          </div>
          {/* `added` is the day the scan put the item on the site; `date` is
              the day the source published it. */}
          <dl className="flex flex-wrap items-baseline gap-x-2 text-xs leading-5">
            <dt className="text-ink-3">תאריך עדכון</dt>
            <dd>
              <time dateTime={item.added} className="ltr font-medium text-ink">
                {item.added}
              </time>
            </dd>
            <dt className="ms-1 border-s border-rule ps-3 text-ink-3">תאריך פרסום</dt>
            <dd>
              <time dateTime={item.date} className="ltr text-ink-2">
                {item.date}
              </time>
            </dd>
          </dl>
        </div>

        {/* The linked title points at the primary source, never at coverage
            of it */}
        <h3 className="relative mt-2 text-[1.1875rem] font-semibold leading-snug tracking-[-0.005em] sm:text-[1.3125rem]">
          {/* The line turns off its lane and runs into the headline */}
          <span
            data-bend
            aria-hidden="true"
            className={`title-bend ${isPrimary ? "" : "bend-dashed"}`}
          />
          <span
            data-branch
            aria-hidden="true"
            className={`title-branch ${isPrimary ? "line-solid" : "line-dashed-x"}`}
          />
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-ink decoration-[var(--line)] decoration-2 hover:underline"
          >
            {item.title}
            <span className="sr-only"> (נפתח בלשונית חדשה)</span>
          </a>
        </h3>

        {/* The source's own headline, when the scan captured one. dir="auto":
            the string itself decides, via its first strong character. */}
        {!compact && item.titleSrc ? (
          <p dir="auto" className="mt-1 font-display text-sm leading-snug text-ink-2">
            {item.titleSrc}
          </p>
        ) : null}

        {compact ? null : (
          <>
        <p className="mt-2 max-w-[64ch] text-base leading-[1.6] text-ink-2 sm:text-[1.0625rem] sm:leading-[1.65]">
          {item.summary}
        </p>

        <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
          {/* The department the line leads to, named so the colour is never
              the only signal */}
          {category ? (
            <span className="me-1 inline-flex items-center gap-1.5 font-display text-xs font-semibold text-ink">
              <span aria-hidden="true" className="line-solid h-1 w-3.5" />
              {category.label}
            </span>
          ) : null}
          {item.topics.map((t) => {
            const up = boosted?.has(t) ?? false;
            return (
              <span
                key={t}
                className={`px-2 py-0.5 font-display text-xs ${
                  up ? "bg-sign text-sign-ink" : "bg-floor-2 text-ink-2"
                }`}
              >
                {TOPIC_BY_ID.get(t)?.label ?? t}
              </span>
            );
          })}
        </div>

          </>
        )}

        <div className={`flex flex-wrap items-center gap-x-2 gap-y-2 ${compact ? "mt-1.5" : "mt-3"}`}>
          {actions ? (
            <>
              <StateButton
                label="הצמד"
                compact={compact}
                pressed={pinned}
                onClick={actions.onPin}
                title={`הצמד את "${item.title}" לראש הפיד`}
              />
              <StateButton
                label="שמור"
                compact={compact}
                pressed={saved}
                onClick={actions.onSave}
                title={`שמור את "${item.title}"`}
              />
              {/* The action that removes the item stands apart from the two
                  that keep it. */}
              <span className="w-3 sm:w-6" aria-hidden="true" />
              <StateButton
                label="כבר קראתי"
                compact={compact}
                pressed={read}
                onClick={actions.onRead}
                title={`הסר את "${item.title}" מהפיד שלי`}
              />
            </>
          ) : null}
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="ms-auto inline-flex min-h-11 sm:min-h-10 items-center gap-1.5 font-display text-sm font-medium text-ink hover:underline"
          >
            למקור
            <ExternalIcon />
            <span className="sr-only">(נפתח בלשונית חדשה)</span>
          </a>
        </div>
      </div>
    </article>
  );
}

/** Filled circle = primary source, hollow = secondary reporting. Neutral
    ink: source type never takes a category colour. */
export function PrimaryDot({ primary }: { primary: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`size-2.5 shrink-0 rounded-full border-2 border-ink-2 ${
        primary ? "bg-ink-2" : ""
      }`}
    />
  );
}

function ExternalIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      width="14"
      height="14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="square"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M6 3H13V10" />
      <path d="M13 3L3.5 12.5" />
    </svg>
  );
}

function StateButton({
  label,
  pressed,
  onClick,
  title,
  compact = false,
}: {
  label: string;
  pressed: boolean;
  onClick: () => void;
  title: string;
  compact?: boolean;
}) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      title={title}
      onClick={onClick}
      className={`${compact ? "min-h-10" : "min-h-11 sm:min-h-10"} border border-rule px-3 font-display text-[0.8125rem] font-medium text-ink-2 transition-colors hover:border-ink-3 hover:text-ink aria-pressed:border-sign aria-pressed:bg-sign aria-pressed:text-sign-ink`}
    >
      {label}
    </button>
  );
}
