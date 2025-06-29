"use client";

import React, { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import { runDetector } from "./detector";
import { Card, CardContent } from "../ui/card";
import { Loader2 } from "lucide-react";

interface VirtualMirrorProps {
  selectedModel?: string;
  scale?: number;
  opacity?: number;
  generatedImageUrl?: string | null;
}

export const VirtualTryOn: React.FC<VirtualMirrorProps> = ({
  scale = 1,
  opacity = 0.9,
  generatedImageUrl,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const webcamRef = useRef<Webcam>(null);
  const [isDetectorLoaded, setIsDetectorLoaded] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [inputResolution, setInputResolution] = useState({
    width: 1080,
    height: 1080,
  });

  // Update resolution when container size changes
  useEffect(() => {
    const updateResolution = () => {
      if (containerRef.current) {
        const { clientWidth, clientHeight } = containerRef.current;
        setInputResolution({
          width: clientWidth,
          height: clientHeight,
        });
      }
    };

    // Initial resolution update
    updateResolution();

    // Set up resize observer to handle container size changes
    const resizeObserver = new ResizeObserver(updateResolution);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    // Cleanup
    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  // Load browser-only dependencies on client side
  useEffect(() => {
    setIsClient(true);

    // Dynamically import browser-only libraries
    const loadDependencies = async () => {
      try {
        await import("@tensorflow/tfjs");
        await import("@tensorflow/tfjs-backend-webgl");
        await import("@mediapipe/face_mesh");
      } catch (err) {
        console.error("Failed to load dependencies:", err);
      }
    };

    loadDependencies();
  }, []);

  const handleVideoLoad = (videoNode: any) => {
    if (!isClient) return;

    const video = videoNode.target;
    if (video.readyState !== 4) return;

    setIsDetectorLoaded(false);

    if (canvasRef.current) {
      runDetector(
        video,
        canvasRef.current,
        () => {
          setIsDetectorLoaded(true);
        },
        () => {}, // Face detection callback - simplified
        { scale, opacity, generatedImageUrl }
      );
    }
  };

  const handleUserMediaError = (error: any) => {
    console.error("Camera error:", error);
  };

  return (
    <div
      className="absolute inset-0 flex items-center justify-center"
      ref={containerRef}
    >
      <div className="w-full h-full relative">
        {/* Loading overlay for detector */}
        {!isDetectorLoaded && isClient && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/50 z-10">
            <Card className="w-64 bg-background/50">
              <CardContent className="flex flex-col items-center justify-center p-4 space-y-2">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground text-center">
                  Initializing face detection...
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="w-full h-full" style={{ transform: "scaleX(-1)" }}>
          <Webcam
            ref={webcamRef}
            width={inputResolution.width}
            height={inputResolution.height}
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
            videoConstraints={{
              width: inputResolution.width,
              height: inputResolution.height,
              facingMode: "user",
            }}
            onLoadedData={handleVideoLoad}
            onUserMediaError={handleUserMediaError}
          />
          <canvas
            ref={canvasRef}
            width={inputResolution.width}
            height={inputResolution.height}
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              pointerEvents: "none",
            }}
          />
        </div>
      </div>
    </div>
  );
};
