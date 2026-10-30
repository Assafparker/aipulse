"use client";

import { useCallback, useEffect, useMemo, useState, useTransition } from "react";
import { CategoryFilter } from "./category-filter";
import { FamilyFilter } from "./family-filter";
import { ItemCard } from "./item-card";
import { TopicPrefs } from "./topic-prefs";
import { ViewTabs, type View } from "./view-tabs";
import { LineMotion } from "@/components/motion/line-motion";
import { CATEGORIES, type CategoryId } from "@/lib/constants";
import { itemCount } from "@/lib/format";
import { isDimmed, sortItems } from "@/lib/ranking";
import type { FamilyId, Item, TopicId } from "@/lib/schema";
import {
  EMPTY,
  pruneToKnownIds,
  store,
  toggleId,
  type UserState,
} from "@/lib/user-state";

/**
 * The feed: filtering, sorting and the three reader actions.
 *
 * A client component, but the items arrive as a prop from the server page
 * rather than being fetched. That is what puts the full content in the
 * initial HTML, so the feed is server-rendered and indexable.
 *
 * All state goes through StateStore. Nothing here touches localStorage
 * directly — that boundary is what lets stage 6 swap in a synced store
 * without editing a single component.
 */

export function FeedList({ items }: { items: Item[] }) {
  const [state, setState] = useState<UserState>(EMPTY);
  const [hydrated, setHydrated] = useState(false);
  const [view, setView] = useState<View>("all");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [, startTransition] = useTransition();

  const knownIds = useMemo(() => new Set(items.map((i) => i.id)), [items]);

  /**
   * Hydrate after mount, never during the first render. The server sent
   * every item; hiding the ones this reader has already read happens
   * afterwards. The update runs inside a transition so React keeps showing
   * the current list while the filtered one renders, rather than flashing
   * an intermediate state.
   */
  useEffect(() => {
    let alive = true;
    void store.load().then((loaded) => {
      if (!alive) return;
      const pruned = pruneToKnownIds(loaded, knownIds);
      startTransition(() => {
        setState(pruned);
        setHydrated(true);
      });
    });
    return () => {
      alive = false;
    };
  }, [knownIds]);

  // Persist on every change, but never before hydration — otherwise the
  // initial EMPTY would overwrite whatever is already stored.
  useEffect(() => {
    if (!hydrated) return;
    void store.save(state);
  }, [state, hydrated]);

  const pinnedSet = useMemo(() => new Set(state.pinned), [state.pinned]);
  const savedSet = useMemo(() => new Set(state.saved), [state.saved]);
  const readSet = useMemo(() => new Set(state.read), [state.read]);
  const famOffSet = useMemo(() => new Set(state.famOff), [state.famOff]);
  const topicsOnSet = useMemo(
    () => new Set(state.topicsOn ?? []),
    [state.topicsOn],
  );
  const boosted = useMemo(
    () =>
      new Set(
        Object.entries(state.prefs)
          .filter(([, v]) => v === 1)
          .map(([k]) => k),
      ),
    [state.prefs],
  );

  const perFamily = useMemo(() => {
    const counts: Partial<Record<FamilyId, number>> = {};
    for (const i of items) counts[i.fam] = (counts[i.fam] ?? 0) + 1;
    return counts;
  }, [items]);

  const perTopic = useMemo(() => {
    const counts: Partial<Record<TopicId, number>> = {};
    for (const i of items)
      for (const t of i.topics) counts[t] = (counts[t] ?? 0) + 1;
    return counts;
  }, [items]);

  // Items touching the category through any of their topics, not only
  // those whose line it colours.
  const perCategory = useMemo(() => {
    const counts: Partial<Record<CategoryId, number>> = {};
    for (const c of CATEGORIES)
      counts[c.id] = items.filter((i) =>
        i.topics.some((t) => c.topics.includes(t)),
      ).length;
    return counts;
  }, [items]);

  /** The feed proper: both filters applied, read items removed. */
  const inFeed = useMemo(
    () =>
      items.filter(
        (i) =>
          !famOffSet.has(i.fam) &&
          !readSet.has(i.id) &&
          (topicsOnSet.size === 0 || i.topics.some((t) => topicsOnSet.has(t))),
      ),
    [items, famOffSet, readSet, topicsOnSet],
  );

  const readItems = useMemo(
    () => items.filter((i) => readSet.has(i.id)),
    [items, readSet],
  );

  const counts: Record<View, number> = {
    all: inFeed.length,
    pinned: state.pinned.length,
    saved: state.saved.length,
    read: state.read.length,
  };

  const listed = useMemo(() => {
    if (view === "pinned") return items.filter((i) => pinnedSet.has(i.id));
    if (view === "saved") return items.filter((i) => savedSet.has(i.id));
    return inFeed;
  }, [view, items, pinnedSet, savedSet, inFeed]);

  // Pinned items always form their own group at the top, sorted by the same
  // rule as the rest (SPEC.md 5).
  const pinnedGroup = useMemo(
    () =>
      view === "all"
        ? sortItems(
            listed.filter((i) => pinnedSet.has(i.id)),
            state.sort,
            state.prefs,
          )
        : [],
    [view, listed, pinnedSet, state.sort, state.prefs],
  );

  const mainGroup = useMemo(
    () =>
      sortItems(
        view === "all" ? listed.filter((i) => !pinnedSet.has(i.id)) : listed,
        state.sort,
        state.prefs,
      ),
    [view, listed, pinnedSet, state.sort, state.prefs],
  );

  const togglePin = useCallback(
    (id: string) =>
      setState((s) => ({ ...s, pinned: toggleId(s.pinned, id) })),
    [],
  );
  const toggleSave = useCallback(
    (id: string) => setState((s) => ({ ...s, saved: toggleId(s.saved, id) })),
    [],
  );
  const toggleRead = useCallback(
    (id: string) => setState((s) => ({ ...s, read: toggleId(s.read, id) })),
    [],
  );
  const toggleFamily = useCallback(
    (fam: FamilyId) =>
      setState((s) => ({ ...s, famOff: toggleId(s.famOff, fam) })),
    [],
  );
  const toggleTopic = useCallback(
    (topic: TopicId) =>
      setState((s) => ({ ...s, topicsOn: toggleId(s.topicsOn ?? [], topic) })),
    [],
  );
  // A category selects all its topics, or — when all are already on —
  // clears them.
  const toggleCategory = useCallback((id: CategoryId) => {
    const topics = CATEGORIES.find((c) => c.id === id)?.topics ?? [];
    setState((s) => {
      const current = s.topicsOn ?? [];
      const all = topics.every((t) => current.includes(t));
      return {
        ...s,
        topicsOn: all
          ? current.filter((t) => !topics.includes(t))
          : [...current, ...topics.filter((t) => !current.includes(t))],
      };
    });
  }, []);
  const clearTopics = useCallback(
    () => setState((s) => ({ ...s, topicsOn: [] })),
    [],
  );
  const setPref = useCallback((topic: TopicId, value: 1 | -1 | 0) => {
    setState((s) => {
      const prefs = { ...s.prefs };
      if (value === 0) delete prefs[topic];
      else prefs[topic] = value;
      return { ...s, prefs };
    });
  }, []);
  const setSort = useCallback(
    (sort: UserState["sort"]) => setState((s) => ({ ...s, sort })),
    [],
  );
  const toggleCompact = useCallback(
    () => setState((s) => ({ ...s, compact: !s.compact })),
    [],
  );
  const clearRead = useCallback(
    () => setState((s) => ({ ...s, read: [] })),
    [],
  );

  const renderCard = (item: Item) => (
    <li key={item.id}>
      <ItemCard
        item={item}
        pinned={pinnedSet.has(item.id)}
        saved={savedSet.has(item.id)}
        read={readSet.has(item.id)}
        dimmed={isDimmed(item, state.prefs)}
        boosted={boosted}
        compact={state.compact === true}
        actions={{
          onPin: () => togglePin(item.id),
          onSave: () => toggleSave(item.id),
          onRead: () => toggleRead(item.id),
        }}
      />
    </li>
  );


  // Re-paint lines for rows that newly appear when the list changes.
  const motionKey = [view, String(state.compact), ...pinnedGroup.map((i) => i.id), "|", ...mainGroup.map((i) => i.id)].join(",");

  return (
    <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
      <aside className="lg:w-72 lg:shrink-0">
        <button
          type="button"
          aria-expanded={filtersOpen}
          aria-controls="feed-filters"
          onClick={() => setFiltersOpen((o) => !o)}
          className="flex min-h-12 w-full items-center justify-between border border-sign-line bg-sign px-4 font-display text-[0.9375rem] font-semibold text-sign-ink lg:hidden"
        >
          סינון וכיוונון
          <svg
            viewBox="0 0 16 16"
            width="16"
            height="16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            aria-hidden="true"
            focusable="false"
            className={`transition-transform ${filtersOpen ? "rotate-180" : ""}`}
          >
            <path d="M3.5 6l4.5 4.5L12.5 6" />
          </svg>
        </button>

        <div
          id="feed-filters"
          className={`${filtersOpen ? "flex" : "hidden"} mt-4 flex-col gap-8 lg:mt-0 lg:flex`}
        >
          <ViewTabs view={view} counts={counts} onChange={setView} />

          <fieldset>
            <legend className="font-display text-sm font-semibold text-ink">מיון</legend>
            <div className="mt-3 grid grid-cols-3">
              {(
                [
                  { id: "added", label: "נוסף לאחרונה" },
                  { id: "date", label: "מהחדש לישן" },
                  { id: "pref", label: "לפי העדפות" },
                ] as const
              ).map((o) => (
                <button
                  key={o.id}
                  type="button"
                  aria-pressed={state.sort === o.id}
                  onClick={() => setSort(o.id)}
                  className="-ms-px min-h-11 sm:min-h-10 border border-rule px-1.5 font-display text-[0.8125rem] font-medium leading-tight text-ink-2 first:ms-0 hover:text-ink aria-pressed:relative aria-pressed:border-sign-line aria-pressed:bg-sign aria-pressed:text-sign-ink"
                >
                  {o.label}
                </button>
              ))}
            </div>
          </fieldset>

          <CategoryFilter
            selected={state.topicsOn ?? []}
            topicCounts={perTopic}
            categoryCounts={perCategory}
            onToggleTopic={toggleTopic}
            onToggleCategory={toggleCategory}
            onClear={clearTopics}
          />

          <FamilyFilter
            famOff={state.famOff}
            counts={perFamily}
            onToggle={toggleFamily}
          />

          <TopicPrefs prefs={state.prefs} onSet={setPref} />
        </div>
      </aside>

      <div className="min-w-0 grow">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-ink pb-2">
          <p
            className="font-display text-sm font-medium text-ink-2"
            aria-live="polite"
          >
            {view === "read" ? itemCount(counts.read) : itemCount(listed.length)}{" "}
            {view === "read" ? "ברשימת הנקראו" : "מוצגים"}
          </p>
          {view !== "read" && (
            <button
              type="button"
              aria-pressed={state.compact === true}
              onClick={toggleCompact}
              className="min-h-11 border border-rule px-3 font-display text-[0.8125rem] font-medium text-ink-2 transition-colors hover:border-ink-3 hover:text-ink aria-pressed:border-sign-line aria-pressed:bg-sign aria-pressed:text-sign-ink sm:min-h-10"
            >
              כותרות בלבד
            </button>
          )}
        </div>

        {view === "read" ? (
          <ReadView
            items={readItems}
            onRestore={toggleRead}
            onClear={clearRead}
          />
        ) : listed.length === 0 ? (
          <p className="mt-6 border border-dashed border-ink-3 p-6 text-ink-2">
            {view === "all"
              ? "אין פריטים להצגה. נסה לבחור נושאים נוספים או להדליק משפחות מקור שכיבית."
              : "הרשימה ריקה."}
          </p>
        ) : (
          <LineMotion dep={motionKey}>
            {pinnedGroup.length > 0 && (
              <section className="mb-8">
                <h2 className="mt-5 inline-block border border-sign-edge bg-sign px-3 py-1 font-display text-sm font-semibold text-sign-ink">
                  מוצמדים
                </h2>
                <ol>{pinnedGroup.map(renderCard)}</ol>
              </section>
            )}
            {/* The cards use <h3>, so the page needs an <h2> between them and
                the page <h1> or the heading order skips a level. */}
            <h2 className="sr-only">
              {pinnedGroup.length > 0 ? "שאר הפריטים" : "פריטים"}
            </h2>
            <ol>{mainGroup.map(renderCard)}</ol>
          </LineMotion>
        )}
      </div>
    </div>
  );
}

