"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Info } from "lucide-react";
import { gsap, registerGsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import RangeSlider from "@/components/ui/RangeSlider";
import AnimatedNumber from "@/components/ui/AnimatedNumber";
import { Button } from "@/components/ui/Button";
import { smoothScrollTo } from "@/lib/lenis-store";

const currencyFormat = (value: number) =>
  `R$ ${Math.round(value).toLocaleString("pt-BR")}`;

export default function SavingsScene() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const revealRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  const [bill, setBill] = useState(450);
  const [savingsPercent, setSavingsPercent] = useState(80);

  const { monthlySavings, annualSavings, newBill, newBillPercent } = useMemo(() => {
    const savings = bill * (savingsPercent / 100);
    const updatedBill = bill - savings;
    return {
      monthlySavings: savings,
      annualSavings: savings * 12,
      newBill: updatedBill,
      newBillPercent: Math.max(4, (updatedBill / bill) * 100),
    };
  }, [bill, savingsPercent]);

  useEffect(() => {
    registerGsap();
    if (reducedMotion || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        revealRef.current,
        { opacity: 0, y: 48 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      id="economia"
      ref={sectionRef}
      className="relative -mt-px rounded-t-[1.75rem] bg-bg-light px-5 py-20 text-text-dark sm:px-10 sm:py-24 lg:rounded-t-[3rem] lg:px-20 lg:py-32"
    >
      <div
        ref={revealRef}
        className="mx-auto max-w-6xl"
      >
        <div className="mx-auto max-w-2xl text-center">
          <p className="label-caps mb-4 text-solar-deep">Simulador de economia</p>
          <h2 className="font-display text-balance" style={{ fontSize: "clamp(2rem, 4.6vw, 4rem)", lineHeight: 1.05, letterSpacing: "-0.025em" }}>
            Sua conta de luz pode contar outra história.
          </h2>
        </div>

        <div className="mt-12 grid gap-6 sm:mt-16 sm:gap-8 lg:grid-cols-2 lg:gap-10">
          <div className="space-y-9 rounded-3xl border border-text-dark/10 bg-white/50 p-6 sm:p-10">
            <RangeSlider
              id="bill-slider"
              label="Valor aproximado da sua conta de luz mensal"
              min={100}
              max={2000}
              step={50}
              value={bill}
              onChange={setBill}
              valueLabel={currencyFormat(bill)}
            />
            <RangeSlider
              id="savings-slider"
              label="Economia estimada sobre a conta (ajustável)"
              min={60}
              max={90}
              step={5}
              value={savingsPercent}
              onChange={setSavingsPercent}
              valueLabel={`${savingsPercent}%`}
            />

            <div className="flex items-start gap-3 rounded-xl bg-text-dark/5 p-4 text-xs leading-relaxed text-text-dark/65">
              <Info className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              <p>
                Valores meramente ilustrativos, calculados a partir do
                percentual de economia informado acima. A economia real
                depende do seu consumo, localização, dimensionamento do
                sistema, tarifas vigentes e das regras locais de compensação
                de energia elétrica.
              </p>
            </div>
          </div>

          <div className="flex flex-col justify-between rounded-3xl bg-text-dark p-6 text-text-light sm:p-10">
            <div>
              <div className="mb-8 space-y-3">
                <BarRow label="Sem energia solar" percent={100} value={bill} tone="muted" />
                <BarRow
                  label="Com energia solar"
                  percent={newBillPercent}
                  value={newBill}
                  tone="solar"
                />
              </div>

              <div className="grid grid-cols-2 gap-6 border-t border-line pt-8">
                <div>
                  <p className="label-caps text-text-light/50">Economia mensal</p>
                  <p className="font-display mt-2 whitespace-nowrap text-[1.75rem] text-solar sm:text-4xl">
                    R${" "}
                    <AnimatedNumber value={monthlySavings} />
                  </p>
                </div>
                <div>
                  <p className="label-caps text-text-light/50">Economia em 12 meses</p>
                  <p className="font-display mt-2 whitespace-nowrap text-[1.75rem] text-solar sm:text-4xl">
                    R${" "}
                    <AnimatedNumber value={annualSavings} />
                  </p>
                </div>
              </div>
            </div>

            <Button
              variant="solid"
              className="mt-10 w-full justify-center"
              onClick={() => smoothScrollTo("#contato")}
            >
              Solicitar análise gratuita
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

function BarRow({
  label,
  percent,
  value,
  tone,
}: {
  label: string;
  percent: number;
  value: number;
  tone: "muted" | "solar";
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-xs text-text-light/60">
        <span>{label}</span>
        <span className="tabular-nums">{currencyFormat(value)}</span>
      </div>
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/10">
        <div
          className={`h-full rounded-full transition-[width] duration-700 ease-out ${
            tone === "solar" ? "bg-solar" : "bg-text-light/35"
          }`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
