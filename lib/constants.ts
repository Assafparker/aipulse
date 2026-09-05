import type { FamilyId, TopicId } from "./schema";

export const FAMILIES: { id: FamilyId; label: string; tier: "primary" | "secondary";
                         watch: string; gap?: string }[] = [
  { id: "lab",       label: "מעבדות חזית",       tier: "primary",
    watch: "Anthropic · OpenAI · Google DeepMind · Google Research · Microsoft Research" },
  { id: "journal",   label: "כתבי עת שפוטים",     tier: "primary",
    watch: "Nature Medicine · npj Digital Medicine · NEJM AI · Lancet Digital Health · JAMA" },
  { id: "preprint",  label: "פרה-פרינטים",        tier: "primary",
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

export const TOPICS: { id: TopicId; label: string }[] = [
  { id: "israel",   label: "ישראל" },
  { id: "policy",   label: "רגולציה ומדיניות" },
  { id: "research", label: "מחקר קליני וראיות" },
  { id: "ambient",  label: "תיעוד ו-Ambient AI" },
  { id: "imaging",  label: "הדמיה ואבחון" },
  { id: "mental",   label: "בריאות הנפש" },
  { id: "ops",      label: "תפעול ומחזור הכנסות" },
  { id: "funding",  label: "מימון ותעשייה" },
  { id: "ethics",   label: "אתיקה, בטיחות וכוח אדם" },
  { id: "adoption", label: "אימוץ בשטח" },
];
