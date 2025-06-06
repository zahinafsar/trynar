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

  // Simple but effective face detection
  const detectFace = useCallback((video: HTMLVideoElement) => {
    // For demo purposes, we'll use a simple center-based detection
    // In a real app, you'd use a proper face detection library
    const videoWidth = video.videoWidth || 640;
    const videoHeight = video.videoHeight || 480;
    
    // Assume face is in the center portion of the video
    const faceWidth = videoWidth * 0.3;
    const faceHeight = videoHeight * 0.4;
    const faceX = (videoWidth - faceWidth) / 2;
    const faceY = videoHeight * 0.2;
    
    return {
      x: faceX,
      y: faceY,
      width: faceWidth,
      height: faceHeight,
      landmarks: {
        leftEye: { x: faceX + faceWidth * 0.3, y: faceY + faceHeight * 0.3 },
        rightEye: { x: faceX + faceWidth * 0.7, y: faceY + faceHeight * 0.3 },
        nose: { x: faceX + faceWidth * 0.5, y: faceY + faceHeight * 0.5 },
        mouth: { x: faceX + faceWidth * 0.5, y: faceY + faceHeight * 0.7 },
      }
    };
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
        
        // Wait for video to be ready
        videoRef.current.onloadedmetadata = () => {
          if (videoRef.current) {
            videoRef.current.play();
            setIsActive(true);
          }
        };
      }
      
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
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
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
    
    if (!video || !canvas || !isActive || video.readyState !== video.HAVE_ENOUGH_DATA) {
      animationRef.current = requestAnimationFrame(processFrame);
      return;
    }
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas size to match video
    const videoWidth = video.videoWidth || 640;
    const videoHeight = video.videoHeight || 480;
    canvas.width = videoWidth;
    canvas.height = videoHeight;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw video frame with mirror effect
    ctx.save();
    ctx.scale(-1, 1);
    ctx.translate(-canvas.width, 0);
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    ctx.restore();
    
    // Detect face
    const face = detectFace(video);
    setFaceDetection(face);
    
    // Draw virtual item if face is detected
    if (face && selectedItem) {
      const scale = itemScale[0] * selectedItem.scale;
      const opacity = itemOpacity[0];
      
      ctx.save();
      ctx.globalAlpha = opacity;
      
      // Mirror the coordinates for the virtual items
      const mirroredX = canvas.width - face.x - face.width;
      
      // Calculate item position based on type
      let itemX, itemY, itemWidth, itemHeight;
      
      switch (selectedItem.type) {
        case 'glasses':
          itemWidth = face.width * scale * 0.8;
          itemHeight = itemWidth * 0.3;
          itemX = mirroredX + face.width / 2 - itemWidth / 2 + selectedItem.offsetX;
          itemY = face.y + face.height * 0.35 + selectedItem.offsetY;
          drawGlasses(ctx, itemX, itemY, itemWidth, itemHeight, selectedItem.color);
          break;
          
        case 'hat':
          itemWidth = face.width * scale;
          itemHeight = itemWidth * 0.6;
          itemX = mirroredX + face.width / 2 - itemWidth / 2 + selectedItem.offsetX;
          itemY = face.y - itemHeight * 0.5 + selectedItem.offsetY;
          drawHat(ctx, itemX, itemY, itemWidth, itemHeight, selectedItem.color);
          break;
          
        case 'mask':
          itemWidth = face.width * scale * 0.7;
          itemHeight = itemWidth * 0.4;
          itemX = mirroredX + face.width / 2 - itemWidth / 2 + selectedItem.offsetX;
          itemY = face.y + face.height * 0.5 + selectedItem.offsetY;
          drawMask(ctx, itemX, itemY, itemWidth, itemHeight, selectedItem.color);
          break;
      }
      
      ctx.restore();
    }
    
    // Draw face detection box and landmarks if enabled
    if (face && showLandmarks) {
      const mirroredX = canvas.width - face.x - face.width;
      
      ctx.strokeStyle = '#00ff00';
      ctx.lineWidth = 2;
      ctx.strokeRect(mirroredX, face.y, face.width, face.height);
      
      if (face.landmarks) {
        ctx.fillStyle = '#ff0000';
        Object.values(face.landmarks).forEach(point => {
          const mirroredPointX = canvas.width - point.x;
          ctx.beginPath();
          ctx.arc(mirroredPointX, point.y, 4, 0, 2 * Math.PI);
          ctx.fill();
        });
      }
    }
    
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
                      className="absolute inset-0 w-full h-full object-cover hidden"
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
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}