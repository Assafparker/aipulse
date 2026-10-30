/**
 * The wayfinding arrow: points toward the reading direction's end, which in
 * this RTL site is the left. Drawn rather than typed, so it matches the
 * stroke of the other icons.
 */
export function ArrowStart({ size = 18 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 20 20"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="square"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M17 10H4" />
      <path d="M9 5L4 10L9 15" />
    </svg>
  );
}
