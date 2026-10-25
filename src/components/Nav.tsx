"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { WHATSAPP_URL } from "@/lib/config";
import { smoothScrollTo, setScrollLocked } from "@/lib/lenis-store";

const LINKS = [
  { href: "#energia", label: "A energia" },
  { href: "#economia", label: "Economia" },
  { href: "#projetos", label: "Projetos" },
  { href: "#tecnologia", label: "Tecnologia" },
  { href: "#contato", label: "Contato" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setScrollLocked(open);
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      setScrollLocked(false);
    };
  }, [open]);

  useEffect(() => {
    // Leaving the mobile layout (rotation / resize) must never leave the menu open.
    const mq = window.matchMedia("(min-width: 1024px)");
    const onChange = (event: MediaQueryListEvent) => {
      if (event.matches) setOpen(false);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const go = (event: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    event.preventDefault();
    setOpen(false);
    // Let the scroll lock release before Lenis starts the scroll animation.
    requestAnimationFrame(() => smoothScrollTo(href));
  };

  return (
    <>
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
        scrolled || open ? "bg-bg-dark/85 backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <nav
        className="mx-auto flex max-w-[1600px] items-center justify-between px-6 py-4 md:px-10 lg:py-5"
        aria-label="Navegação principal"
      >
        <a
          href="#topo"
          onClick={(event) => go(event, "#topo")}
          className="font-display text-xl font-medium tracking-tight text-text-light"
          data-cursor="hover"
        >
          Hélio<span className="text-solar">.</span>
        </a>

        <ul className="hidden items-center gap-9 lg:flex">
          {LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={(event) => go(event, link.href)}
                className="label-caps text-text-light/70 transition-colors hover:text-solar"
                data-cursor="hover"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden lg:block">
          <Button
            as="a"
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            variant="outline"
            className="min-h-0 px-5 py-3 text-xs"
          >
            Falar no WhatsApp
          </Button>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="inline-flex size-11 items-center justify-center rounded-full border border-line-strong text-text-light lg:hidden"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          aria-expanded={open}
          aria-controls="menu-mobile"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </nav>

    </header>

      {open && (
        <div
          id="menu-mobile"
          className="fixed inset-0 z-40 pt-[4.25rem] flex flex-col overflow-y-auto bg-bg-dark px-6 pb-[max(2rem,env(safe-area-inset-bottom))] lg:hidden"
        >
          <ul className="flex flex-1 flex-col justify-center gap-1">
            {LINKS.map((link, i) => (
              <li key={link.href} className="border-b border-line">
                <a
                  href={link.href}
                  onClick={(event) => go(event, link.href)}
                  className="flex items-baseline gap-4 py-5 font-display text-3xl text-text-light"
                >
                  <span className="label-caps w-6 text-text-light/35">0{i + 1}</span>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <Button
            as="a"
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            variant="solid"
            className="mt-8 w-full justify-center"
          >
            Falar no WhatsApp
          </Button>
        </div>
      )}
    </>
  );
}
