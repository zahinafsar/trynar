// Single landmark indices for each feature
const LEFT_EYE_INDEX = 159; // Center of left eye (more accurate)
const RIGHT_EYE_INDEX = 386; // Center of right eye (more accurate)

const imageWidth = 250;
const imageHeight = 250;

export const Object3D = (
  prediction: any,
  ctx: any,
  options?: {
    scale: number;
    opacity: number;
    generatedImageUrl?: string | null;
  }
) => {
  if (!prediction) return;
  const keyPoints = prediction.keypoints;
  if (!keyPoints) return;

  const {
    scale = 1,
    opacity = 0.9,
    generatedImageUrl = `${window.location.origin}/sunglass.png`,
  } = options || {};

  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  // Get eye positions
  const leftEye = keyPoints[LEFT_EYE_INDEX];
  const rightEye = keyPoints[RIGHT_EYE_INDEX];

  // Calculate sunglasses position and size
  const eyeDistance = Math.sqrt(
    Math.pow(rightEye.x - leftEye.x, 2) + Math.pow(rightEye.y - leftEye.y, 2)
  );

  // Use generated image if provided, otherwise use default sunglasses
  const imageToUse = new Image();

  if (generatedImageUrl) {
    console.log(
      "Using generated image:",
      generatedImageUrl.substring(0, 50) + "..."
    );

    // Handle both URL and base64 formats
    if (
      generatedImageUrl.startsWith("data:image/") ||
      generatedImageUrl.startsWith("http")
    ) {
      imageToUse.src = generatedImageUrl;
    } else {
      // Assume it's a base64 string without data URL prefix
      imageToUse.src = `data:image/png;base64,${generatedImageUrl}`;
    }
    imageToUse.width = imageWidth; // Configure base width for scaling
    imageToUse.height = imageHeight; // Configure base height for scaling

    // Add success handler for generated image
    imageToUse.onload = () => {
      console.log("Generated image loaded successfully");
    };
  } else {
    console.log("Using default sunglasses image");
  }

  // Draw sunglasses - only draw if image is loaded or if it's the default image
  const isImageReady = imageToUse.complete;

  if (isImageReady) {
    // Calculate the angle between eyes for rotation
    const angle = Math.atan2(rightEye.y - leftEye.y, rightEye.x - leftEye.x);

    // Scale based on eye distance and user preference
    const baseScale = eyeDistance / 120;
    const finalScale = baseScale * scale;
    const width = imageToUse.width * finalScale;
    const height = imageToUse.height * finalScale;

    // Center position between eyes, with vertical offset
    const centerX = (leftEye.x + rightEye.x) / 2;
    const centerY = (leftEye.y + rightEye.y) / 2 + 40;

    // Save the current canvas state
    ctx.save();

    // Set opacity
    ctx.globalAlpha = opacity;

    // Translate to the center point
    ctx.translate(centerX, centerY);

    // Rotate the canvas
    ctx.rotate(angle);

    // Draw the image centered
    ctx.drawImage(
      imageToUse,
      -width / 2, // Center horizontally
      -height / 2, // Center vertically
      width,
      height
    );

    // Restore the canvas state
    ctx.restore();
  }
};
