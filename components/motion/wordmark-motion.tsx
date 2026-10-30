"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";
import { Logo, LOGO_RING_RADIUS, LOGO_WAVES } from "@/components/brand/logo";

gsap.registerPlugin(useGSAP);

/**
 * The home sign's lockup and its glitch, about 2.4s. Only this lockup has it;
 * the header keeps LogoMotion.
 *   1. four waves, one per category colour in lane order, start 0.36s apart
 *      and cross the word from A to e, one letter every 0.05s;
 *   2. a letter the wave reaches jitters for four frames behind two coloured
 *      text-shadow echoes, then settles. The glyphs themselves never change
 *      colour;
 *   3. a wave leaving the e reaches the ring: the ring takes its colour, the
 *      centre dot beats once and a thin ripple leaves the ring outward;
 *   4. after the fourth wave the ring settles to ivory and the flagged dot,
 *      hidden from t=0, pops in.
 *
 * Plays once on load, and again on hover or tap of the word or the mark —
 * never stacked: a trigger while it is running is ignored. No loop. Each play
 * builds a new timeline, so its random offsets differ from the last. Under
 * reduced motion nothing is created. The word is LTR inside an RTL page: the
 * letters are inline-blocks, which bidi would otherwise lay out in reverse.
 */

const WORD = "AiPulse";

const WAVE_EVERY = 0.36;
const LETTER_EVERY = 0.05;
const FRAME = 0.045;
const FRAMES = 4;
const LETTER_SETTLE = 0.12;
const RIPPLE_LENGTH = 0.6;
const RIPPLE_SCALE = 1.5;
const RING_HOLD = 0.3;
const RING_SETTLE = 0.5;

const JITTER_X = 1.5;
const JITTER_Y = 0.75;
const ECHO = 2;
const ECHO_VARY = 0.3;

function echo(color: string, offset: number, alpha = 1) {
  const [r, g, b] = gsap.utils.splitColor(color);
  return `rgba(${r}, ${g}, ${b}, ${alpha}) ${offset.toFixed(2)}px 0px 0px`;
}

export function WordmarkMotion() {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;
      const word = root.querySelector<HTMLElement>("[data-wordmark-word]");
      const mark = root.querySelector<HTMLElement>("[data-wordmark-mark]");
      const ring = root.querySelector<SVGCircleElement>("[data-logo-ring]");
      const core = root.querySelector<SVGCircleElement>("[data-logo-core]");
      const flag = root.querySelector<SVGCircleElement>("[data-logo-flag]");
      const ripples = gsap.utils.toArray<SVGCircleElement>("[data-logo-ripple]", root);
      const letters = gsap.utils.toArray<HTMLElement>("[data-wordmark-letter]", root);
      if (!word || !mark || !ring || !core || !flag || ripples.length === 0) return;

      const moved = [...letters, ring, core, flag, ...ripples];

      // Back to the bare markup: the rest state is the static design, with
      // nothing of GSAP's left on any element.
      const rest = () => {
        gsap.set(moved, { clearProps: "all" });
        moved.forEach((el) => {
          el.removeAttribute("style");
          el.removeAttribute("transform");
          el.removeAttribute("data-svg-origin");
        });
      };

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        let tl: gsap.core.Timeline | null = null;

        const build = () => {
          const next = gsap.timeline({
            onComplete: () => {
              tl = null;
              rest();
            },
          });

          // The flagged dot hides for the length of the play. data-shown
          // lifts the CSS gate for good, so a revert can never leave it hidden.
          flag.setAttribute("data-shown", "");
          next.set(flag, { scale: 0, transformOrigin: "50% 50%" }, 0);
          next.set(core, { transformOrigin: "50% 50%" }, 0);

          let reach = 0;
          LOGO_WAVES.forEach((color, wave) => {
            const start = wave * WAVE_EVERY;
            const pair = LOGO_WAVES[(wave + 2) % LOGO_WAVES.length];

            // 1, 2 — the wave across the letters
            letters.forEach((letter, i) => {
              const at = start + i * LETTER_EVERY;
              for (let frame = 0; frame < FRAMES; frame++) {
                const vary = () => gsap.utils.random(1 - ECHO_VARY, 1 + ECHO_VARY);
                next.set(
                  letter,
                  {
                    x: gsap.utils.random(-JITTER_X, JITTER_X),
                    y: gsap.utils.random(-JITTER_Y, JITTER_Y),
                    textShadow: `${echo(color, -ECHO * vary())}, ${echo(pair, ECHO * vary())}`,
                  },
                  at + frame * FRAME,
                );
              }
              next.to(
                letter,
                {
                  x: 0,
                  y: 0,
                  textShadow: `${echo(color, 0, 0)}, ${echo(pair, 0, 0)}`,
                  duration: LETTER_SETTLE,
                  ease: "power2.out",
                },
                at + FRAMES * FRAME,
              );
            });

            // 3 — the wave reaches the ring
            reach = start + letters.length * LETTER_EVERY;
            next
              .to(ring, { stroke: color, duration: 0.08, ease: "none" }, reach)
              .to(core, { scale: 1.25, duration: 0.08, ease: "power2.out" }, reach)
              .to(core, { scale: 1, duration: 0.12, ease: "power2.in" }, reach + 0.08)
              .fromTo(
                ripples[wave],
                { scale: 1, svgOrigin: "30 34" },
                {
                  scale: RIPPLE_SCALE,
                  duration: RIPPLE_LENGTH,
                  ease: "power1.out",
                  immediateRender: false,
                },
                reach,
              )
              .fromTo(
                ripples[wave],
                { opacity: 0.95 },
                {
                  opacity: 0,
                  duration: RIPPLE_LENGTH,
                  ease: "power1.out",
                  immediateRender: false,
                },
                reach,
              );
          });

          // 4 — the settle
          const settle = reach + RING_HOLD;
          next
            .to(ring, { stroke: "#e8d9b5", duration: RING_SETTLE, ease: "power1.inOut" }, settle)
            .to(flag, { scale: 1, duration: 0.45, ease: "back.out(2.2)" }, settle + 0.2);

          return next;
        };

        // Not contextSafe, as in LogoMotion: the timeline is killed by hand in
        // the cleanup below.
        const play = () => {
          if (!tl) tl = build();
        };

        const start = gsap.delayedCall(0.35, play);
        const targets = [word, mark];
        targets.forEach((target) => {
          target.addEventListener("pointerenter", play);
          target.addEventListener("pointerdown", play);
        });
        return () => {
          start.kill();
          targets.forEach((target) => {
            target.removeEventListener("pointerenter", play);
            target.removeEventListener("pointerdown", play);
          });
          tl?.kill();
          tl = null;
          rest();
        };
      });
    },
    { scope },
  );

  return (
    <div ref={scope} className="flex items-center gap-4">
      <span data-wordmark-mark className="shrink-0 [&>svg]:size-12 sm:[&>svg]:size-16">
        <Logo size={64} rippleRadius={LOGO_RING_RADIUS} />
      </span>
      <h1
        aria-label={WORD}
        className="text-[clamp(2.75rem,10vw,6rem)] font-extrabold leading-[0.9] tracking-[-0.035em]"
      >
        <span data-wordmark-word dir="ltr" aria-hidden="true" className="inline-block whitespace-nowrap">
          {Array.from(WORD).map((letter, i) => (
            <span key={i} data-wordmark-letter className="inline-block">
              {letter}
            </span>
          ))}
        </span>
      </h1>
    </div>
  );
}
