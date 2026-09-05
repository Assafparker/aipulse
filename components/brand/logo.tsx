/**
 * The AiPulse mark — a ring (the daily scan), one selected item at its
 * centre, and a single rust-coloured dot: the item the reader flagged.
 *
 * Inlined rather than served as an <img> on purpose. An SVG loaded as an
 * image is an isolated document that cannot see the page's tokens, so it
 * would freeze on the light-mode colours. Inlined, it reads --accent and
 * --pin directly and follows both the system theme and the manual override.
 */
export function Logo({ size = 40 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      aria-hidden="true"
      focusable="false"
    >
      <circle
        cx="30"
        cy="34"
        r="20.5"
        fill="none"
        stroke="var(--accent)"
        strokeWidth="3.6"
      />
      <circle cx="30" cy="34" r="6.8" fill="var(--accent)" />
      <circle cx="47.5" cy="16.5" r="4.2" fill="var(--pin)" />
    </svg>
  );
}
