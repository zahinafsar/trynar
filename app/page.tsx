"use client";

import { useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Environment, Float, PresentationControls } from '@react-three/drei';
import { Button } from '@/components/ui/button';
import { ArrowRight, Camera } from 'lucide-react';
import { Mesh } from 'three';
import { VirtualTryOn } from '@/components/virtual-try-on/virtual-try-on';

function IsometricCube() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = 400;
    canvas.height = 400;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Define cube parameters
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const size = 120;

    // Define the 3D cube vertices in isometric projection
    const vertices = {
      // Front face vertices
      frontTopLeft: { x: centerX - size, y: centerY - size * 0.5 },
      frontTopRight: { x: centerX, y: centerY - size },
      frontBottomLeft: { x: centerX - size, y: centerY + size * 0.5 },
      frontBottomRight: { x: centerX, y: centerY },
      
      // Back face vertices (offset for 3D effect)
      backTopLeft: { x: centerX - size * 0.5, y: centerY - size * 0.75 },
      backTopRight: { x: centerX + size * 0.5, y: centerY - size * 1.25 },
      backBottomLeft: { x: centerX - size * 0.5, y: centerY + size * 0.25 },
      backBottomRight: { x: centerX + size * 0.5, y: centerY - size * 0.25 },
    };

    // Create gradients for each face
    const leftFaceGradient = ctx.createLinearGradient(
      vertices.frontTopLeft.x, vertices.frontTopLeft.y,
      vertices.backTopLeft.x, vertices.backTopLeft.y
    );
    leftFaceGradient.addColorStop(0, '#9f7aea'); // Light purple
    leftFaceGradient.addColorStop(1, '#6b46c1'); // Medium purple

    const rightFaceGradient = ctx.createLinearGradient(
      vertices.frontTopRight.x, vertices.frontTopRight.y,
      vertices.backTopRight.x, vertices.backTopRight.y
    );
    rightFaceGradient.addColorStop(0, '#7c3aed'); // Medium purple
    rightFaceGradient.addColorStop(1, '#5b21b6'); // Dark purple

    const topFaceGradient = ctx.createLinearGradient(
      vertices.frontTopLeft.x, vertices.frontTopLeft.y,
      vertices.frontTopRight.x, vertices.frontTopRight.y
    );
    topFaceGradient.addColorStop(0, '#a78bfa'); // Light purple
    topFaceGradient.addColorStop(1, '#8b5cf6'); // Medium light purple

    // Draw left face
    ctx.beginPath();
    ctx.moveTo(vertices.frontTopLeft.x, vertices.frontTopLeft.y);
    ctx.lineTo(vertices.backTopLeft.x, vertices.backTopLeft.y);
    ctx.lineTo(vertices.backBottomLeft.x, vertices.backBottomLeft.y);
    ctx.lineTo(vertices.frontBottomLeft.x, vertices.frontBottomLeft.y);
    ctx.closePath();
    ctx.fillStyle = leftFaceGradient;
    ctx.fill();
    ctx.strokeStyle = '#4c1d95';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw right face
    ctx.beginPath();
    ctx.moveTo(vertices.frontTopRight.x, vertices.frontTopRight.y);
    ctx.lineTo(vertices.backTopRight.x, vertices.backTopRight.y);
    ctx.lineTo(vertices.backBottomRight.x, vertices.backBottomRight.y);
    ctx.lineTo(vertices.frontBottomRight.x, vertices.frontBottomRight.y);
    ctx.closePath();
    ctx.fillStyle = rightFaceGradient;
    ctx.fill();
    ctx.strokeStyle = '#4c1d95';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw top face
    ctx.beginPath();
    ctx.moveTo(vertices.frontTopLeft.x, vertices.frontTopLeft.y);
    ctx.lineTo(vertices.frontTopRight.x, vertices.frontTopRight.y);
    ctx.lineTo(vertices.backTopRight.x, vertices.backTopRight.y);
    ctx.lineTo(vertices.backTopLeft.x, vertices.backTopLeft.y);
    ctx.closePath();
    ctx.fillStyle = topFaceGradient;
    ctx.fill();
    ctx.strokeStyle = '#4c1d95';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Add subtle inner shadows for depth
    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 5;
    ctx.shadowOffsetY = 5;

    // Add highlight edges for more 3D effect
    ctx.shadowColor = 'transparent';
    ctx.strokeStyle = '#c4b5fd';
    ctx.lineWidth = 1;
    
    // Top edges highlight
    ctx.beginPath();
    ctx.moveTo(vertices.frontTopLeft.x, vertices.frontTopLeft.y);
    ctx.lineTo(vertices.backTopLeft.x, vertices.backTopLeft.y);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(vertices.frontTopLeft.x, vertices.frontTopLeft.y);
    ctx.lineTo(vertices.frontTopRight.x, vertices.frontTopRight.y);
    ctx.stroke();

  }, []);

  return (
    <canvas 
      ref={canvasRef}
      className="w-full h-full object-contain"
      style={{ maxWidth: '400px', maxHeight: '400px' }}
    />
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
          {/* 3D Isometric Cube */}
          <div className="h-[300px] w-full flex items-center justify-center">
            <IsometricCube />
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

      {/* Virtual Try-On Demo Section */}
      <div className="py-16 px-4 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center space-y-6 mb-12"
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <Camera className="h-8 w-8 text-primary" />
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                Virtual Try-On Experience
              </h2>
            </div>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Experience our cutting-edge virtual try-on technology. Test different products using your camera with real-time face detection and AR overlay.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <VirtualTryOn />
          </motion.div>
        </div>
      </div>
    </div>
  );
}