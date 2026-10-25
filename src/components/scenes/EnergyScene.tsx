"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";
import { gsap, registerGsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useIsDesktop } from "@/hooks/useIsDesktop";
import { panelsProgress } from "@/lib/scroll-stores";
import PanelsStatic from "@/components/canvas/PanelsStatic";

const PanelsCanvas = dynamic(() => import("@/components/canvas/PanelsCanvas"), {
  ssr: false,
});

export default function EnergyScene() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLParagraphElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const captionRef = useRef<HTMLParagraphElement>(null);
  const reducedMotion = useReducedMotion();
  const isDesktop = useIsDesktop();

  useEffect(() => {
    registerGsap();
    if (reducedMotion) {
      panelsProgress.value = 0.85;
      return;
    }
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=160%",
          scrub: 1,
          pin: true,
          onUpdate: (self) => {
            panelsProgress.value = self.progress;
          },
        },
      })
        .fromTo(
          labelRef.current,
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, ease: "power2.out", duration: 0.16 },
          0.04
        )
        .fromTo(
          headlineRef.current,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, ease: "power2.out", duration: 0.22 },
          0.1
        )
        .fromTo(
          captionRef.current,
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, ease: "power2.out", duration: 0.18 },
          0.2
        )
        .to(
          [labelRef.current, headlineRef.current, captionRef.current],
          { opacity: 0, y: -30, ease: "power2.in", duration: 0.22 },
          0.76
        );
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      id="energia"
      ref={sectionRef}
      className="relative h-screen w-full overflow-hidden bg-bg-dark"
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, #0c1210 0%, #101514 45%, #0a0e0c 100%)",
        }}
      />

      {isDesktop ? <PanelsCanvas /> : <PanelsStatic />}

      <div className="relative z-10 flex h-full flex-col items-center justify-end px-6 pb-20 text-center sm:pb-28">
        <p ref={labelRef} className="label-caps mb-5 text-solar">
          Da luz à energia
        </p>
        <h2
          ref={headlineRef}
          className="font-display text-display-lg max-w-3xl text-balance text-text-light"
        >
          Cada raio.
          <br />
          Uma nova possibilidade.
        </h2>
        <p
          ref={captionRef}
          className="mt-6 max-w-md text-balance text-sm text-text-light/70 sm:text-base"
        >
          Painéis fotovoltaicos de alta eficiência captam a luz solar e a
          convertem em energia limpa, pronta para abastecer sua casa.
        </p>
      </div>
    </section>
  );
}
