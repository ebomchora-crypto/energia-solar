// Site-wide configuration. Replace the placeholders below with the real
// company contact details before shipping to production.

export const COMPANY_NAME = "Hélio Energia Solar";

// Placeholder WhatsApp number in E.164 digits-only format (country + DDD + number).
// Override with NEXT_PUBLIC_WHATSAPP_NUMBER at build/deploy time.
const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, "") || "5500000000000";

const WHATSAPP_MESSAGE =
  "Olá! Quero saber mais sobre energia solar para minha casa.";

export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  WHATSAPP_MESSAGE
)}`;

// Placeholder contact e-mail used by the "Solicitar análise gratuita" form.
export const CONTACT_EMAIL =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL || "contato@helio-solar.com.br";
