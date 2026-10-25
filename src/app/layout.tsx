import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  axes: ["opsz", "SOFT", "WONK"],
  style: ["normal", "italic"],
  display: "swap",
});

const siteUrl = "https://helio-solar.com.br";
const siteName = "Hélio Energia Solar";
const siteDescription =
  "Transformamos a energia do sol em economia, independência e um amanhã mais sustentável. Conheça a energia solar fotovoltaica premium da Hélio.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteName} | O futuro começa com a luz`,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  keywords: [
    "energia solar",
    "painel solar",
    "energia fotovoltaica",
    "economia na conta de luz",
    "energia solar Brasil",
    "instalação de painéis solares",
  ],
  authors: [{ name: siteName }],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: siteUrl,
    siteName,
    title: `${siteName} | O futuro começa com a luz`,
    description: siteDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteName} | O futuro começa com a luz`,
    description: siteDescription,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#101514",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: siteName,
  url: siteUrl,
  description: siteDescription,
  areaServed: "BR",
  availableLanguage: "pt-BR",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${fraunces.variable}`}>
      <body className="bg-bg-dark text-text-light antialiased">
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
