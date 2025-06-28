"use client";

import { useMemo, useRef } from "react";
import { Group } from "three";
import { useFrame } from "@react-three/fiber";

export const GalaxyEffect = () => {
    // Pre-compute stars only once using useMemo
    const stars = useRef(
      Array.from({ length: 100 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.6 + 0.2,
      }))
    ).current;
  
    // Memoize the stars rendering to prevent unnecessary re-renders
    const memoizedStars = useMemo(
      () =>
        stars.map((star) => (
          <div
            key={star.id}
            className="absolute rounded-full bg-white"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              opacity: star.opacity,
              willChange: "transform", // Optimize for animations
              transform: "translateZ(0)", // Force GPU acceleration
            }}
          />
        )),
      [stars]
    );
  
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Optimized gradient background with hardware acceleration */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950"
          style={{ transform: "translateZ(0)" }}
        />
        <div
          className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,_rgba(147,51,234,0.2)_0%,_transparent_50%)]"
          style={{ transform: "translateZ(0)" }}
        />
  
        {/* Render memoized stars */}
        {memoizedStars}
      </div>
    );
  };
  
  export const AnimatedBoxScene = () => {
    const groupRef = useRef<Group | null>(null);
    const knotRef = useRef<Group | null>(null);
  
    useFrame((state) => {
      if (groupRef.current) {
        groupRef.current.rotation.x =
          Math.sin(state.clock.elapsedTime * 0.6) * 0.3;
        groupRef.current.rotation.y =
          Math.sin(state.clock.elapsedTime * 0.4) * 0.3;
      }
      if (knotRef.current) {
        // Simpler, more subtle movement
        knotRef.current.rotation.y =
          Math.sin(state.clock.elapsedTime * 0.2) * 0.3;
      }
    });
  
    // Bar dimensions
    const barLength = 2.4;
    const barThickness = 0.3;
    // Three distinct purple shades for contrast
    const colorX = "#9333EA"; // Rich purple
    const colorY = "#A855F7"; // Medium purple
    const colorZ = "#C084FC"; // Light purple
  
    return (
      <group ref={groupRef}>
        {/* Simplified torus knot */}
        <group ref={knotRef} position={[0, 0, 0]}>
          <mesh>
            <torusKnotGeometry args={[0.4, 0.15, 64, 16, 2, 3]} />
            <meshPhysicalMaterial
              color="#A855F7"
              emissive="#9333EA"
              emissiveIntensity={0.3}
              metalness={0.6}
              roughness={0.3}
              clearcoat={0.5}
              clearcoatRoughness={0.3}
              iridescence={0.8}
              iridescenceIOR={1.5}
              iridescenceThicknessRange={[100, 400]}
            />
          </mesh>
        </group>
        {/* Y axis (vertical bars) */}
        <mesh position={[-1, 0, 1]}>
          <boxGeometry args={[barThickness, barLength, barThickness]} />
          <meshStandardMaterial color={colorY} />
        </mesh>
        <mesh position={[1, 0, 1]}>
          <boxGeometry args={[barThickness, barLength, barThickness]} />
          <meshStandardMaterial color={colorY} />
        </mesh>
        <mesh position={[-1, 0, -1]}>
          <boxGeometry args={[barThickness, barLength, barThickness]} />
          <meshStandardMaterial color={colorY} />
        </mesh>
        <mesh position={[1, 0, -1]}>
          <boxGeometry args={[barThickness, barLength, barThickness]} />
          <meshStandardMaterial color={colorY} />
        </mesh>
        {/* X axis (horizontal bars) */}
        <mesh position={[0, 1, 1]}>
          <boxGeometry args={[barLength, barThickness, barThickness]} />
          <meshStandardMaterial color={colorX} />
        </mesh>
        <mesh position={[0, -1, 1]}>
          <boxGeometry args={[barLength, barThickness, barThickness]} />
          <meshStandardMaterial color={colorX} />
        </mesh>
        <mesh position={[0, 1, -1]}>
          <boxGeometry args={[barLength, barThickness, barThickness]} />
          <meshStandardMaterial color={colorX} />
        </mesh>
        <mesh position={[0, -1, -1]}>
          <boxGeometry args={[barLength, barThickness, barThickness]} />
          <meshStandardMaterial color={colorX} />
        </mesh>
        {/* Z axis (horizontal bars) */}
        <mesh position={[1, 1, 0]}>
          <boxGeometry args={[barThickness, barThickness, barLength]} />
          <meshStandardMaterial color={colorZ} />
        </mesh>
        <mesh position={[-1, 1, 0]}>
          <boxGeometry args={[barThickness, barThickness, barLength]} />
          <meshStandardMaterial color={colorZ} />
        </mesh>
        <mesh position={[1, -1, 0]}>
          <boxGeometry args={[barThickness, barThickness, barLength]} />
          <meshStandardMaterial color={colorZ} />
        </mesh>
        <mesh position={[-1, -1, 0]}>
          <boxGeometry args={[barThickness, barThickness, barLength]} />
          <meshStandardMaterial color={colorZ} />
        </mesh>
      </group>
    );
  };