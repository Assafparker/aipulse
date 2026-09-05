import { FAMILIES, TOPICS } from "./constants";
import type { FamilyId, TopicId } from "./schema";

/**
 * Reader state, per SPEC.md 4.
 *
 * Ids only, never objects: the content itself lives in the repo, so storing
 * titles and urls would only duplicate it and go stale.
 *
 * This module imports no React and nothing from lib/content. The type-only
 * import above is erased at compile time, which keeps Zod and the whole of
 * items.json out of the client bundle.
 */

export type UserState = {
  version: 1;
  updatedAt: string; // ISO timestamp. Unused in stage 1; stage 6 resolves conflicts with it.
  prefs: Partial<Record<TopicId, 1 | -1>>;
  pinned: string[];
  saved: string[];
  read: string[]; // ids only — the content is already in the repo
  famOff: FamilyId[];
  sort: "date" | "pref";
};

const KEY = "aipulse:v1";

export const EMPTY: UserState = {
  version: 1,
  updatedAt: "1970-01-01T00:00:00.000Z",
  prefs: {},
  pinned: [],
  saved: [],
  read: [],
  famOff: [],
  sort: "date",
};

/**
 * The boundary that makes stage 6 cheap. Stage 1 ships LocalStore only;
 * stage 6 adds a SyncedStore that wraps it behind this same interface.
 * No component may touch localStorage directly — if one does, stage 6
 * turns into a rewrite, which is exactly what this interface prevents.
 */
export interface StateStore {
  load(): Promise<UserState>;
  save(s: UserState): Promise<void>;
}

const TOPIC_IDS = new Set<string>(TOPICS.map((t) => t.id));
const FAMILY_IDS = new Set<string>(FAMILIES.map((f) => f.id));

const stringsOf = (v: unknown): string[] =>
  Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : [];

/**
 * localStorage can hold anything: an older schema, a hand-edited value, or
 * truncated JSON. Everything read back is checked before it is trusted.
 */
function normalize(raw: unknown): UserState {
  if (typeof raw !== "object" || raw === null) return EMPTY;
  const o = raw as Record<string, unknown>;

  // Migration rule: a version that is not 1 is discarded, never upgraded.
  if (o.version !== 1) return EMPTY;

  const prefs: UserState["prefs"] = {};
  if (typeof o.prefs === "object" && o.prefs !== null) {
    for (const [k, v] of Object.entries(o.prefs as Record<string, unknown>)) {
      if (TOPIC_IDS.has(k) && (v === 1 || v === -1)) prefs[k as TopicId] = v;
    }
  }

  return {
    version: 1,
    updatedAt: typeof o.updatedAt === "string" ? o.updatedAt : EMPTY.updatedAt,
    prefs,
    pinned: stringsOf(o.pinned),
    saved: stringsOf(o.saved),
    read: stringsOf(o.read),
    famOff: stringsOf(o.famOff).filter((f): f is FamilyId => FAMILY_IDS.has(f)),
    sort: o.sort === "pref" ? "pref" : "date",
  };
}

class LocalStore implements StateStore {
  async load(): Promise<UserState> {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw === null) return EMPTY;
      return normalize(JSON.parse(raw));
    } catch {
      // Private browsing, blocked storage, or malformed JSON. Reading state
      // is never worth breaking the page over — fall back to a clean slate.
      return EMPTY;
    }
  }

  async save(state: UserState): Promise<void> {
    try {
      // updatedAt is stamped at write time, on every save, so stage 6 can
      // resolve cross-device conflicts without a schema migration.
      localStorage.setItem(
        KEY,
        JSON.stringify({ ...state, updatedAt: new Date().toISOString() }),
      );
    } catch {
      // Storage is unavailable or full. The reader carries on for this
      // session; the marks simply are not durable.
    }
  }
}

export const store: StateStore = new LocalStore();

/**
 * Ids that no longer exist in the content are dropped silently on read.
 * The known ids are passed in rather than imported, so this module never
 * pulls items.json into the client bundle.
 */
export function pruneToKnownIds(
  state: UserState,
  knownIds: ReadonlySet<string>,
): UserState {
  const keep = (ids: string[]) => ids.filter((id) => knownIds.has(id));
  return {
    ...state,
    pinned: keep(state.pinned),
    saved: keep(state.saved),
    read: keep(state.read),
  };
}

/** Generic so famOff keeps its FamilyId[] type instead of widening to string[]. */
export const toggleId = <T extends string>(ids: T[], id: T): T[] =>
  ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id];
