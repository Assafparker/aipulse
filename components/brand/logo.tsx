/**
 * The AiPulse mark — a ring (the daily scan), one selected item at its
 * centre, and a yellow dot off the ring: the item the reader flagged.
 *
 * It always sits on the indigo sign (--sign), in both themes, so its
 * colours are fixed values rather than theme tokens: ivory ring, neon-blue
 * centre, yellow flag. On indigo: ivory 12.2:1, blue 6.6:1, yellow 11.8:1.
 *
 * Inlined rather than served as an <img>: an SVG loaded as an image is an
 * isolated document and could not take part in the page's motion.
 *
 * The markup is the rest state. The four ripple rings the motion components
 * animate ship at opacity 0, so the mark is complete and unchanged before the first
 * play, if JavaScript fails, and under reduced motion. Ripples draw under
 * the ring and the centre dot; their 2px stroke does not scale with the mark.
 */

export const LOGO_REST = {
  ring: "#e8d9b5",
  core: "#2ea8ff",
  flag: "#ffd300",
} as const;

/** The category line colours (dark values), in lane order. On indigo each
    holds 3.5:1 or better (red is the lowest). */
export const LOGO_WAVES = ["#0098d4", "#00a33c", "#dc241f", "#ffd300"] as const;

export const LOGO_RING_RADIUS = 20.5;
const LOGO_CORE_RADIUS = 6.8;

/** rippleRadius is where the ripples rest: the centre dot for LogoMotion, the
    ring for the home lockup, whose ripples leave the ring outward. */
export function Logo({
  size = 40,
  rippleRadius = LOGO_CORE_RADIUS,
}: {
  size?: number;
  rippleRadius?: number;
}) {
  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      aria-hidden="true"
      focusable="false"
      overflow="visible"
    >
      {LOGO_WAVES.map((color) => (
        <circle
          key={color}
          data-logo-ripple
          cx="30"
          cy="34"
          r={rippleRadius}
          fill="none"
          stroke={color}
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
          opacity="0"
        />
      ))}
      <circle
        data-logo-ring
        cx="30"
        cy="34"
        r={LOGO_RING_RADIUS}
        fill="none"
        stroke={LOGO_REST.ring}
        strokeWidth="3.6"
      />
      <circle data-logo-core cx="30" cy="34" r={LOGO_CORE_RADIUS} fill={LOGO_REST.core} />
      <circle data-logo-flag cx="47.5" cy="16.5" r="4.2" fill={LOGO_REST.flag} />
    </svg>
  );
}
