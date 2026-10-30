# AiPulse — מפרט טכני

## 1. סטאק

| רכיב | בחירה | נימוק |
|---|---|---|
| פריימוורק | Next.js 15, App Router | פריסה מקורית ב-Vercel, קומפוננטות שרת, RSC |
| שפה | TypeScript, `strict: true` | הסכימה היא חוזה, רוצים שהמהדר יאכוף אותו |
| עיצוב | Tailwind CSS v4 | תכונות לוגיות מובנות, אין CSS-in-JS מיותר |
| ולידציה | Zod | סכימת התוכן נאכפת בזמן בנייה |
| גופנים | `next/font/google` | Rubik, Assistant |
| תנועה | GSAP, `@gsap/react` | מערכת תנועה אחת; ספריית אנימציה אחרת אסורה |
| אחסון מצב | `localStorage` | שלב 1: בלי שרת, בלי חשבון |
| פריסה | Vercel | Git push ⇒ דיפלוי |

בלי מסד נתונים, בלי משתני סביבה, בלי תלות חיצונית בזמן ריצה בשלב 1.

## 2. מבנה הריפו

```
app/
  layout.tsx              # <html lang="he" dir="rtl">, גופנים, theme script
  page.tsx                # דף הנחיתה
  feed/page.tsx           # הפיד — 30 יום אחרונים
  archive/page.tsx        # אינדקס חודשים
  archive/[month]/page.tsx# חודש בודד
  about/page.tsx          # שיטת העבודה
  globals.css             # טוקנים של הפלטה + reset
components/
  brand/logo.tsx          # הסימן inline (currentColor)
  brand/line-legend.tsx   # רצועת הקווים ומקרא הקטגוריות
  motion/line-motion.tsx  # ציור הקווים בטעינה ובגלילה (GSAP)
  motion/logo-motion.tsx  # פעימת הלוגו (GSAP)
  feed/item-card.tsx
  feed/feed-list.tsx      # "use client" — מחזיק סינון ומיון
  feed/category-filter.tsx # הסינון הראשי: קטגוריות ונושאים
  feed/family-filter.tsx
  feed/topic-prefs.tsx
  feed/view-tabs.tsx
  ui/family-icon.tsx      # מיפוי FamilyId ← אייקון
  ui/theme-toggle.tsx
lib/
  schema.ts               # Zod + טיפוסים נגזרים
  content.ts              # קריאת התוכן + ולידציה
  constants.ts            # FAMILIES, TOPICS, CATEGORIES
  theme.ts                # הסקריפט החוסם של ערכת הנושא ושער התנועה
  user-state.ts           # כל הגישה ל-localStorage, מאחורי ממשק
  ranking.ts              # מיון וניקוד לפי העדפות
content/
  items.json              # התוכן. הסריקה היומית כותבת לכאן.
  people.json             # קולות מובילים למעקב
  strategy-watchlist.json # מקורות לנושא national-strategies
public/
  aipulse-mark.svg  favicon.svg  hero.svg  icons/*.svg
```

## 3. מודל הנתונים

### 3.1 הפריט

```ts
// lib/schema.ts
import { z } from "zod";

export const FAMILY_IDS = [
  "lab", "journal", "preprint", "regulator",
  "provider", "people", "press", "social",
] as const;

export const TOPIC_IDS = [
  "israel", "policy", "research", "ambient", "imaging",
  "mental", "ops", "funding", "ethics", "adoption",
  "interop", "marketplace", "foundation-models", "national-strategies",
] as const;

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "תאריך חייב להיות YYYY-MM-DD");

export const ItemSchema = z.object({
  id:      z.string().min(1).regex(/^[a-z0-9-]+$/, "מזהה: אותיות קטנות, ספרות ומקפים"),
  date:    isoDate,                       // תאריך הפרסום במקור
  added:   isoDate,                       // התאריך שבו הסריקה הכניסה אותו
  src:     z.string().min(1),             // "npj Digital Medicine"
  fam:     z.enum(FAMILY_IDS),
  title:   z.string().min(1).max(200),
  summary: z.string().min(40),            // 2–3 משפטים, עם מספרים וסייג
  url:     z.string().url(),
  topics:  z.array(z.enum(TOPIC_IDS)).min(1).max(3),
});

export const ItemsSchema = z.array(ItemSchema)
  .superRefine((items, ctx) => {
    const ids = new Set<string>(), urls = new Set<string>();
    for (const it of items) {
      if (ids.has(it.id))  ctx.addIssue({ code: "custom", message: `מזהה כפול: ${it.id}` });
      if (urls.has(it.url)) ctx.addIssue({ code: "custom", message: `כתובת כפולה: ${it.url}` });
      ids.add(it.id); urls.add(it.url);
    }
  });

export type Item = z.infer<typeof ItemSchema>;
export type FamilyId = (typeof FAMILY_IDS)[number];
export type TopicId  = (typeof TOPIC_IDS)[number];
```

