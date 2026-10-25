"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { Sun, Zap, Home, Wallet, CalendarClock, TrendingUp, Leaf } from "lucide-react";
import { gsap, registerGsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { HOUSE_HERO } from "@/lib/images";

const BENEFITS = [
  {
    icon: Wallet,
    title: "Economia na conta de energia",
    description: "Reduza o valor da sua fatura de luz todos os meses.",
  },
  {
    icon: CalendarClock,
    title: "Maior previsibilidade dos custos",
    description: "Menos exposição às variações e bandeiras tarifárias.",
  },
  {
    icon: TrendingUp,
    title: "Valorização do imóvel",
    description: "Um sistema fotovoltaico agrega valor ao seu patrimônio.",
  },
  {
    icon: Leaf,
    title: "Energia limpa e renovável",
    description: "Reduza sua pegada de carbono gerando sua própria energia.",
  },
];

export default function HouseScene() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const dimRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const schematicRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    registerGsap();
    if (!sectionRef.current) return;

    if (reducedMotion) {
      gsap.set(
        [introRef.current, cardRef.current, schematicRef.current, ...itemRefs.current],
        { opacity: 1, y: 0, x: 0 }
      );
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=200%",
          scrub: 1,
          pin: true,
        },
      });

      tl.fromTo(
        imageRef.current,
        { scale: 1.05 },
        { scale: 1.26, ease: "none", duration: 1 },
        0
      )
        .fromTo(
          introRef.current,
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, ease: "power2.out", duration: 0.14 },
          0.02
        )
        .to(introRef.current, { opacity: 0, y: -24, ease: "power2.in", duration: 0.14 }, 0.28)
        .fromTo(
          dimRef.current,
          { opacity: 0 },
          { opacity: 0.6, ease: "power1.inOut", duration: 0.3 },
          0.3
        )
        .fromTo(
          cardRef.current,
          { opacity: 0, y: 36 },
          { opacity: 1, y: 0, ease: "power2.out", duration: 0.16 },
          0.22
        )
        .fromTo(
          schematicRef.current,
          { opacity: 0 },
          { opacity: 1, ease: "power1.out", duration: 0.12 },
          0.3
        );

      itemRefs.current.forEach((item, i) => {
        tl.fromTo(
          item,
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, ease: "power2.out", duration: 0.12 },
          0.4 + i * 0.1
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      id="transformacao"
      ref={sectionRef}
      className="relative h-screen w-full overflow-hidden bg-bg-dark"
    >
      <div ref={imageRef} className="absolute inset-0">
        <Image
          src={HOUSE_HERO.src}
          alt={HOUSE_HERO.alt}
          fill
          priority={false}
          sizes="100vw"
          className="object-cover"
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-bg-dark via-bg-dark/30 to-bg-dark/60" />
      <div ref={dimRef} className="absolute inset-0 bg-bg-dark opacity-0" />

      <div className="relative z-10 flex h-full flex-col justify-between px-6 py-28 md:px-14 lg:px-20">
        <div ref={introRef} className="max-w-xl">
          <p className="label-caps mb-4 text-solar">A transformação</p>
          <h2 className="font-display text-display-md text-balance text-text-light">
            Da claridade do dia à energia que move sua casa.
          </h2>
        </div>

        <div
          ref={cardRef}
          className="ml-auto w-full max-w-md rounded-2xl border border-line-strong bg-bg-dark/85 p-7 sm:p-9"
        >
          <div ref={schematicRef} className="mb-8 flex items-center justify-between">
            <SchematicIcon icon={Sun} label="Sol" />
            <FlowLine />
            <SchematicIcon icon={Zap} label="Painéis" />
            <FlowLine />
            <SchematicIcon icon={Home} label="Casa" />
          </div>

          <ul className="space-y-5">
            {BENEFITS.map((benefit, i) => (
              <li
                key={benefit.title}
                ref={(el) => {
                  itemRefs.current[i] = el;
                }}
                className="flex items-start gap-4"
              >
                <span className="mt-0.5 inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-green-soft/40 bg-green/15 text-green-soft">
                  <benefit.icon className="size-4" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-sm font-medium text-text-light">{benefit.title}</p>
                  <p className="mt-0.5 text-sm text-text-light/60">{benefit.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function SchematicIcon({
  icon: Icon,
  label,
}: {
  icon: typeof Sun;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center gap-2">
      <span className="inline-flex size-11 items-center justify-center rounded-full border border-solar/30 bg-solar/10 text-solar">
        <Icon className="size-5" aria-hidden="true" />
      </span>
      <span className="label-caps text-[10px] text-text-light/50">{label}</span>
    </div>
  );
}

function FlowLine() {
  return (
    <div className="relative mx-2 h-px flex-1 overflow-hidden bg-line-strong">
      <div
        className="absolute inset-y-0 w-1/3"
        style={{
          background:
            "linear-gradient(90deg, transparent, #f4c542, transparent)",
          animation: "flow-move 2.2s linear infinite",
        }}
      />
      <style>{`
        @keyframes flow-move {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(300%); }
        }
      `}</style>
    </div>
  );
}
