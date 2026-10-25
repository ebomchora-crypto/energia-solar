"use client";

import { useRef, type ElementType, type ComponentPropsWithoutRef } from "react";
import { gsap } from "@/lib/gsap";

type MagneticButtonProps<T extends ElementType> = {
  as?: T;
  strength?: number;
  className?: string;
  children: React.ReactNode;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "className" | "children">;

export function MagneticButton<T extends ElementType = "button">({
  as,
  strength = 0.35,
  className,
  children,
  ...rest
}: MagneticButtonProps<T>) {
  const Component = (as || "button") as ElementType;
  const wrapRef = useRef<HTMLElement | null>(null);

  const handlePointerMove = (event: React.PointerEvent<HTMLElement>) => {
    if (event.pointerType !== "mouse") return;
    const el = wrapRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;
    gsap.to(el, {
      x: x * strength,
      y: y * strength,
      duration: 0.5,
      ease: "power3.out",
    });
  };

  const handlePointerLeave = () => {
    const el = wrapRef.current;
    if (!el) return;
    gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.4)" });
  };

  return (
    <Component
      ref={wrapRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      data-cursor="hover"
      className={className}
      {...rest}
    >
      {children}
    </Component>
  );
}