**כתובת ייחודית לכל פריט היא דרישה, לא המלצה.** שני פריטים שמצביעים לאותה
כתובת לא ניתנים לסימון בנפרד על ידי הקורא.

### 3.2 קבועים

```ts
// lib/constants.ts
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

export const TOPICS: { id: TopicId; label: string; scope?: string }[] = [
  { id: "israel",      label: "ישראל" },
  { id: "policy",      label: "רגולציה", scope: "…" },
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
  { id: "foundation-models",   label: "מודלי יסוד בבריאות",      scope: "…" },
  { id: "national-strategies", label: "אסטרטגיות לאומיות בעולם", scope: "…" },
];

export const CATEGORIES: { id: CategoryId; label: string; topics: TopicId[] }[] = [
  { id: "rnd",    label: "מו\"פ",            topics: ["research", "funding"] },
  { id: "health", label: "שירותי בריאות",    topics: ["imaging", "adoption", "ambient", "mental", "ops"] },
  { id: "reg",    label: "רגולציה ומדיניות", topics: ["policy", "ethics", "national-strategies"] },
  { id: "infra",  label: "תשתיות",           topics: ["interop", "marketplace", "foundation-models"] },
];
export const UNCATEGORIZED: TopicId[] = ["israel"];
```

`scope` הוא ההגדרה שהסריקה קוראת בעת תיוג פריטים; האתר אינו מציג אותו. נוסח
ההגדרות המלא נמצא ב-`lib/constants.ts`.

**ההבחנה בין `policy` ל-`national-strategies`:** `policy` הוא כללים מחייבים, אישורים
ורגולציה. `national-strategies` הוא תכניות, תוכניות השקעה וכיוון אסטרטגי של
ממשלות, משרדי בריאות, סוכנויות בריאות דיגיטלית ומבטחים ציבוריים, כולל ישראל
ברף הגבוה הקיים לפריטים ישראליים.

`israel` הוא גיאוגרפיה ולכן מחוץ לכל קטגוריה. הקו של פריט נקבע לפי הנושא הראשון
שלו שיש לו קטגוריה (`lineCategory`). נושא בלי פריטים מוצג בסרגל עם ספירה 0.
שני הנושאים החדשים מתמלאים מסריקות עתידיות בלבד; פריטים קיימים לא סווגו מחדש.

משפחת `social` מוצגת בממשק עם ההסבר שב-`gap` **ולא** נספרת כמקור פעיל. אסור
שיופיע פריט עם `fam: "social"` בתוכן.

### 3.3 קריאת התוכן

```ts
// lib/content.ts
import raw from "@/content/items.json";
import { ItemsSchema, type Item } from "./schema";

const parsed = ItemsSchema.safeParse(raw);
if (!parsed.success) {
  throw new Error("content/items.json לא תקין:\n" + JSON.stringify(parsed.error.format(), null, 2));
}

export const ITEMS: Item[] = [...parsed.data].sort((a, b) => b.date.localeCompare(a.date));
export const LAST_SCAN: string = ITEMS.reduce((m, i) => (i.added > m ? i.added : m), "0000-00-00");

const DAY = 86_400_000;
const cutoff = new Date(Date.now() - 30 * DAY).toISOString().slice(0, 10);
/** הפיד: 30 הימים האחרונים. הארכיון: הכול. */
export const RECENT: Item[] = ITEMS.filter(i => i.date >= cutoff);
export const MONTHS: string[] = [...new Set(ITEMS.map(i => i.date.slice(0, 7)))].sort().reverse();
export const byMonth = (m: string) => ITEMS.filter(i => i.date.startsWith(m));
```

הזריקה בזמן הבנייה מכוונת. סריקה שכתבה JSON פגום תפיל את הדיפלוי ב-Vercel
במקום לפרסם עמוד שבור.

### 3.4 הארכיון גדל בלי הגבלה

**שום פריט לא נמחק לעולם.** הגזימה ל-28 פריטים הייתה אילוץ של דשבורד במסך אחד;
כאן ההיסטוריה היא נכס, וגם מקור התנועה העיקרי מחיפוש.

