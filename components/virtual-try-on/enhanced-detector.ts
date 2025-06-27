import * as faceLandmarksDetection from "@tensorflow-models/face-landmarks-detection";
import { enhancedObject3D } from "./enhanced-object";

interface DetectorOptions {
  scale?: number;
  opacity?: number;
}

export const runDetector = async (
  video: any, 
  canvas: any, 
  onLoad?: () => void,
  onFaceDetected?: (detected: boolean) => void,
  options: DetectorOptions = {}
) => {
  const model = faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh;
  const detector = await faceLandmarksDetection.createDetector(
    model,
    {
      runtime: "tfjs",
      refineLandmarks: true,
    }
  );
  
  onLoad?.();
  
  const detect = async (net: any) => {
    const estimationConfig = { flipHorizontal: false };
    const faces = await net.estimateFaces(video, estimationConfig);
    const ctx = canvas.getContext("2d");
    
    // Clear previous frame
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const faceDetected = faces.length > 0;
    onFaceDetected?.(faceDetected);
    
    if (faceDetected) {
      requestAnimationFrame(() => enhancedObject3D(faces[0], ctx, options));
    }
    
    detect(detector);
  };
  
  detect(detector);
};