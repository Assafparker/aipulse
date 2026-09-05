/**
 * Hebrew display helpers for archive keys and item counts.
 *
 * Month names are hardcoded rather than derived from Intl so the build carries
 * no dependency on the runtime's locale data, and month titles stay
 * byte-identical across environments — these strings go into per-month <title>
 * tags, which SPEC.md 6 identifies as the archive's search-traffic surface.
 */

const MONTH_NAMES = [
  "ינואר", "פברואר", "מרץ", "אפריל", "מאי", "יוני",
  "יולי", "אוגוסט", "ספטמבר", "אוקטובר", "נובמבר", "דצמבר",
];

/** "2026-09" → "ספטמבר 2026" */
export function monthLabel(month: string): string {
  const [year, mm] = month.split("-");
  const name = MONTH_NAMES[Number(mm) - 1];
  return name ? `${name} ${year}` : month;
}

/**
 * Hebrew does not take a plural noun after 1, so "1 פריטים" is wrong.
 * One item reads "פריט אחד"; anything else takes the plural.
 */
export function itemCount(n: number): string {
  return n === 1 ? "פריט אחד" : `${n} פריטים`;
}
