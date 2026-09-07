import { FamilyIcon } from "@/components/ui/family-icon";
import { FAMILIES, TOPICS } from "@/lib/constants";
import type { Item } from "@/lib/schema";

/**
 * One feed item, per the layout in SPEC.md 6.
 *
 * Deliberately imports nothing from lib/content: that module pulls in the
 * whole of items.json, and this component is in the client bundle. Anything
 * derived from the full content set — `isNew` above all — arrives as a prop.
 *
 * `actions` is optional. The feed passes handlers and gets the button row;
 * the archive passes none and gets no buttons, rather than three controls
 * that look live and do nothing.
 */

const FAMILY_BY_ID = new Map(FAMILIES.map((f) => [f.id, f]));
const TOPIC_BY_ID = new Map(TOPICS.map((t) => [t.id, t]));

export type ItemActions = {
  onPin: () => void;
  onSave: () => void;
  onRead: () => void;
};

type Props = {
  item: Item;
  isNew?: boolean;
  pinned?: boolean;
  saved?: boolean;
  read?: boolean;
  /** Negative preference score: dimmed, never hidden (SPEC.md 5). */
  dimmed?: boolean;
  /** Topics the reader marked "more" — highlighted per SPEC.md 6. */
  boosted?: ReadonlySet<string>;
  actions?: ItemActions;
};

export function ItemCard({
  item,
  isNew = false,
  pinned = false,
  saved = false,
  read = false,
  dimmed = false,
  boosted,
  actions,
}: Props) {
  const family = FAMILY_BY_ID.get(item.fam);
  const isPrimary = family?.tier === "primary";

  return (
    <article
      className={`rounded-lg border border-line bg-surface p-4 transition-opacity sm:p-5 ${
        pinned ? "border-s-4 border-s-pin" : ""
      } ${dimmed ? "opacity-60" : ""}`}
    >
      {/* Row 1 — source family, and the badge for items from the latest scan */}
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
        <span className="inline-flex items-center gap-1.5 text-accent-ink">
          {/* Filled circle = primary source, hollow = secondary reporting */}
          <span
            className={`size-2 shrink-0 rounded-full border border-current ${
              isPrimary ? "bg-current" : ""
            }`}
            aria-hidden="true"
          />
          <FamilyIcon fam={item.fam} />
          <span className="text-sm font-medium">{family?.label ?? item.fam}</span>
        </span>
        <span className="sr-only">
          {isPrimary ? "מקור ראשוני" : "דיווח משני"}
        </span>
        {isNew && (
          <span className="rounded-full bg-accent-soft px-2 py-0.5 text-xs font-medium text-accent-ink">
            חדש
          </span>
        )}
        {pinned && (
          <span className="rounded-full bg-pin-soft px-2 py-0.5 text-xs font-medium text-pin">
            מוצמד
          </span>
        )}
      </div>

      {/* Row 2 — source name, date, topic tags */}
      <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-ink-3">
        <span className="text-ink-2">{item.src}</span>
        <span aria-hidden="true">·</span>
        <time dateTime={item.date} className="tnum ltr">
          {item.date}
        </time>
        {item.topics.map((t) => {
          const up = boosted?.has(t) ?? false;
          return (
            <span
              key={t}
              className={`rounded border px-1.5 py-0.5 ${
                up
                  ? "border-accent bg-accent-soft text-accent-ink"
                  : "border-line text-ink-2"
              }`}
            >
              {TOPIC_BY_ID.get(t)?.label ?? t}
            </span>
          );
        })}
      </div>

      {/* The linked title points at the primary source, never at coverage of it */}
      <h3 className="mt-3 text-lg leading-snug">
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-ink hover:text-accent hover:underline"
        >
          {item.title}
        </a>
      </h3>

      {/* The source's own headline, when the scan captured one. dir="auto"
          rather than a fixed direction: sources range from npj to משרד הבריאות,
          so the string itself decides, via its first strong character. Not the
          .ltr utility either — that class is for neutral strings like dates. */}
      {item.titleSrc ? (
        <p dir="auto" className="mt-1 text-sm leading-snug text-ink-2">
          {item.titleSrc}
        </p>
      ) : null}

      <p className="mt-2 font-light leading-relaxed text-ink-2">
        {item.summary}
      </p>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-3">
        {actions ? (
          <div className="flex flex-wrap gap-2">
            <StateButton
              label="הצמד"
              pressed={pinned}
              onClick={actions.onPin}
              title={`הצמד את "${item.title}" לראש הפיד`}
            />
            <StateButton
              label="שמור"
              pressed={saved}
              onClick={actions.onSave}
              title={`שמור את "${item.title}"`}
            />
            <StateButton
              label="כבר קראתי"
              pressed={read}
              onClick={actions.onRead}
              title={`הסר את "${item.title}" מהפיד שלי`}
            />
          </div>
        ) : (
          <span />
        )}
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-accent hover:underline"
        >
          למקור <span aria-hidden="true">↗</span>
          <span className="sr-only">(נפתח בלשונית חדשה)</span>
        </a>
      </div>
    </article>
  );
}

function StateButton({
  label,
  pressed,
  onClick,
  title,
}: {
  label: string;
  pressed: boolean;
  onClick: () => void;
  title: string;
}) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      title={title}
      onClick={onClick}
      className="rounded-md border border-line px-2.5 py-1 text-sm text-ink-2 hover:border-line-2 hover:text-ink aria-pressed:border-accent aria-pressed:bg-accent-soft aria-pressed:text-accent-ink"
    >
      {label}
    </button>
  );
}
