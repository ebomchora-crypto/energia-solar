import type Lenis from "lenis";

type LenisLike = Pick<Lenis, "scrollTo">;

export const lenisRef: { current: LenisLike | null } = { current: null };

export function smoothScrollTo(target: string | HTMLElement) {
  if (lenisRef.current) {
    lenisRef.current.scrollTo(target, { duration: 1.4 });
    return;
  }
  const el = typeof target === "string" ? document.querySelector(target) : target;
  el?.scrollIntoView({ behavior: "smooth", block: "start" });
}
