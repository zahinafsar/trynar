// Enhanced AR object rendering with better positioning and effects

// Landmark indices for precise positioning
const LEFT_EYE_INDEX = 159;
const RIGHT_EYE_INDEX = 386;
const NOSE_TIP_INDEX = 1;
const FOREHEAD_INDEX = 9;

// Load and cache sunglasses images
const sunglassesCache = new Map<string, HTMLImageElement>();

const loadSunglasses = (src: string): Promise<HTMLImageElement> => {
  if (sunglassesCache.has(src)) {
    return Promise.resolve(sunglassesCache.get(src)!);
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      sunglassesCache.set(src, img);
      resolve(img);
    };
    img.onerror = reject;
    img.src = src;
  });
};

// Preload sunglasses images
const preloadImages = async () => {
  const imageSources = [
    '/sunglass.png',
    '/sunglass-black.png',
    '/sunglass-sport.png'
  ];
  
  try {
    await Promise.all(imageSources.map(src => loadSunglasses(src)));
  } catch (error) {
    console.warn('Failed to preload some sunglasses images:', error);
  }
};

// Initialize preloading
preloadImages();

interface RenderOptions {
  scale?: number;
  opacity?: number;
  model?: string;
}

export const enhancedObject3D = async (
  prediction: any, 
  ctx: CanvasRenderingContext2D,
  options: RenderOptions = {}
) => {
  if (!prediction) return;
  
  const keyPoints = prediction.keypoints;
  if (!keyPoints) return;

  const { scale = 1, opacity = 0.9, model = '/sunglass.png' } = options;

  // Clear canvas
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  
  // Get key facial landmarks
  const leftEye = keyPoints[LEFT_EYE_INDEX];
  const rightEye = keyPoints[RIGHT_EYE_INDEX];
  const noseTip = keyPoints[NOSE_TIP_INDEX];
  const forehead = keyPoints[FOREHEAD_INDEX];
  
  if (!leftEye || !rightEye || !noseTip || !forehead) return;

  try {
    const sunglasses = await loadSunglasses(model);
    
    // Calculate face metrics
    const eyeDistance = Math.sqrt(
      Math.pow(rightEye.x - leftEye.x, 2) + 
      Math.pow(rightEye.y - leftEye.y, 2)
    );
    
    const faceHeight = Math.sqrt(
      Math.pow(forehead.x - noseTip.x, 2) + 
      Math.pow(forehead.y - noseTip.y, 2)
    );
    
    // Enhanced scaling based on face size and user preference
    const baseScale = eyeDistance / 120;
    const finalScale = baseScale * scale;
    const width = sunglasses.width * finalScale;
    const height = sunglasses.height * finalScale;
    
    // Calculate rotation angle
    const angle = Math.atan2(rightEye.y - leftEye.y, rightEye.x - leftEye.x);
    
    // Position calculation with improved offset
    const centerX = (leftEye.x + rightEye.x) / 2;
    const centerY = (leftEye.y + rightEye.y) / 2 + (height * 0.1);
    
    // Save canvas state
    ctx.save();
    
    // Set opacity
    ctx.globalAlpha = opacity;
    
    // Apply shadow for depth
    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
    ctx.shadowBlur = 8;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    
    // Transform canvas
    ctx.translate(centerX, centerY);
    ctx.rotate(angle);
    
    // Draw sunglasses with smooth edges
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    
    ctx.drawImage(
      sunglasses,
      -width / 2,
      -height / 2,
      width,
      height
    );
    
    // Restore canvas state
    ctx.restore();
    
    // Optional: Add subtle glow effect
    if (opacity > 0.8) {
      ctx.save();
      ctx.globalAlpha = 0.1;
      ctx.shadowColor = '#6366f1';
      ctx.shadowBlur = 20;
      ctx.translate(centerX, centerY);
      ctx.rotate(angle);
      ctx.drawImage(
        sunglasses,
        -width / 2,
        -height / 2,
        width,
        height
      );
      ctx.restore();
    }
    
  } catch (error) {
    console.warn('Failed to render AR object:', error);
  }
};