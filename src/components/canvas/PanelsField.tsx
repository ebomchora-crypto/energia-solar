"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import * as THREE from "three";
import { panelVertexShader, panelFragmentShader } from "./panelShader";

type FieldProps = {
  progressRef: { value: number };
};

const COLS = 4;
const ROWS = 3;
const SPACING_X = 1.5;
const SPACING_Z = 1.1;

function smoothstep(x: number) {
  return x * x * (3 - 2 * x);
}

function Panel({
  position,
  seed,
  progressRef,
}: {
  position: [number, number, number];
  seed: number;
  progressRef: { value: number };
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const desync = useMemo(
    () => ({
      x: (Math.sin(seed * 12.9) * 0.5) * 0.9,
      y: (Math.cos(seed * 7.3) * 0.5) * 1.4,
      z: (Math.sin(seed * 3.1) * 0.5) * 0.6,
      liftY: Math.abs(Math.sin(seed * 5.7)) * 1.1,
    }),
    [seed]
  );

  const uniforms = useMemo(
    () => ({
      uSweep: { value: -0.5 },
      uTime: { value: 0 },
      uBase: { value: new THREE.Color("#0c1a24") },
      uCell: { value: new THREE.Color("#173449") },
      uHighlight: { value: new THREE.Color("#f4c542") },
    }),
    []
  );

  useFrame((state) => {
    const progress = progressRef.value;
    const settle = smoothstep(Math.min(1, progress / 0.65));
    const unsettle = 1 - settle;

    if (meshRef.current) {
      meshRef.current.rotation.x = -0.45 + desync.x * unsettle;
      meshRef.current.rotation.y = desync.y * unsettle;
      meshRef.current.rotation.z = desync.z * unsettle;
      meshRef.current.position.y = position[1] + desync.liftY * unsettle;
    }

    if (materialRef.current) {
      const sweep = ((state.clock.getElapsedTime() * 0.12 + seed) % 1.4) - 0.2;
      materialRef.current.uniforms.uSweep.value = sweep;
      materialRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
    }
  });

  return (
    <mesh ref={meshRef} position={position} castShadow receiveShadow>
      <boxGeometry args={[1.18, 0.06, 0.78]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={panelVertexShader}
        fragmentShader={panelFragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  );
}

function EnergyLines({ progressRef }: { progressRef: { value: number } }) {
  const groupRef = useRef<THREE.Group>(null);
  const hub: [number, number, number] = [0, -1.1, 2.4];

  const lines = useMemo(() => {
    const items: { points: THREE.Vector3[]; seed: number }[] = [];
    for (let col = 0; col < COLS; col++) {
      for (let row = 0; row < ROWS; row++) {
        const x = (col - (COLS - 1) / 2) * SPACING_X;
        const z = (row - (ROWS - 1) / 2) * SPACING_Z;
        const start = new THREE.Vector3(x, 0.05, z);
        const mid = new THREE.Vector3(x * 0.5, -0.5, (z + hub[2]) * 0.5);
        const end = new THREE.Vector3(hub[0], hub[1], hub[2]);
        const curve = new THREE.CatmullRomCurve3([start, mid, end]);
        const seed = ((col * ROWS + row + 1) * 2.718281828) % 10;
        items.push({ points: curve.getPoints(24), seed });
      }
    }
    return items;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useFrame(() => {
    if (!groupRef.current) return;
    const progress = progressRef.value;
    const opacity = Math.max(0, smoothstep(Math.min(1, (progress - 0.45) / 0.4)));
    groupRef.current.visible = opacity > 0.01;
    groupRef.current.traverse((child) => {
      if (child instanceof THREE.Mesh || child instanceof THREE.Line) {
        const mat = child.material as THREE.Material & { opacity?: number };
        if (mat && "opacity" in mat) mat.opacity = opacity * 0.85;
      }
    });
  });

  return (
    <group ref={groupRef}>
      {lines.map((line, i) => (
        <Line
          key={i}
          points={line.points}
          color="#f4c542"
          lineWidth={1.1}
          transparent
          opacity={0}
          toneMapped={false}
        />
      ))}
    </group>
  );
}

function CameraRig({ progressRef }: { progressRef: { value: number } }) {
  const { camera } = useThree();
  const target = useMemo(() => new THREE.Vector3(), []);

  useFrame(() => {
    const progress = smoothstep(progressRef.value);

    const aerial = new THREE.Vector3(0.4, 6.4, 0.2);
    const reveal = new THREE.Vector3(2.1, 1.7, 5.3);
    const pos = aerial.clone().lerp(reveal, progress);
    camera.position.lerp(pos, 0.15);

    const aerialTarget = new THREE.Vector3(0, 0, 0);
    const revealTarget = new THREE.Vector3(-0.3, 0.1, 0);
    target.copy(aerialTarget.clone().lerp(revealTarget, progress));
    camera.lookAt(target);
  });

  return null;
}

export default function PanelsField({ progressRef }: FieldProps) {
  const panels = useMemo(() => {
    const items: { position: [number, number, number]; seed: number }[] = [];
    for (let col = 0; col < COLS; col++) {
      for (let row = 0; row < ROWS; row++) {
        const x = (col - (COLS - 1) / 2) * SPACING_X;
        const z = (row - (ROWS - 1) / 2) * SPACING_Z;
        items.push({ position: [x, 0, z], seed: col * ROWS + row + 1 });
      }
    }
    return items;
  }, []);

  return (
    <>
      <CameraRig progressRef={progressRef} />
      <ambientLight intensity={0.55} />
      <directionalLight position={[4, 8, 2]} intensity={1.4} color="#f8e8c0" />
      <directionalLight position={[-3, 2, -4]} intensity={0.3} color="#436b55" />

      <mesh position={[0, -0.55, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[14, 10]} />
        <meshStandardMaterial color="#0c1210" roughness={0.9} metalness={0.05} />
      </mesh>

      {panels.map((panel, i) => (
        <Panel key={i} position={panel.position} seed={panel.seed} progressRef={progressRef} />
      ))}

      <EnergyLines progressRef={progressRef} />
    </>
  );
}
