"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";
import { LOGO_REST } from "@/components/brand/logo";

gsap.registerPlugin(useGSAP);

/**
 * The logo's beat, about 2.2s:
 *   1. t=0, the centre dot beats once (scale 1 → 1.3 → 1, 0.25s);
 *   2. from t=0.15s, four ripples leave the centre dot (r 6.8) for the ring
 *      (r 21) and fade, one every 0.28s, 0.8s each, in the category colours
 *      in lane order — R&D, health services, regulation, infrastructure;
 *   3. as each ripple reaches the ring (0.6s into it) the ring takes its
 *      colour (0.15s), and after the last one settles back to ivory (0.5s),
 *      so it never rests on a category colour;
 *   4. the flagged dot, hidden from t=0, pops in over the settle (scale 0 → 1
 *      with a slight overshoot).
 *
 * Plays once on load, and again on hover or tap — never stacked: a trigger
 * while it is still running is ignored. No loop. Under reduced motion nothing
 * is created and the mark stays at rest. The flagged dot starts hidden only
 * under `.motion-ok` (globals.css), the same gate the floor lines use, until
 * GSAP marks it data-shown; without JavaScript or with reduced motion it is
 * simply there.
 */

const RIPPLE_START = 0.15;
const RIPPLE_EVERY = 0.28;
const RIPPLE_LENGTH = 0.8;
const RIPPLE_REACH = 0.6;

export function LogoMotion({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const scope = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;
      const ring = root.querySelector<SVGCircleElement>("[data-logo-ring]");
      const core = root.querySelector<SVGCircleElement>("[data-logo-core]");
      const flag = root.querySelector<SVGCircleElement>("[data-logo-flag]");
      const ripples = gsap.utils.toArray<SVGCircleElement>("[data-logo-ripple]", root);
      if (!ring || !core || !flag || ripples.length === 0) return;

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({ paused: true });

        // The flagged dot hides for the length of the play. data-shown lifts
        // the CSS gate for good, so a revert can never leave it hidden.
        tl.call(() => flag.setAttribute("data-shown", ""), undefined, 0)
          .set(flag, { scale: 0, transformOrigin: "50% 50%" }, 0)
          .set(ring, { stroke: LOGO_REST.ring }, 0);

        // 1 — the beat
        tl.set(core, { transformOrigin: "50% 50%" }, 0)
          .to(core, { scale: 1.3, duration: 0.125, ease: "power2.out" }, 0)
          .to(core, { scale: 1, duration: 0.125, ease: "power2.in" }, 0.125);

        // 2, 3 — the ripples, and the ring taking each one's colour
        let last = 0;
        ripples.forEach((ripple, i) => {
          const start = RIPPLE_START + i * RIPPLE_EVERY;
          const color = ripple.getAttribute("stroke") ?? LOGO_REST.ring;
          // Each ripple's earliest state is invisible: a restart rewinds every
          // tween to its start, and a waiting ripple must not sit visible
          // around the centre dot.
          tl.fromTo(
            ripple,
            { attr: { r: 6.8 } },
            { attr: { r: 21 }, duration: RIPPLE_LENGTH, ease: "power1.out" },
            start,
          )
            .fromTo(ripple, { opacity: 0 }, { opacity: 0.95, duration: 0.06, ease: "none" }, start)
            .to(ripple, { opacity: 0, duration: RIPPLE_LENGTH - 0.06, ease: "power1.out" }, start + 0.06)
            .to(ring, { stroke: color, duration: 0.15, ease: "none" }, start + RIPPLE_REACH);
          last = start + RIPPLE_REACH + 0.15;
        });
        tl.to(ring, { stroke: LOGO_REST.ring, duration: 0.5, ease: "power1.inOut" }, last);

        // 4 — the flag pops in over the settle
        tl.to(flag, { scale: 1, duration: 0.4, ease: "back.out(2.2)" }, last + 0.1);

        // Not contextSafe: it only restarts this timeline, and wrapping it in
        // the outer context from inside matchMedia's links the two contexts
        // in a cycle that overflows the stack on unmount.
        const play = () => {
          if (!tl.isActive()) tl.restart();
        };

        const start = gsap.delayedCall(0.35, play);
        root.addEventListener("pointerenter", play);
        root.addEventListener("pointerdown", play);
        return () => {
          start.kill();
          root.removeEventListener("pointerenter", play);
          root.removeEventListener("pointerdown", play);
        };
      });
    },
    { scope },
  );

  return (
    <span ref={scope} className={className}>
      {children}
    </span>
  );
}
