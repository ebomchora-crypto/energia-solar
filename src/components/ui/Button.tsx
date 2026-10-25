"use client";

import type { ComponentPropsWithoutRef, ElementType } from "react";
import { ArrowUpRight } from "lucide-react";
import { MagneticButton } from "./MagneticButton";
import { cn } from "@/lib/utils";

type Variant = "solid" | "outline" | "ghost";

type ButtonProps<T extends ElementType> = {
  as?: T;
  variant?: Variant;
  icon?: boolean;
  className?: string;
  children: React.ReactNode;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "className" | "children">;

const variantClasses: Record<Variant, string> = {
  solid:
    "bg-solar text-text-dark hover:bg-solar-soft shadow-[0_0_0_0_rgba(244,197,66,0)] hover:shadow-[0_0_40px_0_rgba(244,197,66,0.35)]",
  outline:
    "border border-line-strong text-text-light hover:border-solar hover:text-solar bg-transparent",
  ghost: "text-text-light hover:text-solar bg-transparent",
};

export function Button<T extends ElementType = "button">({
  as,
  variant = "solid",
  icon = true,
  className,
  children,
  ...rest
}: ButtonProps<T>) {
  const MagneticAny = MagneticButton as React.ComponentType<
    Record<string, unknown>
  >;

  return (
    <MagneticAny
      as={as}
      className={cn(
        "group inline-flex items-center gap-2.5 rounded-full px-7 py-4 text-sm font-medium tracking-tight transition-colors duration-300",
        variantClasses[variant],
        className
      )}
      {...rest}
    >
      <span>{children}</span>
      {icon && (
        <ArrowUpRight
          className="size-4 shrink-0 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          aria-hidden="true"
        />
      )}
    </MagneticAny>
  );
}
