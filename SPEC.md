# AiPulse — מפרט טכני

## 1. סטאק

| רכיב | בחירה | נימוק |
|---|---|---|
| פריימוורק | Next.js 15, App Router | פריסה מקורית ב-Vercel, קומפוננטות שרת, RSC |
| שפה | TypeScript, `strict: true` | הסכימה היא חוזה, רוצים שהמהדר יאכוף אותו |
| עיצוב | Tailwind CSS v4 | תכונות לוגיות מובנות, אין CSS-in-JS מיותר |
| ולידציה | Zod | סכימת התוכן נאכפת בזמן בנייה |
| גופנים | `next/font/google` | Frank Ruhl Libre, Heebo, IBM Plex Mono |
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
  brand/hero-graphic.tsx  # גרפיקת הפתיח inline
  feed/item-card.tsx
  feed/feed-list.tsx      # "use client" — מחזיק סינון ומיון
  feed/family-filter.tsx
  feed/topic-prefs.tsx
  feed/view-tabs.tsx
  ui/family-icon.tsx      # מיפוי FamilyId ← אייקון
  ui/theme-toggle.tsx
lib/
  schema.ts               # Zod + טיפוסים נגזרים
  content.ts              # קריאת התוכן + ולידציה
  constants.ts            # FAMILIES, TOPICS
  user-state.ts           # כל הגישה ל-localStorage, מאחורי ממשק
  ranking.ts              # מיון וניקוד לפי העדפות
content/
  items.json              # התוכן. הסריקה היומית כותבת לכאן.
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
```

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
export const isNew = (i: Item) => i.added === LAST_SCAN;

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

1. **גיבור** — הסימן, השם AiPulse, משפט הסבר, שני כפתורים: "לפיד" ו"איך זה עובד".
   רקע: `hero.svg` כרכיב inline, לא `<img>` (ראה §8).
2. **שורת מספרים** — כמה פריטים, כמה משפחות מקור, תאריך הסריקה האחרונה.
   מחושב מהתוכן, לא מוקלד.
3. **תצוגה מקדימה** — ארבעת הפריטים האחרונים ככרטיסים מלאים, קישור "כל הפיד".
4. **שיטת העבודה** — שלוש נקודות: מקור ראשוני קודם, הסייג חלק מהידיעה,
   הקורא מסנן לעצמו.
5. **פוטר** — קישור לעמוד השיטה.

הדף כולו קומפוננטת שרת. אין בו אינטראקציה מלבד ניווט.

### `/feed`

- **סרגל צד** (דסקטופ) / **מגירה** (מובייל): תצוגות, מיון, משפחות מקור, נושאים.
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

```
[● משפחה]  [חדש]
מקור · תאריך · [תגית] [תגית]
כותרת מקושרת (יעד חיצוני, target=_blank, rel="noopener noreferrer")
תקציר
─────────────────────────
[הצמד] [שמור] [כבר קראתי]            [למקור ↗]
```

- העיגול לפני שם המשפחה: מלא ל-`tier: primary`, חלול ל-`secondary`.
- תגית של נושא שסומן "יותר" מודגשת ברקע `accent-soft`.
- כל כפתור מצב נושא `aria-pressed`.
- כרטיס מוצמד: פס בצבע `pin` בקצה ההתחלתי (`border-inline-start`).

### הפוטר — בכל עמוד

שורת גילוי נאות קבועה:

> התקצירים באתר מופקים בסריקה יומית אוטומטית ומקושרים למקור הראשוני. המקור הוא הקובע.

בצבע `--ink-3`, גודל קטן, אבל לא מוסתר ולא מתחת לקיפול של קישורים משניים.

## 7. עיצוב

### פלטה — טוקנים ב-`globals.css`

הגדר את **כל** הצבעים על `:root` בערכי הכהה — זו ברירת המחדל, ללא תנאי —
ודרוס אותם רק כשהקורא בחר בהיר במפורש. אין כאן `@media` בכלל: העדפת מערכת
ההפעלה אינה משפיעה על הפלטה:

```css
:root{
  --ground:#0F1513; --surface:#161E1B; --surface-2:#1D2724;
  --ink:#E7EEEA; --ink-2:#B4C2BC; --ink-3:#7F8F89;
  --line:#26312D; --line-2:#33403B;
  --accent:#74B8A6; --accent-soft:#1B2E29; --accent-ink:#9BD0C1;
  --pin:#D08A55; --pin-soft:#2E2118;
}
:root[data-theme="light"]{
  --ground:#F6F8F6; --surface:#FFFFFF; --surface-2:#EEF2EF;
  --ink:#151E1B; --ink-2:#3C4A45; --ink-3:#63716B;
  --line:#DCE3DE; --line-2:#C6D1CB;
  --accent:#2F6F62; --accent-soft:#E3EFEA; --accent-ink:#1E4C43;
  --pin:#A65A2A; --pin-soft:#F6E8DE;
}
```

`color-scheme` ואייקוני כפתור המצב בנויים באותו מבנה דו-שלבי: כהה על
`html`/`:root`, והדריסה היחידה היא `[data-theme="light"]`. הערך נכתב
ב-localStorage ומוחזר על ידי סקריפט חוסם ב-`<head>` לפני הציור הראשון.

### גופנים

| שימוש | גופן | משקלים |
|---|---|---|
| כותרות ושם המותג | Frank Ruhl Libre | 700, 900 |
| גוף הטקסט | Heebo | 300, 400, 500 |
| מספרים, תוויות, תאריכים | IBM Plex Mono | 400, 500 |

טען דרך `next/font/google` עם `display: "swap"` וקבע `font-variant-numeric:
tabular-nums` על כל מקום שמציג מספרים.

### נכסים

`public/` מכיל את הסימן, הפאביקון, גרפיקת הפתיח ושמונה אייקוני משפחות —
כולם SVG מקוריים בפלטה הזאת. אין תלות ברישוי חיצוני.

**האייקונים מגיעים בשתי גרסאות ובחירה שגויה שוברת את המצב הכהה:**
`currentColor` **אינו חוצה גבול `<img>`** — קובץ SVG שנטען כתמונה הוא מסמך
מבודד שלא יורש `color` מהדף. השתמש ב-`icons-inline/` כרכיבי React (הם יורשים
את צבע הטקסט), או ב-`icons/` דרך `<img>` (הם נושאים צבע משלהם עם media query פנימי).
המלצה: הטמע inline דרך `ui/family-icon.tsx`.

### דף נחיתה מודרני — מה זה אומר כאן

לא גרדיאנטים סגולים ולא איורים תלת-ממדיים. הכיוון: טיפוגרפיה סריפית גדולה
בעברית, שטח לבן נדיב, כרטיסים עם גבול דק וצל כמעט בלתי נראה, וצבע מבטא אחד
שמופיע במשורה. הגיבור נושא את גרפיקת הנקודות — שדה של פריטים שנסרקו שמתדלדל
לכיוון הכותרת, עם מעטים שנבחרו בצבע. זה מסביר את המוצר בלי מילה אחת.

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
6. גרפיקת הפתיח שומרת אזור פנוי בצד ימין לכותרת. אם תזיז את הכותרת, עדכן את
   האזור ב-`hero.svg` — אחרת הטקסט יישב על הנקודות.

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
