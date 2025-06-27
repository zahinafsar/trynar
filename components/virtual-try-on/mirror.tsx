import React, { useEffect, useRef, useState } from "react";
import "@tensorflow/tfjs";
import "@tensorflow/tfjs-backend-webgl";
import "@mediapipe/face_mesh";
import Webcam from "react-webcam";
import { runDetector } from "./detector";

export const Mirror = () => {
  const canvasRef = useRef(null);
  const [isDetectorLoaded, setIsDetectorLoaded] = useState(false);
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

  const handleVideoLoad = (videoNode: any) => {
    const video = videoNode.target;
    if (video.readyState !== 4) return;
    setIsDetectorLoaded(false);
    runDetector(video, canvasRef.current, () => {
      setIsDetectorLoaded(true);
    });
  };

  return (
    <div className="w-full h-full relative" ref={containerRef}>
      {!isDetectorLoaded && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
            <p className="text-white text-lg font-medium">Initializing face detector...</p>
          </div>
        </div>
      )}
      <div className="w-full h-full" style={{ transform: "scaleX(-1)" }}>
        <Webcam
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
  );
};
