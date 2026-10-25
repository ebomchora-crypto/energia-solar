"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import * as THREE from "three";
import { panelVertexShader, panelFragmentShader } from "./panelShader";

type FieldProps = {
  progressRef: { value: number };
};

const COLS = 6;
const ROWS = 4;
const SPACING_X = 1.32;
const SPACING_Z = 0.98;
const TILT = 0.32;
const HUB = new THREE.Vector3(0, -1.0, 3.2);

function smoothstep(x: number) {
  const c = Math.min(1, Math.max(0, x));
  return c * c * (3 - 2 * c);
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
      x: Math.sin(seed * 12.9) * 0.28,
      y: Math.cos(seed * 7.3) * 0.5,
      z: Math.sin(seed * 3.1) * 0.16,
      lift: 0.25 + Math.abs(Math.sin(seed * 5.7)) * 0.9,
    }),
    [seed]
  );

  const uniforms = useMemo(
    () => ({
      uSweep: { value: -0.5 },
      uSeed: { value: seed },
      uHighlight: { value: new THREE.Color("#ffe2a0") },
    }),
    [seed]
  );

  useFrame((state) => {
    const settle = smoothstep(progressRef.value / 0.6);
    const loose = 1 - settle;

    if (meshRef.current) {
      meshRef.current.rotation.set(
        TILT + desync.x * loose,
        desync.y * loose,
        desync.z * loose
      );
      meshRef.current.position.y = position[1] + desync.lift * loose;
    }
    if (materialRef.current) {
      materialRef.current.uniforms.uSweep.value =
        ((state.clock.elapsedTime * 0.1 + seed * 0.07) % 1.5) - 0.25;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <boxGeometry args={[1.18, 0.05, 0.78]} />
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
  const pulsesRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const tmp = useMemo(() => new THREE.Vector3(), []);

  const curves = useMemo(() => {
    const items: THREE.CatmullRomCurve3[] = [];
    for (let col = 0; col < COLS; col++) {
      for (let row = 0; row < ROWS; row++) {
        const x = (col - (COLS - 1) / 2) * SPACING_X;
        const z = (row - (ROWS - 1) / 2) * SPACING_Z;
        const start = new THREE.Vector3(x, -0.08, z);
        const mid = new THREE.Vector3(x * 0.55, -0.62, (z + HUB.z) * 0.55);
        items.push(new THREE.CatmullRomCurve3([start, mid, HUB.clone()]));
      }
    }
    return items;
  }, []);

  const linePoints = useMemo(() => curves.map((c) => c.getPoints(28)), [curves]);

  useFrame((state) => {
    const progress = progressRef.value;
    const reveal = smoothstep((progress - 0.4) / 0.35);
    if (groupRef.current) {
      groupRef.current.visible = reveal > 0.01;
      groupRef.current.traverse((child) => {
        const mat = (child as THREE.Mesh).material as
          | (THREE.Material & { opacity?: number })
          | undefined;
        if (mat && "opacity" in mat && child.type !== "Mesh") mat.opacity = reveal * 0.75;
      });
    }
    if (pulsesRef.current) {
      const time = state.clock.elapsedTime;
      curves.forEach((curve, i) => {
        const t = (time * 0.22 + i * 0.137) % 1;
        curve.getPointAt(t, tmp);
        dummy.position.copy(tmp);
        dummy.scale.setScalar(reveal * (0.6 + 0.4 * Math.sin(t * Math.PI)) * 0.032);
        dummy.updateMatrix();
        pulsesRef.current!.setMatrixAt(i, dummy.matrix);
      });
      pulsesRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <>
      <group ref={groupRef}>
        {linePoints.map((points, i) => (
          <Line
            key={i}
            points={points}
            color="#f4c542"
            lineWidth={1}
            transparent
            opacity={0}
            toneMapped={false}
          />
        ))}
      </group>
      <instancedMesh ref={pulsesRef} args={[undefined, undefined, curves.length]}>
        <sphereGeometry args={[1, 10, 10]} />
        <meshBasicMaterial color="#ffe9ad" toneMapped={false} fog={false} />
      </instancedMesh>
    </>
  );
}

function CameraRig({ progressRef }: { progressRef: { value: number } }) {
  const { camera, size } = useThree();
  const aerial = useMemo(() => new THREE.Vector3(0.2, 8.4, 1.4), []);
  const reveal = useMemo(() => new THREE.Vector3(3.4, 3.6, 6.8), []);
  const aimA = useMemo(() => new THREE.Vector3(0, 0, 0.2), []);
  const aimB = useMemo(() => new THREE.Vector3(-1.5, -0.2, 0.2), []);
  const pos = useMemo(() => new THREE.Vector3(), []);
  const aim = useMemo(() => new THREE.Vector3(), []);

  useFrame(() => {
    const p = smoothstep(progressRef.value);
    // Wider framing on narrow canvases so the whole array stays in view
    const fit = size.width / size.height < 1.3 ? 1.25 : 1;
    pos.set(
      THREE.MathUtils.lerp(aerial.x, reveal.x, p),
      THREE.MathUtils.lerp(aerial.y, reveal.y, p) * fit,
      THREE.MathUtils.lerp(aerial.z, reveal.z, p) * fit
    );
    camera.position.lerp(pos, 0.2);
    aim.copy(aimA).lerp(aimB, p);
    camera.lookAt(aim);
  });

  return null;
}

export default function PanelsField({ progressRef }: FieldProps) {
  const panels = useMemo(() => {
    const items: { position: [number, number, number]; seed: number }[] = [];
    for (let col = 0; col < COLS; col++) {
      for (let row = 0; row < ROWS; row++) {
        items.push({
          position: [
            (col - (COLS - 1) / 2) * SPACING_X,
            0,
            (row - (ROWS - 1) / 2) * SPACING_Z,
          ],
          seed: col * ROWS + row + 1,
        });
      }
    }
    return items;
  }, []);

  return (
    <>
      <fog attach="fog" args={["#0a0f0e", 9, 24]} />
      <CameraRig progressRef={progressRef} />

      <mesh position={[0, -0.7, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[40, 30]} />
        <meshBasicMaterial color="#0b100f" />
      </mesh>
      <gridHelper args={[40, 40, "#1b2a25", "#121b18"]} position={[0, -0.69, 0]} />

      {panels.map((panel) => (
        <Panel
          key={panel.seed}
          position={panel.position}
          seed={panel.seed}
          progressRef={progressRef}
        />
      ))}

      <EnergyLines progressRef={progressRef} />
    </>
  );
}
