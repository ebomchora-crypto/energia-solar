"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

type AnimatedNumberProps = {
  value: number;
  format?: (value: number) => string;
  className?: string;
};

export default function AnimatedNumber({
  value,
  format = (v) => Math.round(v).toLocaleString("pt-BR"),
  className,
}: AnimatedNumberProps) {
  const spanRef = useRef<HTMLSpanElement>(null);
  const tweenTarget = useRef({ val: value });

  useEffect(() => {
    const target = tweenTarget.current;
    const tween = gsap.to(target, {
      val: value,
      duration: 0.7,
      ease: "power2.out",
      onUpdate: () => {
        if (spanRef.current) {
          spanRef.current.textContent = format(target.val);
        }
      },
    });
    return () => {
      tween.kill();
    };
  }, [value, format]);

  return (
    <span ref={spanRef} className={className}>
      {format(value)}
    </span>
  );
}
