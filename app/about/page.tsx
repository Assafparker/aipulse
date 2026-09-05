import type { Metadata } from "next";
import Link from "next/link";
import { FamilyIcon } from "@/components/ui/family-icon";
import { FAMILIES } from "@/lib/constants";
import { ITEMS, LAST_SCAN, MONTHS } from "@/lib/content";

export const metadata: Metadata = {
  title: "שיטת העבודה — AiPulse",
  description:
    "מה נסרק ב-AiPulse, באיזו תדירות, לפי אילו כללים, ומה לא נכנס — כולל ההצהרה על רשתות חברתיות וגילוי נאות מלא.",
};

/**
 * The method page.
 *
 * Two things here are requirements rather than content choices: the explicit
 * statement that social networks are not scanned at all (PRD 4.5 — stated
 * openly, not buried), and the disclosure block (CLAUDE.md rule 8). The
 * footer carries the disclosure too; this page states it in full.
 */

const SCANNED = FAMILIES.filter((f) => !f.gap);
const GAPS = FAMILIES.filter((f) => f.gap);

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-3xl font-bold">שיטת העבודה</h1>
      <p className="mt-4 max-w-prose font-light leading-relaxed text-ink-2">
        כל בוקר נסרקים מקורות ראשוניים בתחום הבינה המלאכותית בבריאות, ומתוכם
        נבחרים 8 עד 14 פריטים. כל פריט נכתב בעברית עם המספרים האמיתיים והסייג,
        ומקושר למקור הראשוני. כרגע יש{" "}
        <span className="tnum">{ITEMS.length}</span> פריטים בארכיון על פני{" "}
        <span className="tnum">{MONTHS.length}</span> חודשים, והסריקה האחרונה
        הייתה ב-
        <time dateTime={LAST_SCAN} className="tnum ltr">
          {LAST_SCAN}
        </time>
        .
      </p>

      <h2 className="mt-10 text-2xl font-bold">ראשוני מול משני</h2>
      <p className="mt-3 max-w-prose font-light leading-relaxed text-ink-2">
        <strong className="font-medium text-ink">מקור ראשוני</strong> הוא הגוף
        שיצר את הידיעה — המאמר עצמו, הודעת הרגולטור, פרסום המעבדה. הוא מסומן
        בעיגול מלא.{" "}
        <strong className="font-medium text-ink">דיווח משני</strong> הוא כתבה על
        מה שמישהו אחר פרסם, ומסומן בעיגול חלול. כשעיתונות מקצועית מדווחת על
        מחקר, הקישור כאן יהיה למאמר ולא לכתבה.
      </p>

      <h2 className="mt-10 text-2xl font-bold">מה נסרק</h2>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full border-collapse text-start text-sm">
          <caption className="sr-only">
            משפחות המקור הנסרקות ומה נקרא בכל אחת
          </caption>
          <thead>
            <tr className="border-b border-line-2 text-ink-3">
              <th scope="col" className="py-2 pe-4 text-start font-medium">
                משפחת מקור
              </th>
              <th scope="col" className="py-2 text-start font-medium">
                מה נקרא בה
              </th>
            </tr>
          </thead>
          <tbody>
            {SCANNED.map((f) => (
              <tr key={f.id} className="border-b border-line align-top">
                <th scope="row" className="py-3 pe-4 text-start font-normal">
                  <span className="inline-flex items-center gap-1.5 text-accent-ink">
                    <span
                      className={`size-2 shrink-0 rounded-full border border-current ${
                        f.tier === "primary" ? "bg-current" : ""
                      }`}
                      aria-hidden="true"
                    />
                    <FamilyIcon fam={f.id} size={14} />
                    <span className="whitespace-nowrap font-medium">
                      {f.label}
                    </span>
                  </span>
                  <span className="mt-0.5 block text-xs text-ink-3">
                    {f.tier === "primary" ? "מקור ראשוני" : "דיווח משני"}
                  </span>
                </th>
                <td className="py-3 leading-relaxed text-ink-2">{f.watch}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="mt-10 text-2xl font-bold">מה לא נסרק</h2>
      {GAPS.map((f) => (
        <p
          key={f.id}
          className="mt-3 max-w-prose font-light leading-relaxed text-ink-2"
        >
          <strong className="font-medium text-ink">{f.label}:</strong> {f.gap}
        </p>
      ))}
      <p className="mt-3 max-w-prose font-light leading-relaxed text-ink-2">
        אין באתר חיפוש חופשי, ניוזלטר, התראות או חשבונות משתמש. הסימונים שלך —
        מה שנקרא, מה שנשמר ומה שהוצמד — נשמרים בדפדפן שלך בלבד, ואינם נשלחים
        לשום מקום ואינם משפיעים על מה שקוראים אחרים רואים.
      </p>

      <h2 className="mt-10 text-2xl font-bold">גילוי נאות</h2>
      <div className="mt-3 rounded-lg border border-line bg-surface p-5">
        <p className="max-w-prose leading-relaxed text-ink-2">
          התקצירים באתר מופקים בסריקה יומית אוטומטית ומקושרים למקור הראשוני.
          המקור הוא הקובע.
        </p>
        <p className="mt-3 max-w-prose font-light leading-relaxed text-ink-3">
          קהל היעד כאן מקבל החלטות מקצועיות, ולכן מקור התוכן נאמר בגלוי ולא
          נקבר. תקציר אינו תחליף לקריאת המאמר: לפני הסתמכות על מספר או מסקנה,
          פתחו את הקישור למקור.
        </p>
      </div>

      <p className="mt-10 text-sm">
        <Link href="/feed" className="text-accent hover:underline">
          לפיד ←
        </Link>
      </p>
    </main>
  );
}
