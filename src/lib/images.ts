// Curated photography (Unsplash — free to use under the Unsplash License,
// no attribution required: https://unsplash.com/license). IDs verified to
// resolve before use. Demonstration content — replace with real project
// photography when available.

function unsplash(id: string) {
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&q=80`;
}

export const HOUSE_HERO = {
  src: unsplash("1523217582562-09d0def993a6"),
  alt: "Residência contemporânea de arquitetura branca e minimalista, em um dia claro",
};

export const CTA_BACKGROUND = {
  src: unsplash("1613665813446-82a78c468a1d"),
  alt: "Painéis solares em um telhado durante o pôr do sol dourado",
};

export const GALLERY_PROJECTS = [
  {
    id: "01",
    title: "Residência Litorânea",
    location: "Florianópolis, SC",
    type: "Instalação residencial · 6,4 kWp",
    image: unsplash("1512917774080-9991f1c4c750"),
    alt: "Casa moderna com piscina e vegetação tropical",
  },
  {
    id: "02",
    title: "Vila Alto Padrão",
    location: "Campinas, SP",
    type: "Sistema premium integrado · 12,8 kWp",
    image: unsplash("1600596542815-ffad4c1539a9"),
    alt: "Residência de alto padrão com piscina e arquitetura contemporânea",
  },
  {
    id: "03",
    title: "Usina Solar Rural",
    location: "Ribeirão Preto, SP",
    type: "Geração em solo · 240 kWp",
    image: unsplash("1497435334941-8c899ee9e8e9"),
    alt: "Vista aérea de uma usina solar em área rural",
  },
  {
    id: "04",
    title: "Cobertura Comercial",
    location: "Belo Horizonte, MG",
    type: "Sistema comercial · 48 kWp",
    image: unsplash("1508514177221-188b1cf16e9d"),
    alt: "Painéis solares instalados sobre gramado com céu amplo ao fundo",
  },
  {
    id: "05",
    title: "Instalação Especializada",
    location: "Curitiba, PR",
    type: "Equipe técnica em campo",
    image: unsplash("1624397640148-949b1732bb0a"),
    alt: "Técnico instalando painel solar em um telhado residencial",
  },
] as const;
