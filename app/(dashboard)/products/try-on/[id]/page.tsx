"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Play, Square } from "lucide-react";

import { Button } from "@/components/ui/button";
import { VirtualTryOn } from "@/components/virtual-try-on";

export default function ARTryOnPage() {
  const params = useParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isCameraActive, setIsCameraActive] = useState(false);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleStartCamera = () => {
    setIsCameraActive(true);
  };

  const handleStopCamera = () => {
    setIsCameraActive(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-6"
        >
          <div className="relative">
            <div className="h-20 w-20 rounded-full border-4 border-primary border-t-transparent animate-spin" />
            <div className="absolute inset-0 h-20 w-20 rounded-full border-4 border-primary/20" />
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Initializing AR Experience</h2>
            <p className="text-muted-foreground">Loading 3D models and camera systems...</p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-sm border-b">
        <div className="flex items-center justify-between p-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="font-semibold">AR Try-On</h1>
          <div className="w-10" /> {/* Spacer for centering */}
        </div>
      </div>

      {/* Main AR View */}
      <div className="h-screen pt-20 pb-24">
        {isCameraActive ? (
          <VirtualTryOn showHeader={false} />
        ) : (
          <div className="h-full flex items-center justify-center bg-muted/30">
            <div className="text-center space-y-6">
              <div className="w-24 h-24 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                <Play className="h-12 w-12 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-2">Ready to Try On</h2>
                <p className="text-muted-foreground">
                  Start your camera to begin the AR experience
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Controls */}
      <div className="absolute bottom-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-sm border-t">
        <div className="p-6 flex justify-center">
          {!isCameraActive ? (
            <Button 
              size="lg" 
              onClick={handleStartCamera}
              className="px-12 py-4 text-lg"
            >
              <Play className="mr-3 h-6 w-6" />
              Start AR Experience
            </Button>
          ) : (
            <Button 
              size="lg" 
              variant="destructive"
              onClick={handleStopCamera}
              className="px-12 py-4 text-lg"
            >
              <Square className="mr-3 h-6 w-6" />
              Stop Camera
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}