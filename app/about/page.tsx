import type { Metadata } from "next";
import Link from "next/link";
import { PrimaryDot } from "@/components/feed/item-card";
import { ArrowStart } from "@/components/ui/arrow";
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

const H2 = "mt-16 border-b-2 border-ink pb-3 text-[clamp(1.5rem,3.5vw,2.125rem)] font-bold tracking-[-0.02em]";
const PROSE = "mt-4 max-w-[68ch] text-[1.0625rem] leading-[1.75] text-ink-2";

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 pt-10 sm:px-6 sm:pt-14">
      <div className="max-w-4xl">
      <h1 className="text-[clamp(2.5rem,7vw,4.5rem)] font-extrabold leading-none tracking-[-0.03em]">
        שיטת העבודה
      </h1>
      <p className="mt-6 max-w-[60ch] text-lg leading-[1.75] text-ink-2 sm:text-xl">
        כל בוקר נסרקים מקורות ראשוניים בתחום הבינה המלאכותית בבריאות, ומתוכם
        נבחרים 8 עד 14 פריטים. כל פריט נכתב בעברית עם המספרים האמיתיים והסייג,
        ומקושר למקור הראשוני. כרגע יש{" "}
        <span className="tnum font-semibold text-ink">{ITEMS.length}</span> פריטים בארכיון על פני{" "}
        <span className="tnum font-semibold text-ink">{MONTHS.length}</span> חודשים, והסריקה האחרונה
        הייתה ב-
        <time dateTime={LAST_SCAN} className="ltr font-semibold text-ink">
          {LAST_SCAN}
        </time>
        .
      </p>

      <h2 className={H2}>ראשוני מול משני</h2>
      <p className={PROSE}>
        <strong className="font-semibold text-ink">מקור ראשוני</strong> הוא הגוף
        שיצר את הידיעה — המאמר עצמו, הודעת הרגולטור, פרסום המעבדה. הוא מסומן
        בעיגול מלא.{" "}
        <strong className="font-semibold text-ink">דיווח משני</strong> הוא כתבה על
        מה שמישהו אחר פרסם, ומסומן בעיגול חלול. כשעיתונות מקצועית מדווחת על
        מחקר, הקישור כאן יהיה למאמר ולא לכתבה.
      </p>

      <h2 className={H2}>מה נסרק</h2>
      <div className="mt-2 overflow-x-auto">
        <table className="w-full border-collapse text-start">
          <caption className="sr-only">
            משפחות המקור הנסרקות ומה נקרא בכל אחת
          </caption>
          <thead>
            <tr className="border-b border-rule font-display text-sm text-ink-3">
              <th scope="col" className="py-3 pe-6 text-start font-medium">
                משפחת מקור
              </th>
              <th scope="col" className="py-3 text-start font-medium">
                מה נקרא בה
              </th>
            </tr>
          </thead>
          <tbody>
            {SCANNED.map((f) => (
              <tr
                key={f.id}
                className="border-b border-rule align-top"
              >
                <th scope="row" className="py-4 pe-6 text-start font-normal">
                  <span
                    aria-hidden="true"
                    className={`mb-3 block h-1.5 w-full min-w-28 ${
                      f.tier === "primary" ? "line-solid" : "line-dashed-x"
                    }`}
                  />
                  <span className="inline-flex items-center gap-2 font-display text-[0.9375rem] font-semibold text-ink">
                    <PrimaryDot primary={f.tier === "primary"} />
                    <span className="text-ink-3">
                      <FamilyIcon fam={f.id} size={16} />
                    </span>
                    <span className="whitespace-nowrap">{f.label}</span>
                  </span>
                  <span className="mt-1 block font-display text-xs text-ink-3">
                    {f.tier === "primary" ? "מקור ראשוני" : "דיווח משני"}
                  </span>
                </th>
                <td className="py-4 pt-[1.6rem] leading-relaxed text-ink-2">{f.watch}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className={H2}>מה לא נסרק</h2>
      {GAPS.map((f) => (
        <p key={f.id} className={PROSE}>
          <strong className="font-semibold text-ink">{f.label}:</strong> {f.gap}
        </p>
      ))}
      <p className={PROSE}>
        אין באתר חיפוש חופשי, ניוזלטר, התראות או חשבונות משתמש. הסימונים שלך —
        מה שנקרא, מה שנשמר ומה שהוצמד — נשמרים בדפדפן שלך בלבד, ואינם נשלחים
        לשום מקום ואינם משפיעים על מה שקוראים אחרים רואים.
      </p>

      <h2 className={H2}>גילוי נאות</h2>
      {/* Posted like a notice on the corridor wall: framed, not buried. */}
      <div className="mt-6 border-2 border-ink bg-surface">
        <div className="on-sign border-b border-sign-edge bg-sign px-5 py-2 font-display text-sm font-semibold text-sign-ink" aria-hidden="true">
          AiPulse
        </div>
        <div className="p-5 sm:p-6">
          <p className="max-w-[68ch] text-lg font-semibold leading-relaxed text-ink">
            התקצירים באתר מופקים בסריקה יומית אוטומטית ומקושרים למקור הראשוני.
            המקור הוא הקובע.
          </p>
          <p className="mt-3 max-w-[68ch] leading-[1.75] text-ink-2">
            קהל היעד כאן מקבל החלטות מקצועיות, ולכן מקור התוכן נאמר בגלוי ולא
            נקבר. תקציר אינו תחליף לקריאת המאמר: לפני הסתמכות על מספר או מסקנה,
            פתחו את הקישור למקור.
          </p>
        </div>
      </div>

      <p className="mt-12">
        <Link
          href="/feed"
          className="inline-flex min-h-11 sm:min-h-10 items-center gap-2 font-display text-[0.9375rem] font-semibold text-ink underline"
        >
          לפיד
          <ArrowStart />
        </Link>
      </p>
      </div>
    </main>
  );
}
