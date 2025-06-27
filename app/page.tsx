"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, PresentationControls } from "@react-three/drei";
import { Button } from "@/components/ui/button";
import { Group } from "three";
import dynamic from "next/dynamic";
import { useAuth } from "@/hooks/auth";
import { Camera } from "lucide-react";
import Image from "next/image";

const VirtualTryOn = dynamic(
  () => import("@/components/try-on").then((mod) => mod.VirtualTryOn),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[400px] flex items-center justify-center bg-muted/30">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-lg font-medium">Loading virtual try-on...</p>
        </div>
      </div>
    ),
  }
);

function Object3D() {
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
}

export default function Home() {
  const { user } = useAuth();
  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden bg-gradient-to-b from-background to-background/80">
        <motion.div
          animate={{ y: [-5, 5, -5] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-8 right-8 z-20 group"
          whileHover={{
            scale: 1.1,
            rotateY: 15,
            rotateX: 5,
            transition: { duration: 0.3 },
          }}
          style={{
            perspective: "1000px",
            transformStyle: "preserve-3d",
          }}
        >
          <div className="w-24 h-24 relative">
            <Image
              src="/bolt.png"
              alt="Lightning Bolt"
              width={48}
              height={48}
              className="w-full h-full object-contain drop-shadow-2xl filter brightness-110 contrast-125"
              style={{
                filter:
                  "drop-shadow(0 10px 20px rgba(147, 51, 234, 0.4)) drop-shadow(0 5px 10px rgba(168, 85, 247, 0.3))",
                transform: "translateZ(5px)",
              }}
            />
          </div>
        </motion.div>

        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden opacity-50">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-800 via-violet-900 to-slate-900 opacity-70" />
          <div className="absolute inset-0">
            <div className="absolute inset-0 [background:radial-gradient(white,_transparent_1px)_0_0_/_8px_8px] opacity-20" />
          </div>
        </div>

        <div className="w-full max-w-5xl text-center space-y-12 relative z-10">
          {/* 3D Canvas */}
          <div className="h-[280px] w-full">
            <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
              <ambientLight intensity={0.5} />
              <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
              <PresentationControls
                global
                rotation={[0.13, 0.1, 0]}
                polar={[-0.4, 0.2]}
                azimuth={[-1, 0.75]}
                config={{ mass: 2, tension: 400 }}
                snap={{ mass: 4, tension: 400 }}
              >
                <Float rotationIntensity={0.5}>
                  <Object3D />
                </Float>
              </PresentationControls>
              <Environment preset="city" />
            </Canvas>
          </div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6 !mt-0"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400">
              AI powered AR
            </h1>
            <p className="text-xl max-w-2xl mx-auto">
              Generate 3D models for your products and enable AR try-on for your
              customers.
            </p>
            {!user ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                <Button
                  asChild
                  size="lg"
                  className="bg-primary/90 hover:bg-primary backdrop-blur-sm"
                >
                  <Link href="/login">Login</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="bg-background/50 hover:bg-background/80 backdrop-blur-sm"
                >
                  <Link href="/register">Register</Link>
                </Button>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
              >
                <Button
                  asChild
                  size="lg"
                  className="bg-primary/90 hover:bg-primary backdrop-blur-sm mb-8"
                >
                  <Link href="/dashboard">Go to Dashboard</Link>
                </Button>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>

      <div className="relative py-24 bg-gradient-to-b from-background to-background/95 overflow-hidden">
        <div className="relative z-10 max-w-6xl mx-auto px-4">
          {/* Section Title */}
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 p-3 rounded-full">
                <Camera className="h-7 w-7 text-white" />
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">
                Virtual Try-On Studio
              </h2>
            </div>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
              Experience our advanced virtual try-on technology. Test different
              accessories using real-time face detection and AR overlay.
            </p>
          </div>

          {/* Main Content: Two Cards Side by Side */}
          <div className="flex flex-col md:flex-row gap-8 items-start justify-center w-full">
            <div className="flex-1 min-w-[720px] bg-background rounded-2xl border border-border shadow-lg overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-background/80">
                <div className="flex items-center gap-2">
                  <Camera className="h-8 w-8 text-primary" />
                  <span className="font-semibold text-lg">Camera View</span>
                </div>
              </div>
              <div className="relative w-full aspect-video bg-black flex items-center justify-center">
                <VirtualTryOn />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
