"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, registerGsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { lenisRef } from "@/lib/lenis-store";

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    registerGsap();

    let refreshTimer: ReturnType<typeof setTimeout> | undefined;
    const refreshSoon = () => {
      clearTimeout(refreshTimer);
      refreshTimer = setTimeout(() => ScrollTrigger.refresh(), 120);
    };

    // Web fonts swap in after first paint and reflow section heights; images
    // finishing late can too. One debounced refresh once both are stable.
    if ("fonts" in document) document.fonts.ready.then(refreshSoon);
    window.addEventListener("load", refreshSoon);
    window.addEventListener("orientationchange", refreshSoon);

    let cleanupLenis = () => {};

    if (!reducedMotion) {
      const lenis = new Lenis({
        duration: 1.15,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        wheelMultiplier: 1,
        // Touch keeps native momentum scrolling (syncTouch is off by default);
        // ScrollTrigger still receives every scroll event through Lenis.
      });

      lenisRef.current = lenis;
      if (process.env.NODE_ENV !== "production") {
        // @ts-expect-error debug helper, dev-only
        window.__lenis = lenis;
      }
      lenis.on("scroll", ScrollTrigger.update);

      const tick = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);

      cleanupLenis = () => {
        gsap.ticker.remove(tick);
        lenis.destroy();
        lenisRef.current = null;
        if (process.env.NODE_ENV !== "production") {
          // @ts-expect-error debug helper, dev-only
          window.__lenis = undefined;
        }
      };
    }

    return () => {
      clearTimeout(refreshTimer);
      window.removeEventListener("load", refreshSoon);
      window.removeEventListener("orientationchange", refreshSoon);
      cleanupLenis();
    };
  }, [reducedMotion]);

  return <>{children}</>;
}
