"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { WHATSAPP_URL } from "@/lib/config";
import { smoothScrollTo } from "@/lib/lenis-store";

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
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  const handleLinkClick = (event: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    event.preventDefault();
    setOpen(false);
    smoothScrollTo(href);
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
        scrolled ? "bg-bg-dark/80 backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <nav
        className="mx-auto flex max-w-[1600px] items-center justify-between px-6 py-5 md:px-10"
        aria-label="Navegação principal"
      >
        <a
          href="#topo"
          onClick={(event) => handleLinkClick(event, "#topo")}
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
                onClick={(event) => handleLinkClick(event, link.href)}
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
            className="px-5 py-3 text-xs"
          >
            Falar no WhatsApp
          </Button>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="inline-flex items-center justify-center rounded-full border border-line-strong p-2.5 text-text-light lg:hidden"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          aria-expanded={open}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </nav>

      {open && (
        <div className="absolute inset-x-0 top-full border-t border-line bg-bg-dark px-6 py-8 lg:hidden">
          <ul className="flex flex-col gap-6">
            {LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={(event) => handleLinkClick(event, link.href)}
                  className="font-display text-2xl text-text-light"
                >
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
    </header>
  );
}
