import React, { useRef, useState } from "react";
import "@tensorflow/tfjs";
import "@tensorflow/tfjs-backend-webgl";
import "@mediapipe/face_mesh";
import Webcam from "react-webcam";
import { runDetector } from "./detector";

const inputResolution = {
  width: 1080,
  height: 900,
};

export const VirtualTryOn = () => {
  const canvasRef = useRef(null);
  const [loaded, setLoaded] = useState(false);

  const handleVideoLoad = (videoNode: any) => {
    const video = videoNode.target;
    if (video.readyState !== 4) return;
    if (loaded) return;
    runDetector(video, canvasRef.current);
    setLoaded(true);
  };
  
  return (
    <div>
      <div style={{ transform: "scaleX(-1)" }}>
        <Webcam
          width={inputResolution.width}
          height={inputResolution.height}
          style={{ position: "absolute" }}
          videoConstraints={{
            width: inputResolution.width,
            height: inputResolution.height,
            facingMode: "user"
          }}
          onLoadedData={handleVideoLoad}
        />
        <canvas
          ref={canvasRef}
          width={inputResolution.width}
          height={inputResolution.height}
          style={{ position: "absolute", pointerEvents: "none" }}
        />
      </div>
      {loaded ? <></> : <header>Loading...</header>}
    </div>
  );
}