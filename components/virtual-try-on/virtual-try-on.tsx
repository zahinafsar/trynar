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
  image: string;
  scale: number;
  offsetX: number;
  offsetY: number;
}

const virtualItems: VirtualItem[] = [
  {
    id: '1',
    name: 'Classic Sunglasses',
    type: 'glasses',
    image: '/api/placeholder/glasses1.png',
    scale: 1.2,
    offsetX: 0,
    offsetY: -10,
  },
  {
    id: '2',
    name: 'Aviator Sunglasses',
    type: 'glasses',
    image: '/api/placeholder/glasses2.png',
    scale: 1.3,
    offsetX: 0,
    offsetY: -8,
  },
  {
    id: '3',
    name: 'Baseball Cap',
    type: 'hat',
    image: '/api/placeholder/hat1.png',
    scale: 1.5,
    offsetX: 0,
    offsetY: -40,
  },
  {
    id: '4',
    name: 'Face Mask',
    type: 'mask',
    image: '/api/placeholder/mask1.png',
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
  const [showLandmarks, setShowLandmarks] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Simple face detection using basic computer vision techniques
  const detectFace = useCallback((canvas: HTMLCanvasElement, video: HTMLVideoElement) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // Draw video frame to canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Get image data for processing
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    // Simple skin tone detection for face approximation
    let minX = canvas.width, minY = canvas.height, maxX = 0, maxY = 0;
    let facePixels = 0;
    
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      
      // Basic skin tone detection
      if (r > 95 && g > 40 && b > 20 && 
          Math.max(r, g, b) - Math.min(r, g, b) > 15 &&
          Math.abs(r - g) > 15 && r > g && r > b) {
        
        const x = (i / 4) % canvas.width;
        const y = Math.floor((i / 4) / canvas.width);
        
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
        facePixels++;
      }
    }
    
    // If we found enough face pixels, return face bounds
    if (facePixels > 1000) {
      const width = maxX - minX;
      const height = maxY - minY;
      
      // Estimate landmarks based on face bounds
      const centerX = minX + width / 2;
      const centerY = minY + height / 2;
      
      return {
        x: minX,
        y: minY,
        width,
        height,
        landmarks: {
          leftEye: { x: centerX - width * 0.2, y: centerY - height * 0.1 },
          rightEye: { x: centerX + width * 0.2, y: centerY - height * 0.1 },
          nose: { x: centerX, y: centerY },
          mouth: { x: centerX, y: centerY + height * 0.2 },
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
        videoRef.current.play();
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

  const processFrame = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    if (!video || !canvas || !isActive) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas size to match video
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    
    // Flip the canvas horizontally for mirror effect
    ctx.save();
    ctx.scale(-1, 1);
    ctx.translate(-canvas.width, 0);
    
    // Draw video frame
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Detect face
    const face = detectFace(canvas, video);
    setFaceDetection(face);
    
    // Draw virtual item if face is detected
    if (face && selectedItem) {
      const scale = itemScale[0] * selectedItem.scale;
      const opacity = itemOpacity[0];
      
      ctx.globalAlpha = opacity;
      
      // Calculate item position based on type
      let itemX, itemY, itemWidth, itemHeight;
      
      switch (selectedItem.type) {
        case 'glasses':
          itemWidth = face.width * scale;
          itemHeight = itemWidth * 0.4; // Aspect ratio for glasses
          itemX = face.x + face.width / 2 - itemWidth / 2 + selectedItem.offsetX;
          itemY = face.y + face.height * 0.35 + selectedItem.offsetY;
          break;
          
        case 'hat':
          itemWidth = face.width * scale;
          itemHeight = itemWidth * 0.8;
          itemX = face.x + face.width / 2 - itemWidth / 2 + selectedItem.offsetX;
          itemY = face.y - itemHeight * 0.7 + selectedItem.offsetY;
          break;
          
        case 'mask':
          itemWidth = face.width * scale;
          itemHeight = itemWidth * 0.6;
          itemX = face.x + face.width / 2 - itemWidth / 2 + selectedItem.offsetX;
          itemY = face.y + face.height * 0.4 + selectedItem.offsetY;
          break;
          
        default:
          itemWidth = face.width * scale;
          itemHeight = face.height * scale;
          itemX = face.x + selectedItem.offsetX;
          itemY = face.y + selectedItem.offsetY;
      }
      
      // Create a placeholder colored rectangle for the virtual item
      // In a real implementation, you would load and draw actual images
      ctx.fillStyle = selectedItem.type === 'glasses' ? 'rgba(0, 0, 0, 0.7)' :
                     selectedItem.type === 'hat' ? 'rgba(255, 0, 0, 0.7)' :
                     selectedItem.type === 'mask' ? 'rgba(0, 255, 0, 0.7)' :
                     'rgba(0, 0, 255, 0.7)';
      
      if (selectedItem.type === 'glasses') {
        // Draw glasses frames
        const frameWidth = itemWidth * 0.4;
        const frameHeight = itemHeight * 0.8;
        const bridgeWidth = itemWidth * 0.1;
        
        // Left lens
        ctx.fillRect(itemX, itemY, frameWidth, frameHeight);
        // Right lens
        ctx.fillRect(itemX + itemWidth - frameWidth, itemY, frameWidth, frameHeight);
        // Bridge
        ctx.fillRect(itemX + frameWidth, itemY + frameHeight * 0.1, bridgeWidth, frameHeight * 0.2);
      } else {
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
          ctx.arc(point.x, point.y, 3, 0, 2 * Math.PI);
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
                        {item.name}
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
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}