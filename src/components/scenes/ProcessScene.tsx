"use client";

import { useEffect, useRef } from "react";
import { SearchCheck, Compass, HardHat, LifeBuoy } from "lucide-react";
import { gsap, registerGsap } from "@/lib/gsap";

const MOTION_OK = "(prefers-reduced-motion: no-preference)";

const STEPS = [
  {
    icon: SearchCheck,
    number: "01",
    title: "Análise de consumo",
    description:
      "Avaliamos seu histórico de consumo e perfil de uso para dimensionar a solução ideal.",
  },
  {
    icon: Compass,
    number: "02",
    title: "Projeto personalizado",
    description:
      "Desenvolvemos um projeto técnico sob medida, considerando estrutura, orientação e geração.",
  },
  {
    icon: HardHat,
    number: "03",
    title: "Instalação especializada",
    description:
      "Equipe técnica qualificada realiza a instalação com segurança e precisão.",
  },
  {
    icon: LifeBuoy,
    number: "04",
    title: "Acompanhamento e suporte",
    description:
      "Monitoramento de geração e suporte contínuo após a ativação do sistema.",
  },
];

export default function ProcessScene() {
  const sectionRef = useRef<HTMLElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    registerGsap();
    const timeline = timelineRef.current;
    if (!timeline) return;
    const steps = stepRefs.current.filter(Boolean) as HTMLDivElement[];

    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      // The connecting line fills as the timeline crosses the viewport centre.
      gsap.fromTo(
        lineRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          transformOrigin: "top",
          scrollTrigger: {
            trigger: timeline,
            start: "top 60%",
            end: "bottom 65%",
            scrub: 0.5,
          },
        }
      );

      steps.forEach((step) => {
        gsap.fromTo(
          step,
          { opacity: 0, y: 36 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: { trigger: step, start: "top 90%", once: true },
          }
        );
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      id="tecnologia"
      ref={sectionRef}
      className="relative bg-bg-dark px-6 py-24 sm:px-10 lg:px-20 lg:py-36"
    >
      <div className="mx-auto grid max-w-[1400px] gap-14 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-36">
            <p className="label-caps mb-4 text-solar">Como funciona</p>
            <h2
              className="font-display text-balance text-text-light"
              style={{
                fontSize: "clamp(2rem, 4.4vw, 4rem)",
                lineHeight: 1.05,
                letterSpacing: "-0.025em",
              }}
            >
              Tecnologia que transforma luz em resultado.
            </h2>
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-text-light/60 sm:text-base">
              Do primeiro diagnóstico ao acompanhamento da geração, cada etapa
              é conectada à anterior.
            </p>
          </div>
        </div>

        <div ref={timelineRef} className="relative lg:col-span-6 lg:col-start-7">
          <div className="absolute bottom-2 left-6 top-2 w-px bg-line sm:left-7" aria-hidden="true">
            <div
              ref={lineRef}
              className="h-full w-full origin-top bg-gradient-to-b from-solar to-green-soft"
            />
          </div>

          <div className="space-y-14 lg:space-y-20">
            {STEPS.map((step, i) => (
              <div
                key={step.number}
                ref={(el) => {
                  stepRefs.current[i] = el;
                }}
                className="relative flex gap-5 sm:gap-8"
              >
                <span className="relative z-10 flex size-12 shrink-0 items-center justify-center rounded-full border border-solar/30 bg-bg-dark text-solar sm:size-14">
                  <step.icon className="size-5 sm:size-6" aria-hidden="true" />
                </span>
                <div className="pt-1">
                  <p className="label-caps mb-1 text-text-light/40">Etapa {step.number}</p>
                  <h3 className="font-display text-xl text-text-light sm:text-2xl lg:text-3xl">
                    {step.title}
                  </h3>
                  <p className="mt-2 max-w-md text-sm leading-relaxed text-text-light/65 sm:text-base">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
