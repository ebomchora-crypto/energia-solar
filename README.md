# Hélio Energia Solar

Site institucional cinematográfico para uma empresa premium de energia solar
fotovoltaica brasileira. Experiência de rolagem contínua ("scroll journey")
em pt-BR, construída com Next.js (App Router), TypeScript, Tailwind CSS,
GSAP + ScrollTrigger, Lenis (smooth scroll) e React Three Fiber (Three.js).

## Stack

- **Next.js 16** (App Router, TypeScript)
- **Tailwind CSS v4** — tokens de design em `src/app/globals.css`
- **GSAP + ScrollTrigger** — timelines com scroll scrubado e seções fixas (pin)
- **Lenis** — rolagem suave, sincronizada com o ScrollTrigger
- **React Three Fiber / Three.js** — sol com shader procedural e campo de
  painéis solares 3D (cenas 1 e 2), com fallback leve em CSS para mobile
- **lucide-react** — iconografia

## Estrutura

```
src/
  app/            # rota única (page.tsx), layout, metadata, robots/sitemap
  components/
    scenes/       # as 7 cenas da jornada de rolagem
    canvas/       # componentes WebGL (sol, painéis) e shaders
    ui/           # botões, slider, cursor, número animado
  hooks/          # useReducedMotion, useIsDesktop, useMediaQuery
  lib/            # config, imagens, stores de progresso de scroll
```

## Rodando localmente

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

```bash
npm run build   # build de produção
npm run start   # servir o build de produção
npm run lint    # eslint
```

## Configuração

Edite `src/lib/config.ts` para definir o número de WhatsApp real
(`NEXT_PUBLIC_WHATSAPP_NUMBER`) e o e-mail de contato
(`NEXT_PUBLIC_CONTACT_EMAIL`) antes de publicar em produção — os valores
atuais são placeholders.

## Conteúdo de demonstração

Os projetos exibidos na galeria (`src/lib/images.ts`), os valores do
simulador de economia e os textos institucionais têm caráter ilustrativo e
devem ser substituídos por conteúdo real da empresa.
