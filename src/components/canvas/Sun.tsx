"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { sunVertexShader, sunFragmentShader } from "./sunShader";

type SunProps = {
  progressRef: { value: number };
};

function makeGlowTexture() {
  const size = 512;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.Texture();

  const gradient = ctx.createRadialGradient(
    size / 2,
    size / 2,
    0,
    size / 2,
    size / 2,
    size / 2
  );
  gradient.addColorStop(0, "rgba(255, 244, 214, 1)");
  gradient.addColorStop(0.25, "rgba(248, 216, 122, 0.55)");
  gradient.addColorStop(0.55, "rgba(244, 197, 66, 0.22)");
  gradient.addColorStop(1, "rgba(244, 197, 66, 0)");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

export default function Sun({ progressRef }: SunProps) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const groupRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.Sprite>(null);
  const glowOuterRef = useRef<THREE.Sprite>(null);

  const glowTexture = useMemo(() => makeGlowTexture(), []);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uIntensity: { value: 1.0 },
      uOct: { value: 5 },
      uColorCore: { value: new THREE.Color("#fff3d6") },
      uColorMid: { value: new THREE.Color("#f4c542") },
      uColorEdge: { value: new THREE.Color("#c8651f") },
    }),
    []
  );

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const progress = progressRef.value;

    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = t;
      materialRef.current.uniforms.uIntensity.value = 1.0 + progress * 0.9;
      // Cheaper surface noise on phones, where the sun fills the whole screen mid-scroll
      materialRef.current.uniforms.uOct.value = state.size.width < 768 ? 3 : 5;
    }

    // Fit the sun to the viewport: wide screens keep the original framing,
    // portrait screens pull the camera back and lift the sun above the copy.
    const aspect = state.size.width / state.size.height;
    const cam = state.camera as THREE.PerspectiveCamera;
    const halfTan = Math.tan((cam.fov * Math.PI) / 360);
    const portrait = aspect < 1;
    // Portrait: the sun spans <= ~31% of the viewport height so copy never touches it
    cam.position.z = Math.max(5.2, 1.55 / (aspect * halfTan), portrait ? 2 / (0.62 * halfTan) : 0);
    const lift = portrait ? 1.0 - Math.min(1, progress * 1.5) : 0;

    if (groupRef.current) {
      const scale = 1 + progress * 2.4;
      groupRef.current.scale.setScalar(scale);
      groupRef.current.position.z = progress * 2.2;
      groupRef.current.position.y = lift * (cam.position.z * halfTan * 0.42);
      groupRef.current.rotation.y = t * 0.03;
    }

    if (glowRef.current) {
      const glowScale = 3.4 + progress * 5.5;
      glowRef.current.scale.setScalar(glowScale);
      (glowRef.current.material as THREE.SpriteMaterial).opacity =
        0.85 - progress * 0.1;
    }

    if (glowOuterRef.current) {
      const glowScale = 6 + progress * 10;
      glowOuterRef.current.scale.setScalar(glowScale);
      (glowOuterRef.current.material as THREE.SpriteMaterial).opacity =
        0.4 + progress * 0.35;
    }
  });

  return (
    <group ref={groupRef}>
      <sprite ref={glowOuterRef} renderOrder={1}>
        <spriteMaterial
          map={glowTexture}
          transparent
          opacity={0.4}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </sprite>
      <sprite ref={glowRef} renderOrder={2}>
        <spriteMaterial
          map={glowTexture}
          transparent
          opacity={0.85}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </sprite>
      <mesh renderOrder={3}>
        <icosahedronGeometry args={[1, 24]} />
        <shaderMaterial
          ref={materialRef}
          vertexShader={sunVertexShader}
          fragmentShader={sunFragmentShader}
          uniforms={uniforms}
        />
      </mesh>
    </group>
  );
}
