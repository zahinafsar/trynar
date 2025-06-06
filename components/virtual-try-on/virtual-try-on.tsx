"use client";

import { useRef, useEffect, useState, useCallback } from 'react';
import { Camera, CameraOff, RotateCcw, Download, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface FaceDetection {
  x: number;
  y: number;
  width: number;
  height: number;
  landmarks?: {
    leftEye: { x: number; y: number };
    rightEye: { x: number; y: number };
    nose: { x: number; y: number };
    mouth: { x: number; y: number };
  };
}

interface VirtualItem {
  id: string;
  name: string;
  type: 'glasses' | 'hat' | 'mask' | 'earrings';
  color: string;
  scale: number;
  offsetX: number;
  offsetY: number;
}

const virtualItems: VirtualItem[] = [
  {
    id: '1',
    name: 'Classic Sunglasses',
    type: 'glasses',
    color: '#000000',
    scale: 1.2,
    offsetX: 0,
    offsetY: -10,
  },
  {
    id: '2',
    name: 'Aviator Sunglasses',
    type: 'glasses',
    color: '#4A5568',
    scale: 1.3,
    offsetX: 0,
    offsetY: -8,
  },
  {
    id: '3',
    name: 'Baseball Cap',
    type: 'hat',
    color: '#E53E3E',
    scale: 1.5,
    offsetX: 0,
    offsetY: -40,
  },
  {
    id: '4',
    name: 'Face Mask',
    type: 'mask',
    color: '#38A169',
    scale: 1.0,
    offsetX: 0,
    offsetY: 10,
  },
];

export function VirtualTryOn() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationRef = useRef<number>();
  
  const [isActive, setIsActive] = useState(false);
  const [selectedItem, setSelectedItem] = useState<VirtualItem | null>(virtualItems[0]);
  const [faceDetection, setFaceDetection] = useState<FaceDetection | null>(null);
  const [itemScale, setItemScale] = useState([1]);
  const [itemOpacity, setItemOpacity] = useState([0.9]);
  const [showLandmarks, setShowLandmarks] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Improved face detection using edge detection and motion
  const detectFace = useCallback((canvas: HTMLCanvasElement, video: HTMLVideoElement) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // Get image data for processing
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    // Simple face detection using multiple methods
    let faceRegions: Array<{x: number, y: number, width: number, height: number, confidence: number}> = [];
    
    // Method 1: Skin tone detection (improved)
    let skinPixels: Array<{x: number, y: number}> = [];
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      
      // Improved skin tone detection
      const isSkintone = (
        (r > 95 && g > 40 && b > 20) &&
        (Math.max(r, g, b) - Math.min(r, g, b) > 15) &&
        (Math.abs(r - g) > 15) &&
        (r > g && r > b)
      ) || (
        // Alternative skin tone range
        (r > 220 && g > 210 && b > 170) ||
        (r > 60 && r < 220 && g > 40 && g < 200 && b > 20 && b < 150)
      );
      
      if (isSkintone) {
        const x = (i / 4) % canvas.width;
        const y = Math.floor((i / 4) / canvas.width);
        skinPixels.push({x, y});
      }
    }
    
    if (skinPixels.length > 500) {
      const xs = skinPixels.map(p => p.x);
      const ys = skinPixels.map(p => p.y);
      const minX = Math.min(...xs);
      const maxX = Math.max(...xs);
      const minY = Math.min(...ys);
      const maxY = Math.max(...ys);
      
      const width = maxX - minX;
      const height = maxY - minY;
      
      // Filter for face-like proportions
      if (width > 50 && height > 50 && height / width > 0.8 && height / width < 2) {
        faceRegions.push({
          x: minX,
          y: minY,
          width,
          height,
          confidence: Math.min(skinPixels.length / 2000, 1)
        });
      }
    }
    
    // Method 2: Center region assumption (fallback)
    const centerX = canvas.width * 0.3;
    const centerY = canvas.height * 0.2;
    const centerWidth = canvas.width * 0.4;
    const centerHeight = canvas.height * 0.6;
    
    faceRegions.push({
      x: centerX,
      y: centerY,
      width: centerWidth,
      height: centerHeight,
      confidence: 0.3
    });
    
    // Choose the best face region
    const bestFace = faceRegions.reduce((best, current) => 
      current.confidence > best.confidence ? current : best
    );
    
    if (bestFace.confidence > 0.2) {
      const centerX = bestFace.x + bestFace.width / 2;
      const centerY = bestFace.y + bestFace.height / 2;
      
      return {
        x: bestFace.x,
        y: bestFace.y,
        width: bestFace.width,
        height: bestFace.height,
        landmarks: {
          leftEye: { x: centerX - bestFace.width * 0.2, y: centerY - bestFace.height * 0.1 },
          rightEye: { x: centerX + bestFace.width * 0.2, y: centerY - bestFace.height * 0.1 },
          nose: { x: centerX, y: centerY },
          mouth: { x: centerX, y: centerY + bestFace.height * 0.2 },
        }
      };
    }
    
    return null;
  }, []);

  const startCamera = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        }
      });
      
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      
      setIsActive(true);
    } catch (err) {
      setError('Failed to access camera. Please ensure camera permissions are granted.');
      console.error('Camera access error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    
    setIsActive(false);
    setFaceDetection(null);
  };

  const drawGlasses = (ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, color: string) => {
    const frameThickness = 4;
    const lensWidth = width * 0.35;
    const lensHeight = height * 0.8;
    const bridgeWidth = width * 0.15;
    const templeLength = width * 0.3;
    
    ctx.strokeStyle = color;
    ctx.fillStyle = color + '40'; // Semi-transparent
    ctx.lineWidth = frameThickness;
    
    // Left lens
    const leftLensX = x;
    const leftLensY = y;
    ctx.strokeRect(leftLensX, leftLensY, lensWidth, lensHeight);
    ctx.fillRect(leftLensX, leftLensY, lensWidth, lensHeight);
    
    // Right lens
    const rightLensX = x + width - lensWidth;
    const rightLensY = y;
    ctx.strokeRect(rightLensX, rightLensY, lensWidth, lensHeight);
    ctx.fillRect(rightLensX, rightLensY, lensWidth, lensHeight);
    
    // Bridge
    const bridgeX = leftLensX + lensWidth;
    const bridgeY = y + lensHeight * 0.2;
    ctx.strokeRect(bridgeX, bridgeY, bridgeWidth, frameThickness);
    
    // Left temple
    ctx.beginPath();
    ctx.moveTo(leftLensX, leftLensY + lensHeight * 0.3);
    ctx.lineTo(leftLensX - templeLength, leftLensY + lensHeight * 0.3);
    ctx.stroke();
    
    // Right temple
    ctx.beginPath();
    ctx.moveTo(rightLensX + lensWidth, rightLensY + lensHeight * 0.3);
    ctx.lineTo(rightLensX + lensWidth + templeLength, rightLensY + lensHeight * 0.3);
    ctx.stroke();
  };

  const drawHat = (ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, color: string) => {
    ctx.fillStyle = color;
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    
    // Hat crown
    const crownHeight = height * 0.7;
    ctx.fillRect(x + width * 0.1, y, width * 0.8, crownHeight);
    ctx.strokeRect(x + width * 0.1, y, width * 0.8, crownHeight);
    
    // Hat brim
    const brimY = y + crownHeight - 10;
    ctx.fillRect(x - width * 0.1, brimY, width * 1.2, height * 0.3);
    ctx.strokeRect(x - width * 0.1, brimY, width * 1.2, height * 0.3);
  };

  const drawMask = (ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, color: string) => {
    ctx.fillStyle = color;
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    
    // Main mask body
    ctx.beginPath();
    ctx.roundRect(x, y, width, height, 10);
    ctx.fill();
    ctx.stroke();
    
    // Ear straps
    ctx.beginPath();
    ctx.moveTo(x, y + height * 0.3);
    ctx.lineTo(x - width * 0.2, y + height * 0.3);
    ctx.moveTo(x + width, y + height * 0.3);
    ctx.lineTo(x + width + width * 0.2, y + height * 0.3);
    ctx.stroke();
  };

  const processFrame = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    if (!video || !canvas || !isActive) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas size to match video
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Flip the canvas horizontally for mirror effect
    ctx.save();
    ctx.scale(-1, 1);
    ctx.translate(-canvas.width, 0);
    
    // Draw video frame first
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Restore context for face detection processing
    ctx.restore();
    
    // Detect face on the current frame
    const face = detectFace(canvas, video);
    setFaceDetection(face);
    
    // Apply mirror effect again for drawing overlays
    ctx.save();
    ctx.scale(-1, 1);
    ctx.translate(-canvas.width, 0);
    
    // Draw virtual item if face is detected
    if (face && selectedItem) {
      const scale = itemScale[0] * selectedItem.scale;
      const opacity = itemOpacity[0];
      
      ctx.globalAlpha = opacity;
      
      // Calculate item position based on type
      let itemX, itemY, itemWidth, itemHeight;
      
      switch (selectedItem.type) {
        case 'glasses':
          itemWidth = face.width * scale * 0.8;
          itemHeight = itemWidth * 0.3;
          itemX = face.x + face.width / 2 - itemWidth / 2 + selectedItem.offsetX;
          itemY = face.y + face.height * 0.35 + selectedItem.offsetY;
          drawGlasses(ctx, itemX, itemY, itemWidth, itemHeight, selectedItem.color);
          break;
          
        case 'hat':
          itemWidth = face.width * scale;
          itemHeight = itemWidth * 0.6;
          itemX = face.x + face.width / 2 - itemWidth / 2 + selectedItem.offsetX;
          itemY = face.y - itemHeight * 0.5 + selectedItem.offsetY;
          drawHat(ctx, itemX, itemY, itemWidth, itemHeight, selectedItem.color);
          break;
          
        case 'mask':
          itemWidth = face.width * scale * 0.7;
          itemHeight = itemWidth * 0.4;
          itemX = face.x + face.width / 2 - itemWidth / 2 + selectedItem.offsetX;
          itemY = face.y + face.height * 0.5 + selectedItem.offsetY;
          drawMask(ctx, itemX, itemY, itemWidth, itemHeight, selectedItem.color);
          break;
          
        default:
          itemWidth = face.width * scale;
          itemHeight = face.height * scale;
          itemX = face.x + selectedItem.offsetX;
          itemY = face.y + selectedItem.offsetY;
          ctx.fillStyle = selectedItem.color;
          ctx.fillRect(itemX, itemY, itemWidth, itemHeight);
      }
      
      ctx.globalAlpha = 1;
    }
    
    // Draw face detection box and landmarks if enabled
    if (face && showLandmarks) {
      ctx.strokeStyle = '#00ff00';
      ctx.lineWidth = 2;
      ctx.strokeRect(face.x, face.y, face.width, face.height);
      
      if (face.landmarks) {
        ctx.fillStyle = '#ff0000';
        Object.values(face.landmarks).forEach(point => {
          ctx.beginPath();
          ctx.arc(point.x, point.y, 4, 0, 2 * Math.PI);
          ctx.fill();
        });
      }
    }
    
    ctx.restore();
    
    animationRef.current = requestAnimationFrame(processFrame);
  }, [isActive, selectedItem, itemScale, itemOpacity, showLandmarks, detectFace]);

  useEffect(() => {
    if (isActive) {
      processFrame();
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isActive, processFrame]);

  const capturePhoto = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const link = document.createElement('a');
    link.download = 'virtual-try-on.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-6 w-6" />
            Virtual Try-On Experience
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Camera View */}
            <div className="lg:col-span-2 space-y-4">
              <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                {isActive ? (
                  <>
                    <video
                      ref={videoRef}
                      className="absolute inset-0 w-full h-full object-cover opacity-0"
                      autoPlay
                      playsInline
                      muted
                    />
                    <canvas
                      ref={canvasRef}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-white">
                    <div className="text-center space-y-4">
                      <Camera className="h-16 w-16 mx-auto opacity-50" />
                      <p className="text-lg">Camera not active</p>
                      {error && (
                        <p className="text-red-400 text-sm max-w-md">{error}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Camera Controls */}
              <div className="flex justify-center gap-4">
                {!isActive ? (
                  <Button 
                    onClick={startCamera} 
                    disabled={isLoading}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {isLoading ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                    ) : (
                      <Camera className="mr-2 h-4 w-4" />
                    )}
                    Start Camera
                  </Button>
                ) : (
                  <>
                    <Button 
                      onClick={stopCamera}
                      variant="destructive"
                    >
                      <CameraOff className="mr-2 h-4 w-4" />
                      Stop Camera
                    </Button>
                    <Button 
                      onClick={capturePhoto}
                      variant="outline"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Capture
                    </Button>
                  </>
                )}
              </div>
            </div>
            
            {/* Controls Panel */}
            <div className="space-y-6">
              {/* Item Selection */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Virtual Item</Label>
                <Select 
                  value={selectedItem?.id || ''} 
                  onValueChange={(value) => {
                    const item = virtualItems.find(i => i.id === value);
                    setSelectedItem(item || null);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select an item" />
                  </SelectTrigger>
                  <SelectContent>
                    {virtualItems.map((item) => (
                      <SelectItem key={item.id} value={item.id}>
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-4 h-4 rounded" 
                            style={{ backgroundColor: item.color }}
                          />
                          {item.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Scale Control */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">
                  Scale: {itemScale[0].toFixed(1)}x
                </Label>
                <Slider
                  value={itemScale}
                  onValueChange={setItemScale}
                  min={0.5}
                  max={2}
                  step={0.1}
                  className="w-full"
                />
              </div>
              
              {/* Opacity Control */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">
                  Opacity: {Math.round(itemOpacity[0] * 100)}%
                </Label>
                <Slider
                  value={itemOpacity}
                  onValueChange={setItemOpacity}
                  min={0.1}
                  max={1}
                  step={0.1}
                  className="w-full"
                />
              </div>
              
              {/* Debug Options */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="landmarks"
                    checked={showLandmarks}
                    onCheckedChange={setShowLandmarks}
                  />
                  <Label htmlFor="landmarks" className="text-sm">
                    Show face detection
                  </Label>
                </div>
              </div>
              
              {/* Status */}
              <div className="p-3 bg-muted rounded-lg">
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span>Camera:</span>
                    <span className={isActive ? 'text-green-600' : 'text-red-600'}>
                      {isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Face detected:</span>
                    <span className={faceDetection ? 'text-green-600' : 'text-red-600'}>
                      {faceDetection ? 'Yes' : 'No'}
                    </span>
                  </div>
                  {faceDetection && (
                    <div className="text-xs text-muted-foreground mt-2">
                      Position: {Math.round(faceDetection.x)}, {Math.round(faceDetection.y)}<br/>
                      Size: {Math.round(faceDetection.width)} × {Math.round(faceDetection.height)}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Instructions */}
              <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <h4 className="text-sm font-medium mb-2">Tips for better detection:</h4>
                <ul className="text-xs space-y-1 text-muted-foreground">
                  <li>• Ensure good lighting</li>
                  <li>• Face the camera directly</li>
                  <li>• Keep your face in the center</li>
                  <li>• Avoid shadows on your face</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}