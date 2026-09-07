"use client";

import { useCallback, useEffect, useMemo, useState, useTransition } from "react";
import { FamilyFilter } from "./family-filter";
import { ItemCard } from "./item-card";
import { TopicPrefs } from "./topic-prefs";
import { ViewTabs, type View } from "./view-tabs";
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

export function FeedList({
  items,
  lastScan,
}: {
  items: Item[];
  lastScan: string;
}) {
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

  /** The feed proper: family filter applied, read items removed. */
  const inFeed = useMemo(
    () => items.filter((i) => !famOffSet.has(i.fam) && !readSet.has(i.id)),
    [items, famOffSet, readSet],
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
  const clearRead = useCallback(
    () => setState((s) => ({ ...s, read: [] })),
    [],
  );

  const renderCard = (item: Item) => (
    <li key={item.id}>
      <ItemCard
        item={item}
        isNew={item.added === lastScan}
        pinned={pinnedSet.has(item.id)}
        saved={savedSet.has(item.id)}
        read={readSet.has(item.id)}
        dimmed={isDimmed(item, state.prefs)}
        boosted={boosted}
        actions={{
          onPin: () => togglePin(item.id),
          onSave: () => toggleSave(item.id),
          onRead: () => toggleRead(item.id),
        }}
      />
    </li>
  );

  return (
    <div className="flex flex-col gap-8 lg:flex-row">
      <aside className="lg:w-64 lg:shrink-0">
        <button
          type="button"
          aria-expanded={filtersOpen}
          onClick={() => setFiltersOpen((o) => !o)}
          className="w-full rounded-md border border-line px-3 py-2 text-sm lg:hidden"
        >
          סינון וכיוונון
        </button>

        <div
          className={`${filtersOpen ? "flex" : "hidden"} mt-3 flex-col gap-6 lg:mt-0 lg:flex`}
        >
          <ViewTabs view={view} counts={counts} onChange={setView} />

          <fieldset>
            <legend className="text-sm font-medium">מיון</legend>
            <div className="mt-2 flex gap-2">
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
                  className="rounded-md border border-line px-2.5 py-1 text-sm text-ink-2 hover:border-line-2 hover:text-ink aria-pressed:border-accent aria-pressed:bg-accent-soft aria-pressed:text-accent-ink"
                >
                  {o.label}
                </button>
              ))}
            </div>
          </fieldset>

          <FamilyFilter
            famOff={state.famOff}
            counts={perFamily}
            onToggle={toggleFamily}
          />

          <TopicPrefs prefs={state.prefs} onSet={setPref} />
        </div>
      </aside>

      <div className="min-w-0 grow">
        <p className="mb-4 text-sm text-ink-3" aria-live="polite">
          {view === "read" ? itemCount(counts.read) : itemCount(listed.length)}{" "}
          {view === "read" ? "ברשימת הנקראו" : "מוצגים"}
        </p>

        {view === "read" ? (
          <ReadView
            items={readItems}
            onRestore={toggleRead}
            onClear={clearRead}
          />
        ) : listed.length === 0 ? (
          <p className="rounded-lg border border-line bg-surface p-6 text-ink-3">
            {view === "all"
              ? "אין פריטים להצגה. נסה להדליק משפחות מקור שכיבית."
              : "הרשימה ריקה."}
          </p>
        ) : (
          <>
            {pinnedGroup.length > 0 && (
              <section className="mb-6">
                <h2 className="mb-3 text-sm font-medium text-pin">מוצמדים</h2>
                <ol className="flex flex-col gap-4">
                  {pinnedGroup.map(renderCard)}
                </ol>
              </section>
            )}
            {/* The cards use <h3>, so the page needs an <h2> between them and
                the page <h1> or the heading order skips a level. */}
            <h2 className="sr-only">
              {pinnedGroup.length > 0 ? "שאר הפריטים" : "פריטים"}
            </h2>
            <ol className="flex flex-col gap-4">{mainGroup.map(renderCard)}</ol>
          </>
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
      <p className="rounded-lg border border-line bg-surface p-6 text-ink-3">
        עדיין לא סימנת פריטים כנקראו.
      </p>
    );
  }

  return (
    <div className="rounded-lg border border-line bg-surface">
      <ul className="divide-y divide-line">
        {items.map((item) => (
          <li
            key={item.id}
            className="flex flex-wrap items-center justify-between gap-3 p-3"
          >
            <span className="min-w-0 grow">
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm hover:text-accent hover:underline"
              >
                {item.title}
              </a>
              <span className="tnum ltr mt-0.5 block text-xs text-ink-3">
                {item.date}
              </span>
            </span>
            <button
              type="button"
              onClick={() => onRestore(item.id)}
              className="rounded-md border border-line px-2.5 py-1 text-sm text-ink-2 hover:border-line-2 hover:text-ink"
            >
              החזר לפיד
            </button>
          </li>
        ))}
      </ul>
      <div className="border-t border-line p-3">
        <button
          type="button"
          onClick={onClear}
          className="text-sm text-ink-3 hover:text-ink hover:underline"
        >
          נקה את הרשימה
        </button>
      </div>
    </div>
  );
}
