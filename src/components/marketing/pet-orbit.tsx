"use client";

import { Environment, Float, MeshTransmissionMaterial, Sparkles } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useScroll } from "framer-motion";
import { useRef, useMemo } from "react";
import * as THREE from "three";

function Paw({ position, rotation, color, scale = 0.36 }: { position: [number, number, number]; rotation: [number, number, number]; color: string; scale?: number }) {
  return (
    <group position={position} rotation={rotation} scale={scale}>
      <mesh scale={[1.1, 0.9, 0.65]}>
        <sphereGeometry args={[0.72, 32, 32]} />
        <meshPhysicalMaterial color={color} roughness={0.1} metalness={0.8} clearcoat={1} clearcoatRoughness={0.1} />
      </mesh>
      {[-0.72, -0.24, 0.24, 0.72].map((x, index) => (
        <mesh key={x} position={[x, 0.73 + Math.abs(index - 1.5) * 0.1, 0]} scale={[0.32, 0.46, 0.32]}>
          <sphereGeometry args={[0.72, 32, 32]} />
          <meshPhysicalMaterial color={color} roughness={0.1} metalness={0.8} clearcoat={1} clearcoatRoughness={0.1} />
        </mesh>
      ))}
    </group>
  );
}

function ImmersiveScene({ reduceMotion }: { reduceMotion: boolean }) {
  const group = useRef<THREE.Group>(null);
  const glassOrb = useRef<THREE.Mesh>(null);
  const { scrollYProgress } = useScroll();

  // Create a complex procedural geometry for the glass orb
  const geometry = useMemo(() => {
    return new THREE.IcosahedronGeometry(1.5, 32);
  }, []);

  useFrame((state, delta) => {
    if (!group.current || reduceMotion) return;

    // Smooth mouse follow
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, state.pointer.y * 0.2, 0.05);
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, state.pointer.x * 0.2, 0.05);

    // Continuous slow rotation for the orb
    if (glassOrb.current) {
      glassOrb.current.rotation.y += delta * 0.15;
      glassOrb.current.rotation.x += delta * 0.1;
    }

    // Scroll tied animations
    const scroll = scrollYProgress.get(); // 0 to 1
    // As we scroll, the group moves up and rotates dramatically
    group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, scroll * 5, 0.1);
    group.current.position.z = THREE.MathUtils.lerp(group.current.position.z, scroll * 2, 0.1);
    group.current.rotation.z = THREE.MathUtils.lerp(group.current.rotation.z, scroll * Math.PI, 0.1);
  });

  return (
    <group ref={group}>
      <Float speed={reduceMotion ? 0 : 2} rotationIntensity={0.5} floatIntensity={1}>
        <mesh ref={glassOrb} geometry={geometry}>
          <MeshTransmissionMaterial 
            backside
            samples={4}
            thickness={1.5}
            chromaticAberration={0.5}
            anisotropy={0.2}
            distortion={0.3}
            distortionScale={0.5}
            temporalDistortion={0.1}
            iridescence={1}
            iridescenceIOR={1.5}
            iridescenceThicknessRange={[100, 400]}
            color="#fffaf1"
            transmission={1}
            roughness={0.1}
          />
        </mesh>
        
        {/* Core glowing sphere inside the glass orb */}
        <mesh scale={0.8}>
          <sphereGeometry args={[1, 32, 32]} />
          <meshStandardMaterial color="#f4b134" emissive="#f4b134" emissiveIntensity={2} toneMapped={false} />
        </mesh>

        <Paw position={[0, 0, 1.8]} rotation={[0, 0, -0.08]} color="#fffaf1" scale={0.4} />
      </Float>

      {/* Orbiting elements */}
      <Float speed={reduceMotion ? 0 : 1.5} rotationIntensity={1} floatIntensity={2}>
        <Paw position={[-3, 2, -1]} rotation={[0.5, -0.5, -0.8]} color="#ef6f59" scale={0.5} />
        <Paw position={[3, -2, 1]} rotation={[-0.5, 0.5, 0.8]} color="#5d8754" scale={0.45} />
        <Paw position={[-2, -3, -2]} rotation={[1, 0.2, 0.3]} color="#4b4c87" scale={0.35} />
      </Float>

      <Sparkles count={100} scale={12} size={3} speed={reduceMotion ? 0 : 0.4} color="#f4b134" opacity={0.8} />
      <Sparkles count={50} scale={10} size={5} speed={reduceMotion ? 0 : 0.6} color="#ef6f59" opacity={0.5} />
    </group>
  );
}

export function PetOrbit({ reduceMotion = false }: { reduceMotion?: boolean }) {
  return (
    <Canvas
      aria-hidden="true"
      camera={{ position: [0, 0, 8], fov: 35 }}
      dpr={[1, 2]}
      gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={2} color="#fffaf1" />
      <directionalLight position={[-10, -10, -5]} intensity={1} color="#ef6f59" />
      <Environment preset="city" />
      <ImmersiveScene reduceMotion={reduceMotion} />
    </Canvas>
  );
}
