import type { FamilyId } from "@/lib/schema";

/**
 * Source-family icons, inlined from assets/icons-inline/.
 *
 * Inlined rather than served through <img> on purpose: an SVG loaded as an
 * image is an isolated document that does not inherit `color`, so every
 * currentColor stroke would collapse to black — fine in light mode, invisible
 * in dark. See SPEC.md 7 and NOTES.md. assets/icons/ holds the <img> variant,
 * which carries its own colours; we do not use it here.
 *
 * All eight share the wrapper below and differ only in their paths.
 */

const PATHS: Record<FamilyId, React.ReactNode> = {
  lab: (
    <>
      <path d="M9.5 2.5V9L4.8 18.2a1.8 1.8 0 0 0 1.6 2.7h11.2a1.8 1.8 0 0 0 1.6-2.7L14.5 9V2.5" />
      <path d="M8 2.5h8" />
      <path d="M7.2 15.2h9.6" />
    </>
  ),
  journal: (
    <>
      <path d="M6 2.5h12.5v19H6a1.8 1.8 0 0 1 0-3.6h12.5" />
      <path d="M9 8.6l2.4 2.4L16 6.4" />
    </>
  ),
  preprint: (
    <>
      <path d="M6.5 2.5H14l4 4v15H6.5z" />
      <path d="M14 2.5v4h4" />
      <path d="M9.5 12h6" />
      <path d="M9.5 15.6h6" strokeDasharray="2 2" />
    </>
  ),
  regulator: (
    <>
      <path d="M12 2.3l7.2 2.9V11c0 4.6-3 8.5-7.2 10.4C7.8 19.5 4.8 15.6 4.8 11V5.2z" />
      <path d="M8.8 11.4h6.4" />
      <path d="M12 11.4v4.2" />
    </>
  ),
  provider: (
    <>
      <path d="M5 21.5V7h14v14.5" />
      <path d="M3 21.5h18" />
      <path d="M12 10.5v6" />
      <path d="M9 13.5h6" />
    </>
  ),
  people: (
    <>
      <circle cx="12" cy="8.2" r="3.6" />
      <path d="M5.6 20.8a6.6 6.6 0 0 1 12.8 0" />
    </>
  ),
  press: (
    <>
      <path d="M3.5 6.5h13v14H5.5a2 2 0 0 1-2-2z" />
      <path d="M16.5 9.5h3a1 1 0 0 1 1 1v8a2 2 0 0 1-2 2h-2" />
      <path d="M6.2 9.8h7.6" />
      <path d="M6.2 13.2h7.6" />
      <path d="M6.2 16.6h4.3" />
    </>
  ),
  social: (
    <>
      <circle cx="6.8" cy="7.2" r="2.2" />
      <circle cx="17.2" cy="7.2" r="2.2" />
      <circle cx="12" cy="17" r="2.2" />
      <path d="M9 7.2h5.2" />
      <path d="M8 9.2l2.6 6" />
      <path d="M16 9.2l-2.6 6" />
      <path d="M3.6 20.4L20.4 3.6" />
    </>
  ),
};

export function FamilyIcon({ fam, size = 15 }: { fam: FamilyId; size?: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {PATHS[fam]}
    </svg>
  );
}
