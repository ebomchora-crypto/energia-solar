"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";
import { gsap, registerGsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { heroProgress } from "@/lib/scroll-stores";

const HeroCanvas = dynamic(() => import("@/components/canvas/HeroCanvas"), {
  ssr: false,
});

export default function HeroScene() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const labelRef = useRef<HTMLParagraphElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    registerGsap();
    if (reducedMotion) return;
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=140%",
          scrub: 1,
          pin: true,
          onUpdate: (self) => {
            heroProgress.value = self.progress;
          },
        },
      })
        .to(labelRef.current, { opacity: 0, yPercent: -30, ease: "power2.in" }, 0)
        .to(
          headlineRef.current,
          { yPercent: -45, opacity: 0, filter: "blur(10px)", ease: "power2.in" },
          0.1
        )
        .to(subRef.current, { yPercent: -25, opacity: 0, ease: "power2.in" }, 0.02)
        .to(indicatorRef.current, { opacity: 0, duration: 0.2 }, 0)
        .to(overlayRef.current, { opacity: 1, ease: "power1.inOut" }, 0.5);
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      id="topo"
      ref={sectionRef}
      className="relative h-screen w-full overflow-hidden bg-bg-dark"
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 48%, rgba(244,197,66,0.14) 0%, rgba(16,21,20,0) 60%), #101514",
        }}
      />

      <HeroCanvas />

      <div
        ref={overlayRef}
        className="pointer-events-none absolute inset-0 opacity-0"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, #fff4d6 0%, #f4c542 42%, #101514 100%)",
        }}
      />

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        <p
          ref={labelRef}
          className="label-caps mb-6 text-text-light/70"
        >
          Hélio Energia Solar
        </p>
        <h1
          ref={headlineRef}
          className="font-display text-display-xl max-w-5xl text-balance text-text-light"
        >
          O futuro começa
          <br />
          com a luz.
        </h1>
        <p
          ref={subRef}
          className="mt-8 max-w-xl text-balance text-base text-text-light/75 sm:text-lg"
        >
          Transformamos a energia do sol em economia, independência e um
          amanhã mais sustentável.
        </p>
      </div>

      <div
        ref={indicatorRef}
        className="absolute inset-x-0 bottom-10 z-10 flex flex-col items-center gap-2 text-text-light/60"
      >
        <span className="label-caps">Role para explorar</span>
        <ChevronDown className="size-4 animate-bounce" aria-hidden="true" />
      </div>
    </section>
  );
}
