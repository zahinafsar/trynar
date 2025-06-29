"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";
import { useAuth } from "@/hooks/auth";
import { Camera, Sparkles, Zap, ArrowRight, Star } from "lucide-react";
import Image from "next/image";
import { Canvas } from "@react-three/fiber";
import { Environment, Float, PresentationControls } from "@react-three/drei";
import { AnimatedBoxScene, GalaxyEffect } from "@/components/ui/3d-effects";

const VirtualTryOn = dynamic(
  () => import("@/components/try-on").then((mod) => mod.VirtualTryOn),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[400px] flex items-center justify-center bg-gradient-to-br from-purple-900/20 to-pink-900/20 rounded-xl border border-purple-500/20">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            <div
              className="absolute inset-0 w-16 h-16 border-4 border-pink-500 border-b-transparent rounded-full animate-spin"
              style={{ animationDelay: "-0.5s" }}
            ></div>
          </div>
          <p className="text-lg font-medium bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Loading virtual try-on...
          </p>
        </div>
      </div>
    ),
  }
);

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="flex flex-col bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      {/* Hero Section */}
      <div className="h-screen flex flex-col items-center justify-center relative overflow-hidden">
        <GalaxyEffect />

        {/* Simple bolt badge */}
        <div className="absolute top-8 right-8 z-20">
          <div className="w-24 h-24 relative bg-gradient-to-br from-purple-600 to-pink-600 rounded-full p-2 shadow-lg">
            <Image
              src="/bolt.png"
              alt="Bolt"
              width={40}
              height={40}
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        <div className="w-full max-w-6xl text-center relative z-10">
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
                  <AnimatedBoxScene />
                </Float>
              </PresentationControls>
              <Environment preset="city" />
            </Canvas>
          </div>

          {/* Content */}
          <div>
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 rounded-full border border-purple-500/30">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span className="text-sm font-medium text-purple-300">
                  Next Generation AR Technology
                </span>
              </div>

              <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold">
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  AI Powered Virtual Try-On
                </span>
              </h1>

              <p className="text-xl sm:text-2xl max-w-3xl mx-auto text-gray-300 leading-relaxed">
                Transform your products with cutting-edge 3D modeling and
                immersive AR experiences. Let your customers try before they
                buy.
              </p>
            </div>

            {/* Feature highlights */}
            <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto mt-6 mb-10">
              {[
                { icon: Star, text: "AI-Generated 3D Models" },
                { icon: Camera, text: "Real-time AR Try-On" },
                { icon: Zap, text: "Instant Processing" },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10"
                >
                  <feature.icon className="w-4 h-4 text-purple-400" />
                  <span className="text-sm text-gray-300">{feature.text}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            {!user ? (
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-6 text-lg font-semibold rounded-xl"
              >
                <Link href="/login" className="flex items-center gap-2">
                  <span>Get Started</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
            ) : (
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-6 text-lg font-semibold rounded-xl"
              >
                <Link href="/dashboard" className="flex items-center gap-2">
                  <span>Go to Dashboard</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Virtual Try-On Section */}
      <div className="relative py-24 bg-gradient-to-b from-slate-950/50 to-purple-950/30 overflow-hidden">
        <div className="relative z-10 max-w-7xl mx-auto px-4">
          {/* Section Title */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 rounded-full">
                <Camera className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-4xl sm:text-5xl font-bold">
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Virtual Try-On Studio
                </span>
              </h2>
            </div>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Experience the future of shopping with our advanced virtual try-on
              technology. Test different accessories using real-time face
              detection and immersive AR overlay.
            </p>
          </div>

          {/* Main Content */}
          <div className="flex flex-col lg:flex-row gap-12 items-start justify-center w-full">
            <div className="flex-1 min-w-[720px] bg-purple-900/30 rounded-3xl border border-purple-500/20 overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-purple-500/20 bg-gradient-to-r from-slate-900/80 to-purple-900/80">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <Camera className="h-6 w-6 text-purple-400" />
                  <span className="font-semibold text-lg text-white">
                    Live Camera Feed
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-sm text-gray-400">REC</span>
                </div>
              </div>
              <div className="relative aspect-video">
                <VirtualTryOn
                  canvasStyle={{ transform: "translateY(-20px)" }}
                />
              </div>
            </div>

            {/* Feature cards */}
            <div className="flex-1 space-y-6">
              {[
                {
                  title: "Real-time Detection",
                  description:
                    "Advanced AI algorithms detect facial features and accessories in real-time",
                  icon: Camera,
                  color: "from-blue-500 to-cyan-500",
                },
                {
                  title: "3D Model Generation",
                  description:
                    "Create high-quality 3D models from simple product images",
                  icon: Star,
                  color: "from-purple-500 to-pink-500",
                },
                {
                  title: "Instant Try-On",
                  description:
                    "See how products look on you instantly with AR technology",
                  icon: Zap,
                  color: "from-orange-500 to-red-500",
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="p-6 bg-gradient-to-br from-slate-900/50 to-purple-900/30 rounded-2xl border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`p-3 rounded-xl bg-gradient-to-r ${feature.color}`}
                    >
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-gray-300 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
