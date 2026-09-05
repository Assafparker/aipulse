/**
 * The hero field: scanned items thinning out toward the headline, with a
 * few picked out in accent and one flagged in rust. Generated from
 * assets/hero.svg.
 *
 * Inlined rather than <img> for the same reason as logo.tsx — an SVG loaded
 * as an image is an isolated document that cannot see the page tokens, so it
 * would freeze on light-mode colours and ignore the manual theme override.
 *
 * Two deliberate changes from the source file:
 *   1. Its internal <style> block is dropped. It defined :root variables,
 *      and once inlined, :root is the *document* root — it would have
 *      silently redefined the whole site palette.
 *   2. --line2 is remapped to the page's --line-2.
 *
 * The field is sparse on the right (only 8 of 141 circles sit past x=900).
 * In RTL the headline starts on the right, so it lands on that empty region.
 * Move the headline and this reserved space has to move with it.
 */
export function HeroGraphic({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1200 340"
      preserveAspectRatio="xMaxYMid slice"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="26.0" cy="40.0" r="3.5" fill="none" stroke="var(--line-2)" strokeWidth="1.3" opacity={0.84} />
      <circle cx="85.0" cy="40.0" r="3.5" fill="none" stroke="var(--line-2)" strokeWidth="1.3" opacity={0.81} />
      <circle cx="114.5" cy="40.0" r="3.5" fill="none" stroke="var(--line-2)" strokeWidth="1.3" opacity={0.80} />
      <circle cx="144.0" cy="40.0" r="3.5" fill="none" stroke="var(--line-2)" strokeWidth="1.3" opacity={0.78} />
      <circle cx="173.5" cy="40.0" r="3.5" fill="none" stroke="var(--line-2)" strokeWidth="1.3" opacity={0.77} />
      <circle cx="203.0" cy="40.0" r="3.5" fill="none" stroke="var(--line-2)" strokeWidth="1.3" opacity={0.76} />
      <circle cx="262.0" cy="40.0" r="3.5" fill="none" stroke="var(--line-2)" strokeWidth="1.3" opacity={0.73} />
      <circle cx="350.5" cy="40.0" r="3.5" fill="none" stroke="var(--line-2)" strokeWidth="1.3" opacity={0.69} />
      <circle cx="380.0" cy="40.0" r="3.5" fill="none" stroke="var(--line-2)" strokeWidth="1.3" opacity={0.68} />
      <circle cx="409.5" cy="40.0" r="3.5" fill="none" stroke="var(--line-2)" strokeWidth="1.3" opacity={0.66} />
      <circle cx="439.0" cy="40.0" r="3.5" fill="none" stroke="var(--line-2)" strokeWidth="1.3" opacity={0.65} />
      <circle cx="468.5" cy="40.0" r="3.5" fill="none" stroke="var(--line-2)" strokeWidth="1.3" opacity={0.64} />
      <circle cx="498.0" cy="40.0" r="3.5" fill="none" stroke="var(--line-2)" strokeWidth="1.3" opacity={0.62} />
      <circle cx="527.5" cy="40.0" r="3.5" fill="none" stroke="var(--line-2)" strokeWidth="1.3" opacity={0.61} />
      <circle cx="557.0" cy="40.0" r="3.5" fill="none" stroke="var(--line-2)" strokeWidth="1.3" opacity={0.59} />
      <circle cx="586.5" cy="40.0" r="3.5" fill="none" stroke="var(--line-2)" strokeWidth="1.3" opacity={0.58} />
      <circle cx="734.0" cy="40.0" r="3.5" fill="none" stroke="var(--line-2)" strokeWidth="1.3" opacity={0.51} />
      <circle cx="763.5" cy="40.0" r="3.5" fill="none" stroke="var(--line-2)" strokeWidth="1.3" opacity={0.50} />
      <circle cx="822.5" cy="40.0" r="3.5" fill="none" stroke="var(--line-2)" strokeWidth="1.3" opacity={0.47} />
      <circle cx="852.0" cy="40.0" r="5.4" fill="var(--accent)" />
      <circle cx="911.0" cy="40.0" r="3.5" fill="none" stroke="var(--line-2)" strokeWidth="1.3" opacity={0.43} />
      <circle cx="1058.5" cy="40.0" r="3.5" fill="none" stroke="var(--line-2)" strokeWidth="1.3" opacity={0.36} />
      <circle cx="1147.0" cy="40.0" r="3.5" fill="none" stroke="var(--line-2)" strokeWidth="1.3" opacity={0.32} />
      <circle cx="40.0" cy="82.0" r="3.5" fill="none" stroke="var(--line-2)" strokeWidth="1.3" opacity={0.83} />
      <circle cx="69.5" cy="82.0" r="3.5" fill="none" stroke="var(--line-2)" strokeWidth="1.3" opacity={0.82} />
      <circle cx="99.0" cy="82.0" r="3.5" fill="none" stroke="var(--line-2)" strokeWidth="1.3" opacity={0.80} />
      <circle cx="128.5" cy="82.0" r="3.5" fill="none" stroke="var(--line-2)" strokeWidth="1.3" opacity={0.79} />
      <circle cx="158.0" cy="82.0" r="3.5" fill="none" stroke="var(--line-2)" strokeWidth="1.3" opacity={0.78} />
      <circle cx="187.5" cy="82.0" r="3.5" fill="none" stroke="var(--line-2)" strokeWidth="1.3" opacity={0.76} />
      <circle cx="217.0" cy="82.0" r="3.5" fill="none" stroke="var(--line-2)" strokeWidth="1.3" opacity={0.75} />
      <circle cx="246.5" cy="82.0" r="3.5" fill="none" stroke="var(--line-2)" strokeWidth="1.3" opacity={0.74} />
      <circle cx="276.0" cy="82.0" r="5.4" fill="var(--accent)" />
      <circle cx="335.0" cy="82.0" r="3.5" fill="none" stroke="var(--line-2)" strokeWidth="1.3" opacity={0.70} />
      <circle cx="364.5" cy="82.0" r="3.5" fill="none" stroke="var(--line-2)" strokeWidth="1.3" opacity={0.68} />
      <circle cx="423.5" cy="82.0" r="3.5" fill="none" stroke="var(--line-2)" strokeWidth="1.3" opacity={0.66} />
      <circle cx="482.5" cy="82.0" r="3.5" fill="none" stroke="var(--line-2)" strokeWidth="1.3" opacity={0.63} />
      <circle cx="541.5" cy="82.0" r="3.5" fill="none" stroke="var(--line-2)" strokeWidth="1.3" opacity={0.60} />
      <circle cx="571.0" cy="82.0" r="3.5" fill="none" stroke="var(--line-2)" strokeWidth="1.3" opacity={0.59} />
      <circle cx="630.0" cy="82.0" r="3.5" fill="none" stroke="var(--line-2)" strokeWidth="1.3" opacity={0.56} />
      <circle cx="659.5" cy="82.0" r="3.5" fill="none" stroke="var(--line-2)" strokeWidth="1.3" opacity={0.55} />
      <circle cx="807.0" cy="82.0" r="3.5" fill="none" stroke="var(--line-2)" strokeWidth="1.3" opacity={0.48} />
      <circle cx="895.5" cy="82.0" r="3.5" fill="none" stroke="var(--line-2)" strokeWidth="1.3" opacity={0.44} />
      <circle cx="984.0" cy="82.0" r="4.6" fill="none" stroke="var(--accent)" strokeWidth="1.6" />
      <circle cx="1102.0" cy="82.0" r="3.5" fill="none" stroke="var(--line-2)" strokeWidth="1.3" opacity={0.34} />
      <circle cx="26.0" cy="124.0" r="3.5" fill="none" stroke="var(--line-2)" strokeWidth="1.3" opacity={0.84} />
      <circle cx="55.5" cy="124.0" r="3.5" fill="none" stroke="var(--line-2)" strokeWidth="1.3" opacity={0.82} />
      <circle cx="85.0" cy="124.0" r="3.5" fill="none" stroke="var(--line-2)" strokeWidth="1.3" opacity={0.81} />
      <circle cx="114.5" cy="124.0" r="3.5" fill="none" stroke="var(--line-2)" strokeWidth="1.3" opacity={0.80} />
      <circle cx="144.0" cy="124.0" r="3.5" fill="none" stroke="var(--line-2)" strokeWidth="1.3" opacity={0.78} />
      <circle cx="203.0" cy="124.0" r="3.5" fill="none" stroke="var(--line-2)" strokeWidth="1.3" opacity={0.76} />
      <circle cx="262.0" cy="124.0" r="3.5" fill="none" stroke="var(--line-2)" strokeWidth="1.3" opacity={0.73} />
      <circle cx="291.5" cy="124.0" r="3.5" fill="none" stroke="var(--line-2)" strokeWidth="1.3" opacity={0.72} />
      <circle cx="321.0" cy="124.0" r="3.5" fill="none" stroke="var(--line-2)" strokeWidth="1.3" opacity={0.70} />
      <circle cx="350.5" cy="124.0" r="3.5" fill="none" stroke="var(--line-2)" strokeWidth="1.3" opacity={0.69} />
      <circle cx="380.0" cy="124.0" r="3.5" fill="none" stroke="var(--line-2)" strokeWidth="1.3" opacity={0.68} />
      <circle cx="527.5" cy="124.0" r="3.5" fill="none" stroke="var(--line-2)" strokeWidth="1.3" opacity={0.61} />
      <circle cx="557.0" cy="124.0" r="3.5" fill="none" stroke="var(--line-2)" strokeWidth="1.3" opacity={0.59} />
      <circle cx="675.0" cy="124.0" r="3.5" fill="none" stroke="var(--line-2)" strokeWidth="1.3" opacity={0.54} />
      <circle cx="704.5" cy="124.0" r="3.5" fill="none" stroke="var(--line-2)" strokeWidth="1.3" opacity={0.53} />
      <circle cx="734.0" cy="124.0" r="5.4" fill="var(--accent)" />
      <circle cx="763.5" cy="124.0" r="3.5" fill="none" stroke="var(--line-2)" strokeWidth="1.3" opacity={0.50} />
      <circle cx="40.0" cy="166.0" r="3.5" fill="none" stroke="var(--line-2)" strokeWidth="1.3" opacity={0.83} />
      <circle cx="69.5" cy="166.0" r="3.5" fill="none" stroke="var(--line-2)" strokeWidth="1.3" opacity={0.82} />
      <circle cx="99.0" cy="166.0" r="3.5" fill="none" stroke="var(--line-2)" strokeWidth="1.3" opacity={0.80} />
      <circle cx="187.5" cy="166.0" r="3.5" fill="none" stroke="var(--line-2)" strokeWidth="1.3" opacity={0.76} />
      <circle cx="217.0" cy="166.0" r="3.5" fill="none" stroke="var(--line-2)" strokeWidth="1.3" opacity={0.75} />
      <circle cx="246.5" cy="166.0" r="3.5" fill="none" stroke="var(--line-2)" strokeWidth="1.3" opacity={0.74} />
      <circle cx="276.0" cy="166.0" r="3.5" fill="none" stroke="var(--line-2)" strokeWidth="1.3" opacity={0.72} />
      <circle cx="305.5" cy="166.0" r="3.5" fill="none" stroke="var(--line-2)" strokeWidth="1.3" opacity={0.71} />
      <circle cx="335.0" cy="166.0" r="3.5" fill="none" stroke="var(--line-2)" strokeWidth="1.3" opacity={0.70} />
      <circle cx="394.0" cy="166.0" r="3.5" fill="none" stroke="var(--line-2)" strokeWidth="1.3" opacity={0.67} />
      <circle cx="453.0" cy="166.0" r="3.5" fill="none" stroke="var(--line-2)" strokeWidth="1.3" opacity={0.64} />
      <circle cx="482.5" cy="166.0" r="3.5" fill="none" stroke="var(--line-2)" strokeWidth="1.3" opacity={0.63} />
      <circle cx="512.0" cy="166.0" r="3.5" fill="none" stroke="var(--line-2)" strokeWidth="1.3" opacity={0.62} />
      <circle cx="600.5" cy="166.0" r="3.5" fill="none" stroke="var(--line-2)" strokeWidth="1.3" opacity={0.57} />
      <circle cx="630.0" cy="166.0" r="3.5" fill="none" stroke="var(--line-2)" strokeWidth="1.3" opacity={0.56} />
      <circle cx="659.5" cy="166.0" r="3.5" fill="none" stroke="var(--line-2)" strokeWidth="1.3" opacity={0.55} />
      <circle cx="777.5" cy="166.0" r="3.5" fill="none" stroke="var(--line-2)" strokeWidth="1.3" opacity={0.49} />
      <circle cx="807.0" cy="166.0" r="3.5" fill="none" stroke="var(--line-2)" strokeWidth="1.3" opacity={0.48} />
      <circle cx="984.0" cy="166.0" r="3.5" fill="none" stroke="var(--line-2)" strokeWidth="1.3" opacity={0.40} />
      <circle cx="1043.0" cy="166.0" r="3.5" fill="none" stroke="var(--line-2)" strokeWidth="1.3" opacity={0.37} />
      <circle cx="26.0" cy="208.0" r="5.4" fill="var(--accent)" />
      <circle cx="55.5" cy="208.0" r="3.5" fill="none" stroke="var(--line-2)" strokeWidth="1.3" opacity={0.82} />
      <circle cx="85.0" cy="208.0" r="3.5" fill="none" stroke="var(--line-2)" strokeWidth="1.3" opacity={0.81} />
      <circle cx="114.5" cy="208.0" r="3.5" fill="none" stroke="var(--line-2)" strokeWidth="1.3" opacity={0.80} />
      <circle cx="144.0" cy="208.0" r="3.5" fill="none" stroke="var(--line-2)" strokeWidth="1.3" opacity={0.78} />
      <circle cx="173.5" cy="208.0" r="3.5" fill="none" stroke="var(--line-2)" strokeWidth="1.3" opacity={0.77} />
      <circle cx="203.0" cy="208.0" r="3.5" fill="none" stroke="var(--line-2)" strokeWidth="1.3" opacity={0.76} />
      <circle cx="232.5" cy="208.0" r="3.5" fill="none" stroke="var(--line-2)" strokeWidth="1.3" opacity={0.74} />
      <circle cx="262.0" cy="208.0" r="3.5" fill="none" stroke="var(--line-2)" strokeWidth="1.3" opacity={0.73} />
      <circle cx="291.5" cy="208.0" r="3.5" fill="none" stroke="var(--line-2)" strokeWidth="1.3" opacity={0.72} />
      <circle cx="321.0" cy="208.0" r="3.5" fill="none" stroke="var(--line-2)" strokeWidth="1.3" opacity={0.70} />
      <circle cx="350.5" cy="208.0" r="3.5" fill="none" stroke="var(--line-2)" strokeWidth="1.3" opacity={0.69} />
      <circle cx="439.0" cy="208.0" r="3.5" fill="none" stroke="var(--line-2)" strokeWidth="1.3" opacity={0.65} />
      <circle cx="468.5" cy="208.0" r="3.5" fill="none" stroke="var(--line-2)" strokeWidth="1.3" opacity={0.64} />
      <circle cx="498.0" cy="208.0" r="3.5" fill="none" stroke="var(--line-2)" strokeWidth="1.3" opacity={0.62} />
      <circle cx="527.5" cy="208.0" r="3.5" fill="none" stroke="var(--line-2)" strokeWidth="1.3" opacity={0.61} />
      <circle cx="557.0" cy="208.0" r="3.5" fill="none" stroke="var(--line-2)" strokeWidth="1.3" opacity={0.59} />
      <circle cx="586.5" cy="208.0" r="3.5" fill="none" stroke="var(--line-2)" strokeWidth="1.3" opacity={0.58} />
      <circle cx="645.5" cy="208.0" r="3.5" fill="none" stroke="var(--line-2)" strokeWidth="1.3" opacity={0.55} />
      <circle cx="704.5" cy="208.0" r="4.6" fill="none" stroke="var(--accent)" strokeWidth="1.6" />
      <circle cx="763.5" cy="208.0" r="3.5" fill="none" stroke="var(--line-2)" strokeWidth="1.3" opacity={0.50} />
      <circle cx="852.0" cy="208.0" r="3.5" fill="none" stroke="var(--line-2)" strokeWidth="1.3" opacity={0.46} />
      <circle cx="1029.0" cy="208.0" r="3.5" fill="none" stroke="var(--line-2)" strokeWidth="1.3" opacity={0.38} />
      <circle cx="99.0" cy="250.0" r="3.5" fill="none" stroke="var(--line-2)" strokeWidth="1.3" opacity={0.80} />
      <circle cx="128.5" cy="250.0" r="4.6" fill="none" stroke="var(--accent)" strokeWidth="1.6" />
      <circle cx="187.5" cy="250.0" r="3.5" fill="none" stroke="var(--line-2)" strokeWidth="1.3" opacity={0.76} />
      <circle cx="217.0" cy="250.0" r="3.5" fill="none" stroke="var(--line-2)" strokeWidth="1.3" opacity={0.75} />
      <circle cx="276.0" cy="250.0" r="3.5" fill="none" stroke="var(--line-2)" strokeWidth="1.3" opacity={0.72} />
      <circle cx="335.0" cy="250.0" r="3.5" fill="none" stroke="var(--line-2)" strokeWidth="1.3" opacity={0.70} />
      <circle cx="364.5" cy="250.0" r="3.5" fill="none" stroke="var(--line-2)" strokeWidth="1.3" opacity={0.68} />
      <circle cx="423.5" cy="250.0" r="3.5" fill="none" stroke="var(--line-2)" strokeWidth="1.3" opacity={0.66} />
      <circle cx="453.0" cy="250.0" r="3.5" fill="none" stroke="var(--line-2)" strokeWidth="1.3" opacity={0.64} />
      <circle cx="571.0" cy="250.0" r="4.6" fill="none" stroke="var(--accent)" strokeWidth="1.6" />
      <circle cx="600.5" cy="250.0" r="3.5" fill="none" stroke="var(--line-2)" strokeWidth="1.3" opacity={0.57} />
      <circle cx="630.0" cy="250.0" r="3.5" fill="none" stroke="var(--line-2)" strokeWidth="1.3" opacity={0.56} />
      <circle cx="807.0" cy="250.0" r="3.5" fill="none" stroke="var(--line-2)" strokeWidth="1.3" opacity={0.48} />
      <circle cx="895.5" cy="250.0" r="3.5" fill="none" stroke="var(--line-2)" strokeWidth="1.3" opacity={0.44} />
      <circle cx="26.0" cy="292.0" r="3.5" fill="none" stroke="var(--line-2)" strokeWidth="1.3" opacity={0.84} />
      <circle cx="55.5" cy="292.0" r="3.5" fill="none" stroke="var(--line-2)" strokeWidth="1.3" opacity={0.82} />
      <circle cx="85.0" cy="292.0" r="5.4" fill="var(--accent)" />
      <circle cx="114.5" cy="292.0" r="3.5" fill="none" stroke="var(--line-2)" strokeWidth="1.3" opacity={0.80} />
      <circle cx="144.0" cy="292.0" r="3.5" fill="none" stroke="var(--line-2)" strokeWidth="1.3" opacity={0.78} />
      <circle cx="173.5" cy="292.0" r="3.5" fill="none" stroke="var(--line-2)" strokeWidth="1.3" opacity={0.77} />
      <circle cx="203.0" cy="292.0" r="3.5" fill="none" stroke="var(--line-2)" strokeWidth="1.3" opacity={0.76} />
      <circle cx="232.5" cy="292.0" r="5.4" fill="var(--accent)" />
      <circle cx="291.5" cy="292.0" r="3.5" fill="none" stroke="var(--line-2)" strokeWidth="1.3" opacity={0.72} />
      <circle cx="321.0" cy="292.0" r="3.5" fill="none" stroke="var(--line-2)" strokeWidth="1.3" opacity={0.70} />
      <circle cx="409.5" cy="292.0" r="3.5" fill="none" stroke="var(--line-2)" strokeWidth="1.3" opacity={0.66} />
      <circle cx="439.0" cy="292.0" r="3.5" fill="none" stroke="var(--line-2)" strokeWidth="1.3" opacity={0.65} />
      <circle cx="498.0" cy="292.0" r="3.5" fill="none" stroke="var(--line-2)" strokeWidth="1.3" opacity={0.62} />
      <circle cx="527.5" cy="292.0" r="3.5" fill="none" stroke="var(--line-2)" strokeWidth="1.3" opacity={0.61} />
      <circle cx="557.0" cy="292.0" r="3.5" fill="none" stroke="var(--line-2)" strokeWidth="1.3" opacity={0.59} />
      <circle cx="586.5" cy="292.0" r="3.5" fill="none" stroke="var(--line-2)" strokeWidth="1.3" opacity={0.58} />
      <circle cx="645.5" cy="292.0" r="3.5" fill="none" stroke="var(--line-2)" strokeWidth="1.3" opacity={0.55} />
      <circle cx="675.0" cy="292.0" r="3.5" fill="none" stroke="var(--line-2)" strokeWidth="1.3" opacity={0.54} />
      <circle cx="704.5" cy="292.0" r="3.5" fill="none" stroke="var(--line-2)" strokeWidth="1.3" opacity={0.53} />
      <circle cx="763.5" cy="292.0" r="3.5" fill="none" stroke="var(--line-2)" strokeWidth="1.3" opacity={0.50} />
      <circle cx="793.0" cy="292.0" r="3.5" fill="none" stroke="var(--line-2)" strokeWidth="1.3" opacity={0.49} />
      <circle cx="822.5" cy="292.0" r="3.5" fill="none" stroke="var(--line-2)" strokeWidth="1.3" opacity={0.47} />
      <circle cx="196" cy="166" r="7.2" fill="var(--pin)" />
      <path d="M0 339 H1200" stroke="var(--line)" strokeWidth="1.5" />
    </svg>
  );
}
