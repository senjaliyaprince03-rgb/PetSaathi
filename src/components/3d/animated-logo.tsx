"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Center, Float } from "@react-three/drei";
import type * as THREE from "three";

function AnimatedPaw() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime) * 0.3;
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial
          color="#8B6F47"
          metalness={0.8}
          roughness={0.2}
          emissive="#8B6F47"
          emissiveIntensity={0.3}
        />
      </mesh>
    </Float>
  );
}

function Logo3D() {
  return (
    <Center>
      <Float speed={1} rotationIntensity={0.2} floatIntensity={0.3}>
        <group>
          <AnimatedPaw />
          <pointLight position={[2, 2, 2]} intensity={2} color="#8B6F47" />
        </group>
      </Float>
    </Center>
  );
}

export function AnimatedLogo({ className = "" }: { className?: string }) {
  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <Logo3D />
      </Canvas>
    </div>
  );
}
