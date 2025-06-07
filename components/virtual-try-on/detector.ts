import * as faceLandmarksDetection from "@tensorflow-models/face-landmarks-detection";
import { Object3D } from "./object";

export const runDetector = async (video: any, canvas: any, onLoad?: () => void) => {
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
    requestAnimationFrame(() => Object3D(faces[0], ctx));
    detect(detector);
  };
  detect(detector);
};
