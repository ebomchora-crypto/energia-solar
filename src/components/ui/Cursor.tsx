"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { useMediaQuery } from "@/hooks/useMediaQuery";

export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const [hovering, setHovering] = useState(false);
  const enabled = useMediaQuery("(pointer: fine)");

  useEffect(() => {
    if (!enabled) return;

    const dot = dotRef.current;
    if (!dot) return;

    const quickX = gsap.quickTo(dot, "x", { duration: 0.5, ease: "power3.out" });
    const quickY = gsap.quickTo(dot, "y", { duration: 0.5, ease: "power3.out" });

    const handleMove = (event: PointerEvent) => {
      quickX(event.clientX);
      quickY(event.clientY);
    };

    const handleOver = (event: PointerEvent) => {
      const target = event.target as HTMLElement;
      setHovering(Boolean(target.closest('[data-cursor="hover"]')));
    };

    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerover", handleOver);

    return () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerover", handleOver);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={dotRef}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[90] -translate-x-1/2 -translate-y-1/2 mix-blend-difference"
      style={{ willChange: "transform" }}
    >
      <div
        className="rounded-full bg-text-light transition-[width,height] duration-300 ease-out"
        style={{
          width: hovering ? 48 : 8,
          height: hovering ? 48 : 8,
        }}
      />
    </div>
  );
}
