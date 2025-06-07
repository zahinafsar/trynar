import * as faceLandmarksDetection from "@tensorflow-models/face-landmarks-detection";
import { drawMesh } from "./mesh";

export const runDetector = async (video: any, canvas: any) => {
  const model = faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh;
  const detector = await faceLandmarksDetection.createDetector(
    model,
    {
      runtime: "tfjs",
      refineLandmarks: true,
    }
  );
  const detect = async (net: any) => {
    const estimationConfig = { flipHorizontal: false };
    const faces = await net.estimateFaces(video, estimationConfig);
    const ctx = canvas.getContext("2d");
    requestAnimationFrame(() => drawMesh(faces[0], ctx));
    detect(detector);
  };
  detect(detector);
};
