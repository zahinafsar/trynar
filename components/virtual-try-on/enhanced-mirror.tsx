"use client";

import React, { useEffect, useRef, useState } from "react";
import "@tensorflow/tfjs";
import "@tensorflow/tfjs-backend-webgl";
import "@mediapipe/face_mesh";
import Webcam from "react-webcam";
import { motion, AnimatePresence } from "framer-motion";
import { runDetector } from "./detector";
import { modelCache } from "./model-cache";

interface EnhancedMirrorProps {
  selectedModel?: string;
  scale?: number;
  opacity?: number;
  onModelLoad?: (loaded: boolean) => void;
}

export const EnhancedMirror: React.FC<EnhancedMirrorProps> = ({
  selectedModel = '/models/sunglasses.glb',
  scale = 1,
  opacity = 0.9,
  onModelLoad
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const webcamRef = useRef<Webcam>(null);
  const [isDetectorLoaded, setIsDetectorLoaded] = useState(false);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [faceDetected, setFaceDetected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [inputResolution, setInputResolution] = useState({
    width: 1080,
    height: 1080,
  });

  useEffect(() => {
    if (containerRef.current) {
      setInputResolution({
        width: containerRef.current.clientWidth,
        height: containerRef.current.clientHeight,
      });
    }
  }, []);

  useEffect(() => {
    // Load the selected model
    const loadModel = async () => {
      try {
        setIsModelLoaded(false);
        await modelCache.loadModel(selectedModel);
        setIsModelLoaded(true);
        onModelLoad?.(true);
      } catch (err) {
        setError('Failed to load AR model');
        onModelLoad?.(false);
      }
    };

    loadModel();
  }, [selectedModel, onModelLoad]);

  const handleVideoLoad = (videoNode: any) => {
    const video = videoNode.target;
    if (video.readyState !== 4) return;
    
    setIsDetectorLoaded(false);
    setError(null);
    
    runDetector(
      video, 
      canvasRef.current, 
      () => {
        setIsDetectorLoaded(true);
      },
      (detected: boolean) => {
        setFaceDetected(detected);
      },
      { scale, opacity }
    );
  };

  const handleUserMediaError = (error: any) => {
    console.error('Camera error:', error);
    setError('Camera access denied. Please allow camera permissions.');
  };

  return (
    <div className="w-full h-full relative" ref={containerRef}>
      {/* Loading States */}
      <AnimatePresence>
        {(!isDetectorLoaded || !isModelLoaded) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/70 flex items-center justify-center z-50"
          >
            <div className="flex flex-col items-center gap-4 text-white">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                <div className="absolute inset-0 w-16 h-16 border-4 border-white/20 rounded-full"></div>
              </div>
              <div className="text-center">
                <p className="text-lg font-medium">
                  {!isModelLoaded ? 'Loading AR Model...' : 'Initializing Face Detection...'}
                </p>
                <p className="text-sm text-white/70 mt-1">
                  {!isModelLoaded ? 'Preparing 3D assets' : 'Starting camera systems'}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error State */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 flex items-center justify-center z-50"
          >
            <div className="text-center text-white max-w-md mx-auto p-6">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚠️</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Camera Error</h3>
              <p className="text-white/80 mb-4">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-white text-black rounded-lg font-medium hover:bg-white/90 transition-colors"
              >
                Retry
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Face Detection Status */}
      <AnimatePresence>
        {isDetectorLoaded && !error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-4 left-1/2 transform -translate-x-1/2 z-40"
          >
            <div className={`px-4 py-2 rounded-full backdrop-blur-sm border transition-all ${
              faceDetected 
                ? 'bg-green-500/20 border-green-500/50 text-green-100' 
                : 'bg-yellow-500/20 border-yellow-500/50 text-yellow-100'
            }`}>
              <div className="flex items-center gap-2 text-sm font-medium">
                <div className={`w-2 h-2 rounded-full ${
                  faceDetected ? 'bg-green-400' : 'bg-yellow-400'
                } animate-pulse`} />
                {faceDetected ? 'Face Detected' : 'Looking for Face...'}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Camera View */}
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

      {/* AR Instructions */}
      <AnimatePresence>
        {isDetectorLoaded && !faceDetected && !error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-40"
          >
            <div className="bg-black/50 backdrop-blur-sm rounded-lg p-4 text-white text-center max-w-sm">
              <p className="text-sm font-medium mb-2">Position your face in the camera</p>
              <p className="text-xs text-white/70">
                Make sure your face is well-lit and clearly visible
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};