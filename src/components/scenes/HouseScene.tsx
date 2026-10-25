"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { Sun, Zap, Home, Wallet, CalendarClock, TrendingUp, Leaf } from "lucide-react";
import { gsap, registerGsap, DESKTOP_MQ, MOBILE_MQ } from "@/lib/gsap";
import { HOUSE_HERO } from "@/lib/images";

const MOTION_OK = "(prefers-reduced-motion: no-preference)";

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
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const dimRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const schematicRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    registerGsap();
    const section = sectionRef.current;
    if (!section) return;
    const items = itemRefs.current.filter(Boolean) as HTMLLIElement[];
    const mm = gsap.matchMedia();

    // Desktop: pinned sequence — daylight house, then the infographic card.
    mm.add(`${DESKTOP_MQ} and ${MOTION_OK}`, () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=200%",
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      tl.fromTo(imageRef.current, { scale: 1.05 }, { scale: 1.26, ease: "none", duration: 1 }, 0)
        .fromTo(introRef.current, { opacity: 0, y: 24 }, { opacity: 1, y: 0, ease: "power2.out", duration: 0.14 }, 0.02)
        .to(introRef.current, { opacity: 0, y: -24, ease: "power2.in", duration: 0.14 }, 0.28)
        .fromTo(dimRef.current, { opacity: 0 }, { opacity: 0.6, ease: "power1.inOut", duration: 0.3 }, 0.3)
        .fromTo(cardRef.current, { opacity: 0, y: 36 }, { opacity: 1, y: 0, ease: "power2.out", duration: 0.16 }, 0.22)
        .fromTo(schematicRef.current, { opacity: 0 }, { opacity: 1, ease: "power1.out", duration: 0.12 }, 0.3);

      items.forEach((item, i) => {
        tl.fromTo(item, { opacity: 0, y: 18 }, { opacity: 1, y: 0, ease: "power2.out", duration: 0.12 }, 0.4 + i * 0.1);
      });
    });

    // Mobile: no pin. The photo drifts slowly while copy and benefits reveal
    // one at a time as they enter the viewport.
    mm.add(`${MOBILE_MQ} and ${MOTION_OK}`, () => {
      gsap.fromTo(
        imageRef.current,
        { scale: 1.04, yPercent: -3 },
        {
          scale: 1.16,
          yPercent: 4,
          ease: "none",
          scrollTrigger: { trigger: section, start: "top bottom", end: "bottom top", scrub: 0.6 },
        }
      );
      gsap.fromTo(
        introRef.current,
        { opacity: 0, y: 28 },
        { opacity: 1, y: 0, duration: 0.9, ease: "power3.out", scrollTrigger: { trigger: introRef.current, start: "top 88%", once: true } }
      );
      gsap.fromTo(
        [cardRef.current, schematicRef.current],
        { opacity: 0, y: 28 },
        { opacity: 1, y: 0, duration: 0.9, ease: "power3.out", stagger: 0.1, scrollTrigger: { trigger: cardRef.current, start: "top 90%", once: true } }
      );
      items.forEach((item) => {
        gsap.fromTo(
          item,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.7, ease: "power2.out", scrollTrigger: { trigger: item, start: "top 94%", once: true } }
        );
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      id="transformacao"
      ref={sectionRef}
      className="relative overflow-hidden bg-bg-dark lg:h-svh"
    >
      <div className="relative h-[66svh] min-h-[24rem] overflow-hidden lg:absolute lg:inset-0 lg:h-auto lg:min-h-0">
        <div ref={imageRef} className="absolute inset-0 will-change-transform">
          <Image
            src={HOUSE_HERO.src}
            alt={HOUSE_HERO.alt}
            fill
            sizes="100vw"
            className="object-cover object-[50%_35%]"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-bg-dark via-bg-dark/25 to-bg-dark/55" />
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-bg-dark to-transparent" />
        <div className="absolute inset-0 hidden bg-gradient-to-r from-bg-dark/80 via-bg-dark/30 to-transparent lg:block" />
        <div ref={dimRef} className="absolute inset-0 bg-bg-dark opacity-0" />
      </div>

      <div className="relative z-10 -mt-32 px-6 pb-24 sm:px-10 lg:mt-0 lg:flex lg:h-full lg:flex-col lg:justify-between lg:px-20 lg:py-28">
        <div ref={introRef} className="max-w-xl">
          <p className="label-caps mb-4 text-solar">A transformação</p>
          <h2
            className="font-display text-balance text-text-light"
            style={{
              fontSize: "clamp(2rem, 4.4vw, 4rem)",
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
            }}
          >
            Da claridade do dia à energia que move sua casa.
          </h2>
        </div>

        <div
          ref={cardRef}
          className="mt-10 w-full max-w-md rounded-2xl border border-line-strong bg-bg-dark/90 p-6 sm:p-9 lg:ml-auto lg:mt-0"
        >
          <div ref={schematicRef} className="mb-8 flex items-center justify-between">
            <SchematicIcon icon={Sun} label="Sol" />
            <FlowLine />
            <SchematicIcon icon={Zap} label="Painéis" />
            <FlowLine />
            <SchematicIcon icon={Home} label="Casa" />
          </div>

          <ul className="space-y-6">
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
                  <p className="mt-0.5 text-sm leading-relaxed text-text-light/60">{benefit.description}</p>
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
    </div>
  );
}