בשלב 1 יש 34 פריטים והכול נשלח בעמוד אחד — זה בסדר גמור ואל תסבך.
**נקודת הפיצול:** כשהתוכן עובר כ-500 פריטים, `/feed` ו-`/archive/[month]` כבר
מוגשים בנפרד (הם מוגדרים כך מלכתחילה), ואז יש להוסיף גם `/saved` שמושך אינדקס
מצומצם — מזהה, כותרת, תאריך, מקור, כתובת, בלי התקציר — במקום לשלוח את הכול.
אל תבנה את זה עכשיו. רשום ב-`content.ts` הערה שמפנה לסעיף הזה.

## 4. מצב המשתמש

### 4.1 המבנה

```ts
// lib/user-state.ts
export type UserState = {
  version: 1;
  updatedAt: string;              // ISO timestamp. נדרש לפתרון התנגשויות בשלב 6.
  prefs:  Partial<Record<TopicId, 1 | -1>>;
  pinned: string[];
  saved:  string[];
  read:   string[];               // מזהים בלבד — התוכן כבר בריפו
  famOff: FamilyId[];
  sort:   "date" | "pref";
};

const KEY = "aipulse:v1";
export const EMPTY: UserState = {
  version: 1, updatedAt: "1970-01-01T00:00:00.000Z",
  prefs: {}, pinned: [], saved: [], read: [], famOff: [], sort: "date",
};
```

### 4.2 כללים מחייבים

- **כל קריאה וכתיבה בתוך `try/catch`.** בגלישה פרטית `localStorage` זורק.
  כישלון מחזיר `EMPTY` ולא מפיל את העמוד.
- **מזהים בלבד, לא אובייקטים.** בגרסה הישנה נשמרו כותרות וכתובות; זה מיותר —
  התוכן מגיע מהריפו. מזהה שכבר לא קיים בתוכן מסונן בשקט בזמן הקריאה.
- **`read` מסתיר מהפיד של הגולש בלבד.** בניגוד לגרסה הדשבורדית, הוא **אינו**
  משפיע על הסריקה. מה שאדם אחד קרא עדיין חדש עבור אחר. זה שינוי מהותי — ודא
  שאין שום קוד שמנסה למשוב את `read` חזרה לתוכן.
- **הידרציה:** קרא את המצב ב-`useEffect` אחרי ההרכבה, לא ברינדור הראשון.
  הפיד מוגש מהשרת עם כל הפריטים; הסתרת פריטים שנקראו קורית אחרי הידרציה.
  מנע קפיצה: השאר את גובה הרשימה יציב, או השהה את המעבר ב-`useTransition`.
- **מיגרציה:** אם `version` שנקרא אינו 1 — התעלם והתחל מ-`EMPTY`.
- **`updatedAt` מתעדכן בכל שמירה.** בשלב 1 הוא לא בשימוש. הוא נמצא כאן כדי
  ששלב 6 יוכל לפתור התנגשות בין מכשירים בלי מיגרציית סכימה.

### 4.3 הממשק — הגבול שמאפשר את שלב 2

```ts
export interface StateStore {
  load(): Promise<UserState>;
  save(s: UserState): Promise<void>;
}
```

שלב 1 מממש `LocalStore` בלבד. שלב 6 יוסיף `SyncedStore` שעוטף אותו.
**אף קומפוננטה לא נוגעת ב-`localStorage` ישירות** — הכול דרך הממשק. אם קומפוננטה
קוראת ל-`localStorage`, שלב 6 יידרש לשכתוב, וזו בדיוק העלות שהממשק נועד למנוע.

## 5. דירוג

```ts
// lib/ranking.ts
export const scoreOf = (i: Item, prefs: UserState["prefs"]) =>
  i.topics.reduce((s, t) => s + (prefs[t] ?? 0), 0);
```

- מיון `date` — לפי `date` יורד.
- מיון `pref` — לפי `scoreOf` יורד, שובר שוויון לפי `date` יורד.
- פריט עם ניקוד שלילי מוצג בעמעום (`opacity: .6`), לא מוסתר.
- מוצמדים תמיד בקבוצה נפרדת בראש, ממוינים באותו כלל.

## 6. מסלולים ורכיבים

### `/` — דף נחיתה

