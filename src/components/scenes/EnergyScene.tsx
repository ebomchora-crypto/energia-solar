"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";
import { gsap, registerGsap, DESKTOP_MQ, MOBILE_MQ } from "@/lib/gsap";
import { useIsDesktop } from "@/hooks/useIsDesktop";
import { useInView } from "@/hooks/useInView";
import { panelsProgress } from "@/lib/scroll-stores";
import PanelsStatic from "@/components/canvas/PanelsStatic";

const PanelsCanvas = dynamic(() => import("@/components/canvas/PanelsCanvas"), {
  ssr: false,
});

const MOTION_OK = "(prefers-reduced-motion: no-preference)";
const MOTION_REDUCED = "(prefers-reduced-motion: reduce)";

export default function EnergyScene() {
  const sectionRef = useRef<HTMLElement>(null);
  const warmRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLParagraphElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const captionRef = useRef<HTMLParagraphElement>(null);
  const isDesktop = useIsDesktop();
  const { ref: canvasWrapRef, inView } = useInView<HTMLDivElement>("300px");

  useEffect(() => {
    registerGsap();
    const section = sectionRef.current;
    if (!section) return;

    const mm = gsap.matchMedia();
    const q = gsap.utils.selector(section);
    const copy = [labelRef.current, headlineRef.current, captionRef.current];

    // Desktop: pinned WebGL sequence, copy fades in and out around the camera move.
    mm.add(`${DESKTOP_MQ} and ${MOTION_OK}`, () => {
      gsap
        .timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "+=160%",
            scrub: 1,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              panelsProgress.value = self.progress;
            },
          },
        })
        .to(warmRef.current, { opacity: 0, ease: "power1.out", duration: 0.2 }, 0)
        .fromTo(labelRef.current, { opacity: 0, y: 24 }, { opacity: 1, y: 0, ease: "power2.out", duration: 0.16 }, 0.1)
        .fromTo(headlineRef.current, { opacity: 0, y: 40 }, { opacity: 1, y: 0, ease: "power2.out", duration: 0.22 }, 0.15)
        .fromTo(captionRef.current, { opacity: 0, y: 24 }, { opacity: 1, y: 0, ease: "power2.out", duration: 0.18 }, 0.25)
        .to(copy, { opacity: 0, y: -30, ease: "power2.in", duration: 0.2 }, 0.8);

      return () => {
        panelsProgress.value = 0;
      };
    });

    // Mobile: CSS-perspective panel field settling into alignment, SVG energy
    // lines drawing in; copy stays readable for the whole sequence.
    mm.add(`${MOBILE_MQ} and ${MOTION_OK}`, () => {
      const panels = q(".ps-panel");
      panels.forEach((el) => {
        gsap.set(el, {
          x: gsap.utils.random(-14, 14),
          y: gsap.utils.random(-22, 4),
          rotate: gsap.utils.random(-9, 9),
          opacity: 0.35,
        });
      });

      gsap
        .timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "+=95%",
            scrub: 0.8,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        })
        .to(warmRef.current, { opacity: 0, ease: "power1.out", duration: 0.25 }, 0)
        .to(q(".ps-grid"), { rotateX: 40, rotateZ: -1, scale: 1.02, duration: 1 }, 0)
        .to(panels, { x: 0, y: 0, rotate: 0, opacity: 1, ease: "power2.out", duration: 0.55, stagger: 0.015 }, 0.05)
        .to(q(".ps-gloss"), { x: "240%", duration: 0.6 }, 0.35)
        .to(q(".ps-line"), { strokeDashoffset: 0, duration: 0.4, stagger: 0.05 }, 0.55)
        .fromTo(copy, { opacity: 0, y: 22 }, { opacity: 1, y: 0, ease: "power2.out", duration: 0.25, stagger: 0.06 }, 0.12);
    });

    // Reduced motion: settled, static composition.
    mm.add(MOTION_REDUCED, () => {
      panelsProgress.value = 0.85;
      gsap.set(warmRef.current, { opacity: 0 });
      gsap.set(copy, { opacity: 1, y: 0 });
      return () => {
        panelsProgress.value = 0;
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      id="energia"
      ref={sectionRef}
      className="relative h-svh min-h-[34rem] w-full overflow-hidden bg-bg-dark"
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, #0c1210 0%, #101514 45%, #0a0e0c 100%)",
        }}
      />

      {isDesktop ? (
        <div ref={canvasWrapRef} className="absolute inset-0">
          <PanelsCanvas active={inView} />
        </div>
      ) : (
        <PanelsStatic />
      )}

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-bg-dark via-bg-dark/60 to-transparent lg:h-1/2" />

      <div
        ref={warmRef}
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 130% 100% at 50% 50%, #fff4d6 0%, #f6cf5d 38%, #e9ab3b 100%)",
        }}
      />

      <div className="relative z-10 mx-auto flex h-full w-full max-w-[1600px] flex-col items-center justify-end px-6 pb-14 text-center sm:pb-24 lg:items-start lg:px-20 lg:pb-20 lg:text-left">
        <p ref={labelRef} className="label-caps mb-4 text-solar sm:mb-5">
          Da luz à energia
        </p>
        <h2
          ref={headlineRef}
          className="font-display max-w-3xl text-balance text-text-light"
          style={{
            fontSize: "clamp(2.1rem, 7.2vw, 6rem)",
            lineHeight: 1,
            letterSpacing: "-0.035em",
          }}
        >
          Cada raio.
          <br />
          Uma nova possibilidade.
        </h2>
        <p
          ref={captionRef}
          className="mt-5 max-w-md text-balance lg:max-w-sm text-[0.9rem] leading-relaxed text-text-light/75 sm:mt-6 sm:text-base"
        >
          Painéis fotovoltaicos de alta eficiência captam a luz solar e a
          convertem em energia limpa, pronta para abastecer sua casa.
        </p>
      </div>
    </section>
  );
}
