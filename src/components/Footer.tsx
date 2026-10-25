import { COMPANY_NAME, WHATSAPP_URL, CONTACT_EMAIL } from "@/lib/config";

const LINKS = [
  { href: "#energia", label: "A energia" },
  { href: "#economia", label: "Economia" },
  { href: "#projetos", label: "Projetos" },
  { href: "#tecnologia", label: "Tecnologia" },
];

export default function Footer() {
  return (
    <footer className="border-t border-line bg-bg-dark px-6 py-14 md:px-14 lg:px-20">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-10 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="font-display text-xl text-text-light">
            Hélio<span className="text-solar">.</span>
          </p>
          <p className="mt-3 max-w-xs text-sm text-text-light/55">
            {COMPANY_NAME}. Energia solar fotovoltaica para um futuro mais
            independente e sustentável.
          </p>
        </div>

        <nav aria-label="Links do rodapé" className="flex flex-wrap gap-x-8 gap-y-3">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="label-caps text-text-light/55 transition-colors hover:text-solar"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="space-y-2 text-sm text-text-light/55">
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="block hover:text-solar">
            WhatsApp
          </a>
          <a href={`mailto:${CONTACT_EMAIL}`} className="block hover:text-solar">
            {CONTACT_EMAIL}
          </a>
        </div>
      </div>

      <div className="mx-auto mt-12 flex max-w-[1600px] flex-col gap-2 border-t border-line pt-6 text-xs text-text-light/35 md:flex-row md:items-center md:justify-between">
        <p>
          © {new Date().getFullYear()} {COMPANY_NAME}. Todos os direitos
          reservados.
        </p>
        <p>
          Projetos e valores exibidos possuem caráter ilustrativo e
          demonstrativo.
        </p>
      </div>
    </footer>
  );
}