1. **שלט הגיבור** — שלט אינדיגו: הסימן, השם AiPulse, משפט הסבר, שני כפתורים,
   לוחית חדר עם תאריך הסריקה האחרונה, ומתחתיו רצועת ארבעת הקווים.
2. **שורת מספרים** — כמה פריטים, כמה משפחות מקור, תאריך הסריקה האחרונה.
   מחושב מהתוכן, לא מוקלד.
3. **תצוגה מקדימה** — הפריטים שנוספו בעדכון האחרון לפי `added` (לא לפי `date`),
   ככרטיסים מלאים, קישור "כל הפיד". **רק** פריטים ש-`added` שלהם הוא `LAST_SCAN` —
   אין השלמה מעדכונים קודמים, ואין ערבוב תאריכים תחת כותרת אחת. סדר: `date` יורד;
   תקרה של 8. אם נכנסו יותר, שורה מושתקת ליד "כל הפיד": "מוצגים 8 מתוך N שנכנסו
   בעדכון". הכותרת: "מה נכנס היום" כש-`LAST_SCAN` הוא היום לפי שעון ישראל, אחרת
   "מה נכנס בעדכון האחרון" ואחריה התאריך. הבחירה היא פונקציה טהורה
   (`latestAdded(items, today)` ב-`lib/content.ts`) שמקבלת את התאריך של היום
   כארגומנט. העמוד סטטי עם `revalidate = 3600`, והחישוב נעשה בתוך הרינדור ולא
   ברמת המודול, כך שהכותרת מתעדכנת אחרי חצות גם בלי דיפלוי חדש.
4. **שיטת העבודה** — שלוש נקודות: מקור ראשוני קודם, הסייג חלק מהידיעה,
   הקורא מסנן לעצמו.
5. **פוטר** — קישור לעמוד השיטה.

הדף כולו קומפוננטת שרת. אין בו אינטראקציה מלבד ניווט.

### `/feed`

- **סרגל צד** (דסקטופ) / **מגירה** (מובייל): תצוגות, מיון, קטגוריות ונושאים, סוג מקור,
  העדפות נושא.
- **רשימה**: מוצמדים, ואז השאר.
- **תצוגת "נקראו"**: רשימה שטוחה של כותרות עם כפתור "החזר לפיד" וכפתור ניקוי.

`feed/feed-list.tsx` הוא `"use client"` ומקבל את `ITEMS` כ-prop מקומפוננטת שרת.
כך התוכן מגיע ב-HTML הראשוני וגם נסרק על ידי מנועי חיפוש.

### `/archive` ו-`/archive/[month]`

`/archive` — רשימת חודשים עם מספר הפריטים בכל אחד, מהחדש לישן.
`/archive/[month]` — כל פריטי החודש, אותו כרטיס בדיוק, `generateStaticParams`
מ-`MONTHS`. שני העמודים הם קומפוננטות שרת ומקבלים `metadata` ייחודי לכל חודש —
זה מה שיביא תנועה מחיפוש.

### `/about`

טבלת המשפחות עם `watch` של כל אחת, הסבר על ההבחנה ראשוני/משני, וההצהרה על
רשתות חברתיות מתוך `gap`.

### כרטיס פריט — פירוט

פריט הוא שורה על הרצפה ולא כרטיס; הפריסה המלאה ב-`DESIGN.md`, סעיף Item Row.

- העיגול לפני שם המשפחה: מלא ל-`tier: primary`, חלול ל-`secondary`.
- אין תג "חדש". במקומו כל כרטיס מציג שני תאריכים זה מתחת לזה, בקצה הסופי של
  השורה הראשונה: "תאריך עדכון" (`added` — היום שבו הסריקה העלתה את הפריט לאתר)
  ומתחתיו "תאריך פרסום" (`date` — היום שבו המקור פרסם). כל ערך ב-`<time>`.
  התאריך אינו מופיע שוב בשורה השנייה.
- תגית של נושא שסומן "יותר" מודגשת ברקע `sign`.
- כל כפתור מצב נושא `aria-pressed`.
- פריט מוצמד מקבל תג על לוחית `sign`.

### הפוטר — בכל עמוד

שורת גילוי נאות קבועה:

> התקצירים באתר מופקים בסריקה יומית אוטומטית ומקושרים למקור הראשוני. המקור הוא הקובע.

בצבע `--ink-3`, גודל קטן, אבל לא מוסתר ולא מתחת לקיפול של קישורים משניים.

## 7. עיצוב

**`DESIGN.md` הוא המקור המחייב לעיצוב**, ו-`PRODUCT.md` למוצר. הסעיף הזה מסכם בלבד.

