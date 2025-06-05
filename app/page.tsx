"use client";

import { useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Environment, Float, PresentationControls } from '@react-three/drei';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Mesh } from 'three';

function CubeMesh() {
  const meshRef = useRef<Mesh>(null);
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.2;
      meshRef.current.rotation.y += delta * 0.2;
    }
  });

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial
        metalness={0.8}
        roughness={0.2}
        color="#ffffff"
      />
    </mesh>
  );
}

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden bg-gradient-to-b from-background to-background/80">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-grid-white/10 bg-[size:100px_100px] [mask-image:radial-gradient(white,transparent_70%)]" />
          <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-gradient-radial from-primary/20 to-transparent opacity-50 animate-spin-slow" style={{ animationDuration: '20s' }} />
        </div>

        <div className="w-full max-w-5xl text-center space-y-12 relative z-10">
          {/* 3D Canvas */}
          <div className="h-[300px] w-full">
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
                  <CubeMesh />
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
            className="space-y-6"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/50">
              3D Model Platform
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Generate 3D models for your products and enable AR try-on for your customers.
            </p>
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
                <Link href="/login">
                  Login
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="bg-background/50 hover:bg-background/80 backdrop-blur-sm"
              >
                <Link href="/register">
                  Register
                </Link>
              </Button>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="pt-8"
            >
              <Link
                href="/dashboard"
                className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors"
              >
                Go to Dashboard
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}