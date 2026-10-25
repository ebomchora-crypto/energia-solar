"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let registered = false;

export function registerGsap() {
  if (registered) return;
  if (typeof window === "undefined") return;
  gsap.registerPlugin(ScrollTrigger);
  registered = true;
  if (process.env.NODE_ENV !== "production") {
    // @ts-expect-error debug helper, dev-only
    window.ScrollTrigger = ScrollTrigger;
  }
}

export { gsap, ScrollTrigger };
