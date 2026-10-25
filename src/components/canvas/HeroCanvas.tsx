"use client";

import { Canvas } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import Sun from "./Sun";
import { heroProgress } from "@/lib/scroll-stores";

export default function HeroCanvas() {
  return (
    <Canvas
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true }}
      camera={{ position: [0, 0, 5.2], fov: 42 }}
      style={{ position: "absolute", inset: 0 }}
    >
      <Stars
        radius={60}
        depth={30}
        count={1400}
        factor={1.4}
        saturation={0}
        fade
        speed={0.3}
      />
      <Sun progressRef={heroProgress} />
    </Canvas>
  );
}
