"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { MessageCircle, Send, CheckCircle2 } from "lucide-react";
import { gsap, registerGsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { Button } from "@/components/ui/Button";
import { CTA_BACKGROUND } from "@/lib/images";
import { CONTACT_EMAIL, WHATSAPP_URL } from "@/lib/config";
import { smoothScrollTo } from "@/lib/lenis-store";

export default function CtaScene() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    registerGsap();
    if (reducedMotion || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        imageRef.current,
        { yPercent: -8, scale: 1.15 },
        {
          yPercent: 8,
          scale: 1.05,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.8,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-bg-dark px-6 py-32 md:px-14 lg:px-20"
    >
      <div className="absolute inset-0">
        <div ref={imageRef} className="absolute inset-0">
          <Image
            src={CTA_BACKGROUND.src}
            alt={CTA_BACKGROUND.alt}
            fill
            sizes="100vw"
            className="object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-bg-dark via-bg-dark/75 to-bg-dark" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <p className="label-caps mb-6 text-solar">Vamos começar</p>
        <h2 className="font-display text-display-xl text-balance text-text-light">
          O próximo
          <br />
          passo é seu.
        </h2>
        <p className="mx-auto mt-8 max-w-lg text-balance text-base text-text-light/75 sm:text-lg">
          Descubra como a energia solar pode transformar seu consumo.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button variant="solid" onClick={() => smoothScrollTo("#formulario")}>
            Solicitar análise gratuita
          </Button>
          <Button
            as="a"
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            variant="outline"
            icon={false}
          >
            <MessageCircle className="size-4" aria-hidden="true" />
            Conversar no WhatsApp
          </Button>
        </div>
      </div>

      <div id="formulario" className="relative z-10 mx-auto mt-28 max-w-xl scroll-mt-28">
        <ContactForm />
      </div>
    </section>
  );
}

function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const subject = encodeURIComponent("Solicitação de análise gratuita — energia solar");
    const body = encodeURIComponent(
      `Nome: ${name}\nE-mail: ${email}\nTelefone/WhatsApp: ${phone}\nCidade: ${city}\n\nGostaria de solicitar uma análise gratuita para energia solar.`
    );

    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
    setSent(true);
  };

  return (
    <div className="rounded-3xl border border-line-strong bg-bg-dark-raised/80 p-8 sm:p-10">
      <h3 className="font-display text-2xl text-text-light">
        Solicite sua análise gratuita
      </h3>
      <p className="mt-2 text-sm text-text-light/60">
        Preencha os dados abaixo. Um especialista entrará em contato para
        entender seu consumo e apresentar uma proposta personalizada.
      </p>

      {sent ? (
        <div className="mt-8 flex items-start gap-3 rounded-xl border border-green-soft/30 bg-green/10 p-5 text-sm text-text-light/80">
          <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-green-soft" aria-hidden="true" />
          <p>
            Obrigado! Abrimos seu aplicativo de e-mail com a solicitação
            pronta para envio. Se preferir, fale com a gente agora pelo
            WhatsApp.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              id="name"
              label="Nome completo"
              value={name}
              onChange={setName}
              required
              autoComplete="name"
            />
            <Field
              id="email"
              label="E-mail"
              type="email"
              value={email}
              onChange={setEmail}
              required
              autoComplete="email"
            />
            <Field
              id="phone"
              label="Telefone / WhatsApp"
              type="tel"
              value={phone}
              onChange={setPhone}
              required
              autoComplete="tel"
            />
            <Field
              id="city"
              label="Cidade"
              value={city}
              onChange={setCity}
              required
              autoComplete="address-level2"
            />
          </div>

          <Button type="submit" variant="solid" className="w-full justify-center" icon={false}>
            <Send className="size-4" aria-hidden="true" />
            Enviar solicitação
          </Button>
        </form>
      )}
    </div>
  );
}

function Field({
  id,
  label,
  type = "text",
  value,
  onChange,
  required,
  autoComplete,
}: {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  autoComplete?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-xs font-medium text-text-light/60">
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        required={required}
        autoComplete={autoComplete}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-line-strong bg-bg-dark px-4 py-3 text-sm text-text-light outline-none transition-colors focus:border-solar"
      />
    </div>
  );
}
