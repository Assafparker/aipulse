"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * The site's one living element: floor lines painting themselves.
 *
 * Inside this wrapper, decorative lines are animated with transforms and
 * opacity only:
 *   [data-wake]   — horizontal lines that switch on in sequence, family after
 *                   family, like corridor lights coming on at six.
 *   [data-lane]   — an item's own lane, drawn down the rail as the item
 *                   enters the viewport;
 *   [data-bend]   — then the line turns off the lane (the corner grows out of
 *                   the lane: opacity and scale from that point);
 *   [data-branch] — then it runs into the headline (scaleX from the lane).
 *
 * Calm with many items: items that enter together are taken at most three
 * at a time, each one finishing its turn a beat after the one before, so a
 * fast scroll never sets the whole list moving at once.
 *
 * The unpainted start state lives in globals.css under `.motion-ok`, which the
 * head script sets only when the reader has no reduced-motion preference. So
 * a reduced-motion reader sees every line in place and nothing moves, and
 * content itself is never hidden by any of this. A painted line gets
 * data-drawn, which keeps it painted across React re-renders and reverts.
 *
 * `dep` re-runs the setup when the rendered list changes (a filter, a restored
 * item), so lines that newly appear are painted too.
 */
export function LineMotion({
  children,
  dep,
  className,
}: {
  children: React.ReactNode;
  dep?: string;
  className?: string;
}) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;
      const markDrawn = (els: Element[]) =>
        els.forEach((el) => el.setAttribute("data-drawn", ""));

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // In RTL the start edge is the right edge; a line is painted from
        // where the reader's eye enters it.
        const rtl = getComputedStyle(root).direction === "rtl";
        const startEdge = rtl ? "100% 50%" : "0% 50%";

        const wake = gsap.utils.toArray<HTMLElement>(
          "[data-wake]:not([data-drawn])",
          root,
        );
        if (wake.length) {
          gsap.fromTo(
            wake,
            { scaleX: 0, transformOrigin: startEdge },
            {
              scaleX: 1,
              duration: 0.9,
              ease: "expo.out",
              stagger: 0.09,
              delay: 0.15,
              onComplete: () => markDrawn(wake),
            },
          );
        }

        // The start corner of the turn sits on the lane, at the turn's top.
        const bendOrigin = rtl ? "100% 0%" : "0% 0%";

        const lanes = gsap.utils.toArray<HTMLElement>(
          "[data-lane]:not([data-drawn])",
          root,
        );
        ScrollTrigger.batch(lanes, {
          start: "top 88%",
          once: true,
          interval: 0.15,
          batchMax: 3,
          onEnter: (batch) => {
            const els = batch as HTMLElement[];
            const pieces = (sel: string) =>
              els
                .map((el) => el.closest("article")?.querySelector<HTMLElement>(sel))
                .filter((b): b is HTMLElement => !!b);
            const bends = pieces("[data-bend]");
            const branches = pieces("[data-branch]");
            const step = 0.14;
            const tl = gsap.timeline({
              onComplete: () => markDrawn([...els, ...bends, ...branches]),
            });
            tl.fromTo(
              els,
              { scaleY: 0 },
              { scaleY: 1, duration: 0.7, ease: "expo.out", stagger: step },
            );
            if (bends.length) {
              tl.fromTo(
                bends,
                { opacity: 0, scale: 0.3, transformOrigin: bendOrigin },
                { opacity: 1, scale: 1, duration: 0.3, ease: "power2.out", stagger: step },
                0.22,
              );
            }
            if (branches.length) {
              tl.fromTo(
                branches,
                { scaleX: 0, transformOrigin: startEdge },
                { scaleX: 1, duration: 0.5, ease: "expo.out", stagger: step },
                0.36,
              );
            }
          },
        });
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        markDrawn(
          gsap.utils.toArray<HTMLElement>(
            "[data-wake], [data-lane], [data-bend], [data-branch]",
            root,
          ),
        );
      });
    },
    { scope, dependencies: [dep], revertOnUpdate: true },
  );

  return (
    <div ref={scope} className={className}>
      {children}
    </div>
  );
}
