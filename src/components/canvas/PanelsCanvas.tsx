"use client";

import { Canvas } from "@react-three/fiber";
import PanelsField from "./PanelsField";
import { panelsProgress } from "@/lib/scroll-stores";

export default function PanelsCanvas({ active = true }: { active?: boolean }) {
  return (
    <Canvas
      dpr={[1, 1.75]}
      frameloop={active ? "always" : "never"}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ position: [0.2, 8.4, 1.4], fov: 42 }}
      style={{ position: "absolute", inset: 0 }}
    >
      <PanelsField progressRef={panelsProgress} />
    </Canvas>
  );
}