**Corridor Lines:** האתר מעוצב כשילוט רצפה בבית חולים. הרצפה היא מסדרון בלילה,
השלטים אמייל, וכל קטגוריה היא קו צבוע על הרצפה.

- **כהה כברירת מחדל, ללא תנאי.** כל הטוקנים על `:root` בערכי הכהה, והדריסה היחידה
  היא `:root[data-theme="light"]`. `prefers-color-scheme` אינו נקרא. סקריפט חוסם
  (`lib/theme.ts`) מחזיר את הבחירה הידנית לפני הציור הראשון.
- **שלטי אינדיגו.** אזור העליון של האתר הוא `--top` (`#1A1544`) בשתי ערכות הנושא;
  כל שאר השלטים ומצבי הלחיצה הם נייבי `--sign`.
- **ארבע קטגוריות בצבע לפי נושא.** `--cat-rnd`, `--cat-health`, `--cat-reg`,
  `--cat-infra`. צבע מסמן קטגוריה בלבד, לעולם לא מצב ולא משפחת מקור. נושא חדש
  מצטרף לקטגוריה ואינו מקבל צבע משלו.
- **סוג המקור הוא דוגמת הקו.** מקור ראשוני: קו רציף ונקודה מלאה. דיווח משני: קו
  מקווקו ונקודה חלולה.
- **לוגו הטבעת.** טבעת שנהב, נקודה מרכזית כחולה ונקודה צהובה מסומנת, תמיד על
  שלט האינדיגו. בפעימה הנקודה פועמת, ארבע אדוות בצבעי הקטגוריות יוצאות אל
  הטבעת וצובעות אותה לרגע, והיא חוזרת לשנהב. הפעימה רצה בטעינה ובריחוף או
  הקשה, בלי לולאה.
- **תנועה.** GSAP בלבד, טרנספורמציות בלבד: רצועת הקווים נדלקת בטעינה, וקו כל פריט
  נמשך בגלילה ומתעקל אל הכותרת. בהעדפת תנועה מופחתת דבר לא זז, ותוכן לעולם לא
  מוסתר מאחורי תנועה.
- **גופנים.** Rubik לכל מה שמנווטים לפיו (כותרות, מספרים, פקדים), Assistant לקריאה.
  מספרים ותאריכים ב-`tabular-nums`.
- **צורה.** פינות ישרות, בלי צללים, מודול קו של 4px.

### נכסים

הלוגו מוטמע inline ב-`components/brand/logo.tsx`. הפאביקון וסמלי האפליקציה הם מצב
המנוחה של הלוגו על משבצת אינדיגו.

**אייקוני המשפחות מגיעים בשתי גרסאות ובחירה שגויה שוברת את המצב הכהה:**
`currentColor` **אינו חוצה גבול `<img>`**. השתמש ב-`icons-inline/` כרכיבי React,
דרך `ui/family-icon.tsx`.

## 8. RTL — כללים מחייבים

1. `<html lang="he" dir="rtl">` ב-`layout.tsx`.
2. **תכונות לוגיות בלבד.** `ms/me/ps/pe`, `start/end`, `border-inline-start`.
   אם אתה כותב `left` או `right`, אתה טועה.
3. **`inset-inline-start` נפתר לפי ה-`direction` של האלמנט עצמו.** אל תשים
   `direction:ltr` על אלמנט ממוקם — המיקום יתהפך. זו תקלה שכבר קרתה בפרויקט הזה.
4. **שם המותג "AiPulse" לא צריך `direction:ltr`** — הוא רצף LTR אחיד.
5. **מחרוזת שמתחילה בתו ניטרלי** (`#`, `(`, `/`) בהקשר RTL תיזרק לצד הלא נכון.
   קודי צבע, כתובות URL ומזהים לטיניים חייבים `direction:ltr` **על אלמנט טקסט
   שאינו ממוקם**, או `unicode-bidi:isolate`.

## 9. פריסה ב-Vercel

1. דחוף את הריפו ל-GitHub.
2. Vercel ⇒ Import Project ⇒ הפריסט מזוהה אוטומטית כ-Next.js.
3. אין משתני סביבה בשלב 1.
4. `main` ⇒ פרודקשן. כל ענף אחר ⇒ Preview.
   הכתובת היא `<שם-הפרויקט>.vercel.app` ונבחרת בזמן הייבוא. `aipulse` עשוי
   להיות תפוס — Vercel יציע חלופה. אין דומיין מותאם בשלב הזה.