/**
 * The "read" view: a flat list of titles, each restorable, plus a way to
 * empty the list. Marking an item read hides it from this reader's feed and
 * nothing more — it never feeds back into the content or reaches anyone else.
 */
function ReadView({
  items,
  onRestore,
  onClear,
}: {
  items: Item[];
  onRestore: (id: string) => void;
  onClear: () => void;
}) {
  if (items.length === 0) {
    return (
      <p className="mt-6 border border-dashed border-ink-3 p-6 text-ink-2">
        עדיין לא סימנת פריטים כנקראו.
      </p>
    );
  }

  return (
    <div>
      <ul>
        {items.map((item) => (
          <li
            key={item.id}
            className="flex flex-wrap items-center justify-between gap-3 border-b border-rule py-3"
          >
            <span className="min-w-0 grow">
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-display text-[0.9375rem] font-medium text-ink hover:underline"
              >
                {item.title}
              </a>
              <time dateTime={item.date} className="ltr mt-0.5 block text-xs text-ink-3">
                {item.date}
              </time>
            </span>
            <button
              type="button"
              onClick={() => onRestore(item.id)}
              className="min-h-11 sm:min-h-10 border border-rule px-3 font-display text-[0.8125rem] font-medium text-ink-2 hover:border-ink-3 hover:text-ink"
            >
              החזר לפיד
            </button>
          </li>
        ))}
      </ul>
      <div className="pt-4">
        <button
          type="button"
          onClick={onClear}
          className="min-h-11 sm:min-h-10 font-display text-sm text-ink-2 underline hover:text-ink"
        >
          נקה את הרשימה
        </button>
      </div>
    </div>
  );
}
