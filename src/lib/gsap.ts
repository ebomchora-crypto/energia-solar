"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let registered = false;

export function registerGsap() {
  if (registered) return;
  if (typeof window === "undefined") return;
  gsap.registerPlugin(ScrollTrigger);
  // Mobile browser UI (address bar) resizes the viewport while scrolling;
  // ignoring those resizes prevents pin jumps and refresh loops.
  ScrollTrigger.config({ ignoreMobileResize: true });
  registered = true;
  if (process.env.NODE_ENV !== "production") {
    // @ts-expect-error debug helper, dev-only
    window.ScrollTrigger = ScrollTrigger;
  }
}

export const DESKTOP_MQ = "(min-width: 1024px)";
export const MOBILE_MQ = "(max-width: 1023px)";

export { gsap, ScrollTrigger };
