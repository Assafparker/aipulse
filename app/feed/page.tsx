import type { Metadata } from "next";
import Link from "next/link";
import { FeedList } from "@/components/feed/feed-list";
import { LAST_SCAN, RECENT } from "@/lib/content";
import { itemCount } from "@/lib/format";

export const metadata: Metadata = {
  title: "הפיד — AiPulse",
  description:
    "30 הימים האחרונים בסריקה היומית של AI בבריאות, מהחדש לישן, עם קישור למקור הראשוני.",
};

/**
 * Server component. It hands RECENT to the client FeedList, so the items are
 * in the initial HTML rather than fetched after hydration.
 */
export default function FeedPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">הפיד</h1>
        <p className="mt-2 text-sm text-ink-3">
          30 הימים האחרונים · <span className="tnum">{itemCount(RECENT.length)}</span> ·
          סריקה אחרונה{" "}
          <time dateTime={LAST_SCAN} className="tnum ltr text-ink-2">
            {LAST_SCAN}
          </time>
        </p>
        <p className="mt-2 text-sm">
          <Link href="/archive" className="text-accent hover:underline">
            לארכיון המלא
          </Link>
        </p>
      </header>

      <FeedList items={RECENT} lastScan={LAST_SCAN} />
    </main>
  );
}
