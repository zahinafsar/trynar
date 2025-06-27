import { Object3D } from "./object";

export const runDetector = async (
  video: HTMLVideoElement, 
  canvas: HTMLCanvasElement, 
  onLoad?: () => void, 
  onFaceDetected?: (detected: boolean) => void, 
  options?: { scale: number; opacity: number; }
) => {
  try {
    // Dynamically import face detection libraries
    const faceLandmarksDetection = await import("@tensorflow-models/face-landmarks-detection");
    
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
      
      if (faces.length > 0) {
        onFaceDetected?.(true);
        requestAnimationFrame(() => Object3D(faces[0], ctx, options));
      } else {
        onFaceDetected?.(false);
      }
      
      detect(detector);
    };
    
    detect(detector);
  } catch (error) {
    console.error('Failed to initialize face detection:', error);
  }
};
