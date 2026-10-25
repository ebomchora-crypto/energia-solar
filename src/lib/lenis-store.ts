import type Lenis from "lenis";
import { ScrollTrigger } from "@/lib/gsap";

type LenisLike = Pick<Lenis, "scrollTo" | "stop" | "start">;

export const lenisRef: { current: LenisLike | null } = { current: null };

// Pinned sections move inside a pin-spacer, so measuring the element would land
// at the *end* of its sequence. Use the ScrollTrigger start instead.
function resolveTarget(target: string | HTMLElement): number | HTMLElement | null {
  const el = typeof target === "string" ? document.querySelector<HTMLElement>(target) : target;
  if (!el) return null;
  const pinned = ScrollTrigger.getAll().find((t) => t.pin && t.trigger === el);
  return pinned ? Math.max(0, pinned.start) : el;
}

export function smoothScrollTo(target: string | HTMLElement) {
  const resolved = resolveTarget(target);
  if (resolved === null) return;
  if (lenisRef.current) {
    lenisRef.current.scrollTo(resolved, { duration: 1.4 });
    return;
  }
  if (typeof resolved === "number") window.scrollTo({ top: resolved, behavior: "smooth" });
  else resolved.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function setScrollLocked(locked: boolean) {
  if (lenisRef.current) {
    if (locked) lenisRef.current.stop();
    else lenisRef.current.start();
  }
  document.documentElement.style.overflow = locked ? "hidden" : "";
}
