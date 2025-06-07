import { TRIANGULATION } from "./triangulation";

// Single landmark indices for each feature
const LEFT_EYE_INDEX = 159;  // Center of left eye (more accurate)
const RIGHT_EYE_INDEX = 386; // Center of right eye (more accurate)
const NOSE_INDEX = 4;       // Bridge of nose (more stable)
const LEFT_EAR_INDEX = 234; // Top of left ear
const RIGHT_EAR_INDEX = 454; // Top of right ear

// Load sunglasses image
const sunglasses = new Image();
sunglasses.src = '/sunglass.png';
sunglasses.width = 800/3;  // Configure base width for scaling
sunglasses.height = 300/3; // Configure base height for scaling

export const drawMesh = (prediction: any, ctx: any) => {
  if (!prediction) return;
  const keyPoints = prediction.keypoints;
  if (!keyPoints) return;
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  
  // Get eye positions
  const leftEye = keyPoints[LEFT_EYE_INDEX];
  const rightEye = keyPoints[RIGHT_EYE_INDEX];
  
  // Calculate sunglasses position and size
  const eyeDistance = Math.sqrt(
    Math.pow(rightEye.x - leftEye.x, 2) + 
    Math.pow(rightEye.y - leftEye.y, 2)
  );
  
  // Draw sunglasses
  if (sunglasses.complete) {
    // Calculate the angle between eyes for rotation
    const angle = Math.atan2(rightEye.y - leftEye.y, rightEye.x - leftEye.x);
    
    // Scale based on eye distance (reduced scale for smaller size)
    const scale = eyeDistance / 120;
    const width = sunglasses.width * scale;
    const height = sunglasses.height * scale;
    
    // Center position between eyes, with vertical offset
    const centerX = (leftEye.x + rightEye.x) / 2;
    const centerY = (leftEye.y + rightEye.y) / 2 + (height * 0.15); // Added 15% of height as offset
    
    // Save the current canvas state
    ctx.save();
    
    // Translate to the center point
    ctx.translate(centerX, centerY);
    
    // Rotate the canvas
    ctx.rotate(angle);
    
    // Draw the sunglasses centered
    ctx.drawImage(
      sunglasses,
      -width / 2,  // Center horizontally
      -height / 2, // Center vertically
      width,
      height
    );
    
    // Restore the canvas state
    ctx.restore();
  }

  // Draw single dot for left eye
  ctx.beginPath();
  ctx.arc(leftEye.x, leftEye.y, 3, 0, 3 * Math.PI);
  ctx.fillStyle = "#00FFFF"; // Cyan for eyes
  ctx.fill();

  // Draw single dot for right eye
  ctx.beginPath();
  ctx.arc(rightEye.x, rightEye.y, 3, 0, 3 * Math.PI);
  ctx.fillStyle = "#00FFFF"; // Cyan for eyes
  ctx.fill();

  // Draw single dot for nose
  const nose = keyPoints[NOSE_INDEX];
  ctx.beginPath();
  ctx.arc(nose.x, nose.y, 3, 0, 3 * Math.PI);
  ctx.fillStyle = "#FF69B4"; // Pink for nose
  ctx.fill();

  // Draw single dot for left ear
  const leftEar = keyPoints[LEFT_EAR_INDEX];
  ctx.beginPath();
  ctx.arc(leftEar.x, leftEar.y, 3, 0, 3 * Math.PI);
  ctx.fillStyle = "#98FB98"; // Light green for ears
  ctx.fill();

  // Draw single dot for right ear
  const rightEar = keyPoints[RIGHT_EAR_INDEX];
  ctx.beginPath();
  ctx.arc(rightEar.x, rightEar.y, 3, 0, 3 * Math.PI);
  ctx.fillStyle = "#98FB98"; // Light green for ears
  ctx.fill();
};

const drawPath = (ctx: any, points: any, closePath: any) => {
  const region = new Path2D();
  region.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) {
    const point = points[i];
    region.lineTo(point.x, point.y);
  }
  if (closePath) region.closePath();
  ctx.stokeStyle = "black";
  ctx.stroke(region);
};
