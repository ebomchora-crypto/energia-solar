"use client";

import { Canvas } from "@react-three/fiber";
import PanelsField from "./PanelsField";
import { panelsProgress } from "@/lib/scroll-stores";

export default function PanelsCanvas() {
  return (
    <Canvas
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true }}
      camera={{ position: [0.4, 6.4, 0.2], fov: 45 }}
      style={{ position: "absolute", inset: 0 }}
    >
      <PanelsField progressRef={panelsProgress} />
    </Canvas>
  );
}
