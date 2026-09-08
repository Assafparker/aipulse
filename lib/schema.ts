import { z } from "zod";

export const FAMILY_IDS = [
  "lab", "journal", "preprint", "regulator",
  "provider", "people", "press", "social",
] as const;

export const TOPIC_IDS = [
  "israel", "policy", "research", "ambient", "imaging",
  "mental", "ops", "funding", "ethics", "adoption",
  "interop", "marketplace",
] as const;

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "תאריך חייב להיות YYYY-MM-DD");

export const ItemSchema = z.object({
  id:       z.string().min(1).regex(/^[a-z0-9-]+$/, "מזהה: אותיות קטנות, ספרות ומקפים"),
  date:     isoDate,                       // תאריך הפרסום במקור
  added:    isoDate,                       // התאריך שבו הסריקה הכניסה אותו
  src:      z.string().min(1),             // "npj Digital Medicine"
  fam:      z.enum(FAMILY_IDS),
  title:    z.string().min(1).max(200),
  titleSrc: z.string().min(1).max(300).optional(),  // הכותרת כפי שפורסמה במקור; קיימת רק בפריטים חדשים
  summary:  z.string().min(40),            // 2–3 משפטים, עם מספרים וסייג
  url:      z.string().url(),
  topics:   z.array(z.enum(TOPIC_IDS)).min(1).max(3),
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
