"use client";

import React, { useState } from "react";
import { Camera, Play, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { EnhancedMirror } from "./enhanced-mirror";

const virtualItems = [
  { id: "glasses", name: "Sunglasses", icon: "🕶️", color: "#1a1a1a" },
  { id: "hat", name: "Baseball Cap", icon: "🧢", color: "#2563eb" },
  { id: "mask", name: "Face Mask", icon: "😷", color: "#10b981" },
];

interface VirtualTryOnProps {
  selectedModel?: string;
  scale?: number;
  opacity?: number;
  showHeader?: boolean;
}

export const VirtualTryOn: React.FC<VirtualTryOnProps> = ({
  selectedModel,
  scale = 1,
  opacity = 0.9,
  showHeader = true
}) => {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isModelLoaded, setIsModelLoaded] = useState(false);

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Header */}
      {showHeader && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="flex items-center justify-center gap-3">
            <div className="p-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500">
              <Camera className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Virtual Try-On Studio
            </h2>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Experience our advanced virtual try-on technology. Test different
            accessories using real-time face detection and AR overlay.
          </p>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className="lg:col-span-2"
      >
        <Card className="overflow-hidden">
          {showHeader && (
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Camera className="h-5 w-5" />
                  Camera View
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" className="h-8 w-8">
                    <Maximize2 className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => setIsCameraActive(!isCameraActive)}
                  >
                    <Play className="mr-2 h-4 w-4" />
                    {isCameraActive ? "Stop Camera" : "Start Camera"}
                  </Button>
                </div>
              </div>
            </CardHeader>
          )}
          <CardContent className="p-0">
            <div className="relative bg-black aspect-video">
              <div className="absolute inset-0 flex items-center justify-center bg-muted/50">
                {!isCameraActive ? (
                  <div className="text-center space-y-4">
                    <Camera className="h-16 w-16 mx-auto text-muted-foreground" />
                    <div>
                      <h3 className="text-lg font-semibold">
                        Camera Not Active
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Click "Start Camera" to begin the virtual
                        try-on experience
                      </p>
                    </div>
                  </div>
                ) : (
                  <EnhancedMirror 
                    selectedModel={selectedModel}
                    scale={scale}
                    opacity={opacity}
                    onModelLoad={setIsModelLoaded}
                  />
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};