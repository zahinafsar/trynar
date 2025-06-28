// Single landmark indices for each feature
const LEFT_EYE_INDEX = 159;  // Center of left eye (more accurate)
const RIGHT_EYE_INDEX = 386; // Center of right eye (more accurate)

// Load sunglasses image
const sunglasses = new Image();
sunglasses.src = '/sunglass.png';
sunglasses.width = 800/3;  // Configure base width for scaling
sunglasses.height = 300/3; // Configure base height for scaling

export const Object3D = (prediction: any, ctx: any, options?: { scale: number; opacity: number; }) => {
  if (!prediction) return;
  const keyPoints = prediction.keypoints;
  if (!keyPoints) return;
  
  const { scale = 1, opacity = 0.9 } = options || {};
  
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
    
    // Scale based on eye distance and user preference
    const baseScale = eyeDistance / 120;
    const finalScale = baseScale * scale;
    const width = sunglasses.width * finalScale;
    const height = sunglasses.height * finalScale;
    
    // Center position between eyes, with vertical offset
    const centerX = (leftEye.x + rightEye.x) / 2;
    const centerY = (leftEye.y + rightEye.y) / 2 + (height * 0.15);
    
    // Save the current canvas state
    ctx.save();
    
    // Set opacity
    ctx.globalAlpha = opacity;
    
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
};