"use client";

import { Canvas } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import Sun from "./Sun";
import { heroProgress } from "@/lib/scroll-stores";
import { useMediaQuery } from "@/hooks/useMediaQuery";

export default function HeroCanvas({ active = true }: { active?: boolean }) {
  const compact = useMediaQuery("(max-width: 767px)");

  return (
    <Canvas
      dpr={compact ? [1, 1.5] : [1, 1.75]}
      frameloop={active ? "always" : "never"}
      gl={{ antialias: !compact, alpha: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 0, 5.2], fov: 42 }}
      style={{ position: "absolute", inset: 0 }}
    >
      <Stars
        radius={60}
        depth={30}
        count={compact ? 500 : 1400}
        factor={compact ? 2 : 1.4}
        saturation={0}
        fade
        speed={0.3}
      />
      <Sun progressRef={heroProgress} />
    </Canvas>
  );
}
