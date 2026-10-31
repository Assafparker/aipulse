import type { FamilyId, TopicId } from "./schema";

export const FAMILIES: { id: FamilyId; label: string; tier: "primary" | "secondary";
                         watch: string; gap?: string }[] = [
  { id: "lab",       label: "Frontier labs",     tier: "primary",
    watch: "Anthropic · OpenAI · Google DeepMind · Google Research · Microsoft Research" },
  { id: "journal",   label: "כתבי עת מדעיים",    tier: "primary",
    watch: "Nature Medicine · npj Digital Medicine · NEJM AI · Lancet Digital Health · JAMA" },
  { id: "preprint",  label: "Preprints",          tier: "primary",
    watch: "arXiv · medRxiv · bioRxiv" },
  { id: "regulator", label: "רגולציה ורשויות",    tier: "primary",
    watch: "FDA · נציבות האיחוד האירופי · MHRA · משרד הבריאות" },
  { id: "provider",  label: "בתי חולים ומערכות",  tier: "secondary",
    watch: "שיבא · רמב״ם · Mayo · Cleveland Clinic · Mass General Brigham" },
  { id: "people",    label: "קולות מובילים",       tier: "secondary",
    watch: "חוקרים ומנהלים שמפרסמים בערוצים פתוחים" },
  { id: "press",     label: "עיתונות מקצועית",    tier: "secondary",
    watch: "Healthcare IT News · STAT · Fierce Healthcare · Modern Healthcare" },
  { id: "social",    label: "רשתות חברתיות",      tier: "secondary", watch: "",
    gap: "חסומות לסריקה אוטומטית ולכן אינן נסרקות. במקומן נקראים אותם אנשים בערוצים הפתוחים שלהם." },
];

/**
 * `scope` is the definition the daily scan reads when tagging items; the site
 * does not render it. Only topics with a boundary worth spelling out carry one.
 */
export const TOPICS: { id: TopicId; label: string; scope?: string }[] = [
  { id: "israel",      label: "ישראל" },
  { id: "policy",      label: "רגולציה",
    scope: "Binding rules, approvals and regulation. Plans, programs and strategic direction go to national-strategies." },
  { id: "research",    label: "מחקר קליני וראיות" },
  { id: "ambient",     label: "תיעוד ו-Ambient AI" },
  { id: "imaging",     label: "הדמיה ואבחון" },
  { id: "mental",      label: "בריאות הנפש" },
  { id: "ops",         label: "תפעול ומחזור הכנסות" },
  { id: "funding",     label: "מימון ותעשייה" },
  { id: "ethics",      label: "אתיקה, בטיחות וכוח אדם" },
  { id: "adoption",    label: "אימוץ בשטח" },
  { id: "interop",     label: "FHIR ואינטראופרביליות" },
  { id: "marketplace", label: "Marketplace" },
  { id: "foundation-models", label: "מודלי יסוד בבריאות",
    scope: "Studies and reports showing the use of foundation models in health, whether from OpenAI, OpenEvidence or others, and especially foundation models that countries or companies are developing specifically for health." },
  { id: "national-strategies", label: "אסטרטגיות לאומיות בעולם",
    scope: "National strategies, programs, roadmaps and investment plans for AI in health, published by governments, health ministries and digital-health agencies worldwide, and AI programs of public payers and insurers (e.g. Medicare/CMS). Israel is included, under the existing high bar for Israeli items. Distinct from policy: policy is binding rules, approvals and regulation; national-strategies is plans, programs and strategic direction. Sources: content/strategy-watchlist.json." },
];

/**
 * Line categories: the "departments" the floor lines lead to. Every topic
 * belongs to exactly one category, except `israel`, which is a geography
 * rather than a department — it stays an uncolored tag and filter chip.
 * An item's line takes the category of its first topic that has one
 * (lineCategory below), so an item tagged israel first takes its next topic.
 * The order here is the lane order on the rail, from the inline start.
 */
export type CategoryId = "rnd" | "health" | "reg" | "infra";

export const CATEGORIES: { id: CategoryId; label: string; topics: TopicId[] }[] = [
  { id: "rnd",    label: "מו\"פ",          topics: ["research", "funding"] },
  { id: "health", label: "שירותי בריאות", topics: ["imaging", "adoption", "ambient", "mental", "ops"] },
  { id: "reg",    label: "רגולציה ומדיניות", topics: ["policy", "ethics", "national-strategies"] },
  { id: "infra",  label: "תשתיות",        topics: ["interop", "marketplace", "foundation-models"] },
];

/** Topics that sit outside every category: tags and plain filter chips only. */
export const UNCATEGORIZED: TopicId[] = ["israel"];

const CATEGORY_OF = new Map<TopicId, CategoryId>(
  CATEGORIES.flatMap((c) => c.topics.map((t) => [t, c.id] as const)),
);

export const categoryOf = (topic: TopicId): CategoryId | undefined =>
  CATEGORY_OF.get(topic);

/** The category whose line an item stands on: its first categorized topic. */
export function lineCategory(topics: readonly TopicId[]): CategoryId {
  for (const t of topics) {
    const c = CATEGORY_OF.get(t);
    if (c) return c;
  }
  return CATEGORIES[0].id;
}
