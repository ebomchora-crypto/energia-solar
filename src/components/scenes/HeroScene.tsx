"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";
import { gsap, registerGsap, DESKTOP_MQ, MOBILE_MQ } from "@/lib/gsap";
import { heroProgress } from "@/lib/scroll-stores";
import { useInView } from "@/hooks/useInView";

const HeroCanvas = dynamic(() => import("@/components/canvas/HeroCanvas"), {
  ssr: false,
});

const MOTION_OK = "(prefers-reduced-motion: no-preference)";

export default function HeroScene() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const labelRef = useRef<HTMLParagraphElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const { ref: canvasWrapRef, inView } = useInView<HTMLDivElement>("300px");

  useEffect(() => {
    registerGsap();
    const section = sectionRef.current;
    if (!section) return;

    const mm = gsap.matchMedia();

    const build = (endPercent: number) => {
      gsap
        .timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: `+=${endPercent}%`,
            scrub: 1,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              heroProgress.value = self.progress;
            },
          },
        })
        .to(labelRef.current, { opacity: 0, yPercent: -30, ease: "power2.in", duration: 0.3 }, 0)
        .to(subRef.current, { yPercent: -25, opacity: 0, ease: "power2.in", duration: 0.4 }, 0.02)
        .to(
          headlineRef.current,
          { yPercent: -45, opacity: 0, ease: "power2.in", duration: 0.5 },
          0.08
        )
        .to(indicatorRef.current, { opacity: 0, duration: 0.2 }, 0)
        .to(overlayRef.current, { opacity: 1, ease: "power1.inOut", duration: 0.5 }, 0.5);

      return () => {
        heroProgress.value = 0;
      };
    };

    mm.add(`${DESKTOP_MQ} and ${MOTION_OK}`, () => build(140));
    mm.add(`${MOBILE_MQ} and ${MOTION_OK}`, () => build(100));

    return () => mm.revert();
  }, []);

  return (
    <section
      id="topo"
      ref={sectionRef}
      className="relative h-svh min-h-[34rem] w-full overflow-hidden bg-bg-dark"
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 48%, rgba(244,197,66,0.14) 0%, rgba(16,21,20,0) 60%), #101514",
        }}
      />

      <div ref={canvasWrapRef} className="absolute inset-0">
        <HeroCanvas active={inView} />
      </div>

      <div
        ref={overlayRef}
        className="pointer-events-none absolute inset-0 opacity-0"
        style={{
          background:
            "radial-gradient(ellipse 130% 100% at 50% 50%, #fff4d6 0%, #f6cf5d 38%, #e9ab3b 100%)",
        }}
      />

      <div className="relative z-10 flex h-full flex-col items-center justify-end px-6 pb-28 text-center md:landscape:justify-center md:landscape:pb-0">
        <p ref={labelRef} className="label-caps mb-5 text-text-light/70 md:mb-6">
          Hélio Energia Solar
        </p>
        <h1
          ref={headlineRef}
          className="font-display max-w-5xl text-balance text-text-light"
          style={{
            fontSize: "clamp(2.6rem, 9.5vw, 9rem)",
            lineHeight: 0.98,
            letterSpacing: "-0.04em",
          }}
        >
          O futuro começa
          <br />
          com a luz.
        </h1>
        <p
          ref={subRef}
          className="mt-6 max-w-[22rem] text-balance text-[0.95rem] leading-relaxed text-text-light/80 sm:max-w-xl sm:text-lg md:mt-8"
        >
          Transformamos a energia do sol em economia, independência e um
          amanhã mais sustentável.
        </p>
      </div>

      <div
        ref={indicatorRef}
        className="absolute inset-x-0 bottom-8 z-10 flex flex-col items-center gap-2 text-text-light/60 md:bottom-10"
      >
        <span className="label-caps">Role para explorar</span>
        <ChevronDown className="size-4 animate-bounce" aria-hidden="true" />
      </div>
    </section>
  );
}