5. `next.config.ts`: ברירות המחדל מספיקות. אל תפעיל `output: "export"` — אתה
   מוותר בכך על ISR ועל תמונות מותאמות.

### חיבור הסריקה היומית

הסריקה כבר קיימת כמשימה מתוזמנת שרצה בענן פעם ביום. השינוי היחיד הנדרש:
במקום לפרסם ארטיפקט, היא מבצעת:

```
git clone → קריאת content/items.json → סריקת המקורות →
כתיבת ה-JSON המעודכן → commit → push
```

הדחיפה מפעילה דיפלוי ב-Vercel אוטומטית. יתרונות: התוכן מנוהל בגיט עם היסטוריה
מלאה, אין מסד נתונים, ואם סריקה כתבה JSON פגום — הבנייה נופלת והגרסה הקודמת
נשארת חיה.

**שני שינויים בכללי הסריקה עצמה** לעומת הגרסה הדשבורדית:

1. **הפסקת הגזימה.** הכלל ״שמור את 28 החדשים״ מבוטל. הסריקה מוסיפה בלבד.
2. **ביטול הדחייה לפי היסטוריית קריאה.** בדשבורד, פריט שסומן ״כבר קראתי״ נחסם
   מלחזור. באתר רב-משתמשי אין ״נקרא״ גלובלי — הסריקה מדלגת רק על כתובות
   שכבר קיימות ב-`content/items.json`.

**חלופה** אם תעדיף שהאתר יסרוק בעצמו: Vercel Cron ⇒ `app/api/scan/route.ts` ⇒
קריאה ל-Anthropic API. זה דורש מפתח API בתשלום ובנייה מחדש של כל היגיון הסריקה.
לא מומלץ לשלב 1.

## 10. בדיקות

- **ולידציית תוכן** — רצה בזמן הבנייה, ראה §3.3. אין צורך בבדיקה נפרדת.
- **בדיקות יחידה** (Vitest) על `lib/ranking.ts` ועל `lib/user-state.ts`:
  מיון לפי העדפות, שובר שוויון, קריאה כש-`localStorage` זורק, סינון מזהה
  שכבר לא קיים בתוכן.
- **בדיקה ידנית לפני דיפלוי:** מצב בהיר וכהה, רוחב 375 ורוחב 1440, ניווט
  מקלדת מלא בפיד, וטעינה בגלישה פרטית.

## 11. שלב 6 — סנכרון בין מכשירים בלי חשבון

**הדרישה:** אותו קורא בטלפון ובמחשב, בלי הרשמה, בלי מייל, בלי סיסמה.

**המנגנון — קוד סנכרון אנונימי:**

1. בכניסה ראשונה נוצר `syncId` אקראי (nanoid, 22 תווים) ונשמר ב-localStorage.
   כל עוד המשתמש לא ביקש סנכרון — **אין שום פנייה לרשת**. זה חשוב: רוב הגולשים
   לעולם לא יפעילו את זה, והם לא צריכים לשלם על כך בביצועים או בפרטיות.
2. לחיצה על ״סנכרן מכשיר״ כותבת את המצב ל-Vercel KV תחת המפתח `state:<syncId>`
   ומציגה את הקוד למשתמש.
3. במכשיר השני הוא מקליד את הקוד. האפליקציה מאמצת את ה-`syncId`, מושכת את המצב,
   וממזגת: איחוד המערכים, ובשדות סקלריים (`sort`, `prefs`) המאוחר לפי `updatedAt` מנצח.
4. מכאן כל שמירה כותבת מקומית **וגם** ל-KV, עם debounce של כשנייה.

**מה זה דורש:** `@vercel/kv`, שני משתני סביבה, ושתי נקודות קצה —
`GET/PUT /api/state/[syncId]`.

**מה להגיד למשתמש בגלוי, ליד הקוד:** הקוד הוא המפתח היחיד. מי שמחזיק בו רואה
ויכול לשנות את סימוני הקריאה והשמירה. אין כאן מידע אישי, אבל גם אין סיסמה.
אובדן הקוד מבטל את הסנכרון — המצב המקומי בכל מכשיר נשאר שלם.

**הגבלת קצב** על נקודות הקצה, ותקרת גודל למצב (למשל 64KB), כדי שמזהה אקראי
שדלף לא ישמש לאחסון זר.

שום קומפוננטה לא משתנה — רק המימוש מאחורי `StateStore`.
