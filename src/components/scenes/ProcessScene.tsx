"use client";

import { useEffect, useRef } from "react";
import { SearchCheck, Compass, HardHat, LifeBuoy } from "lucide-react";
import { gsap, registerGsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";

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
  const sectionRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    registerGsap();
    if (!sectionRef.current) return;

    if (reducedMotion) {
      gsap.set(stepRefs.current, { opacity: 1, y: 0 });
      gsap.set(lineRef.current, { scaleY: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        lineRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          transformOrigin: "top",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 65%",
            end: "bottom 70%",
            scrub: 0.6,
          },
        }
      );

      stepRefs.current.forEach((step) => {
        gsap.fromTo(
          step,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
              trigger: step,
              start: "top 82%",
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      id="tecnologia"
      ref={sectionRef}
      className="relative overflow-hidden bg-bg-dark px-6 py-28 md:px-14 lg:px-20"
    >
      <div className="mx-auto max-w-3xl text-center">
        <p className="label-caps mb-4 text-solar">Como funciona</p>
        <h2 className="font-display text-display-md text-balance text-text-light">
          Tecnologia que transforma luz em resultado.
        </h2>
      </div>

      <div className="relative mx-auto mt-24 max-w-2xl">
        <div className="absolute left-6 top-2 bottom-2 w-px bg-line sm:left-7">
          <div
            ref={lineRef}
            className="h-full w-full origin-top bg-gradient-to-b from-solar to-green-soft"
            style={{ transform: "scaleY(0)" }}
          />
        </div>

        <div className="space-y-16">
          {STEPS.map((step, i) => (
            <div
              key={step.number}
              ref={(el) => {
                stepRefs.current[i] = el;
              }}
              className="relative flex gap-6 pl-0 sm:gap-8"
            >
              <span className="relative z-10 flex size-12 shrink-0 items-center justify-center rounded-full border border-solar/30 bg-bg-dark text-solar sm:size-14">
                <step.icon className="size-5 sm:size-6" aria-hidden="true" />
              </span>
              <div className="pt-1">
                <p className="label-caps mb-1 text-text-light/40">
                  Etapa {step.number}
                </p>
                <h3 className="font-display text-xl text-text-light sm:text-2xl">
                  {step.title}
                </h3>
                <p className="mt-2 max-w-md text-sm text-text-light/65 sm:text-base">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
