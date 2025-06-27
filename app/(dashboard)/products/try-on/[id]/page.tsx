"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  Camera, 
  RotateCcw, 
  Download,
  Share2,
  Settings,
  Maximize2,
  Minimize2,
  Volume2,
  VolumeX,
  Sparkles,
  Zap
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { VirtualTryOn } from "@/components/virtual-try-on";

interface ARProduct {
  id: string;
  name: string;
  category: string;
  modelUrl: string;
  thumbnailUrl: string;
}

const availableProducts: ARProduct[] = [
  {
    id: "1",
    name: "Premium Blue Sunglasses",
    category: "Sunglasses",
    modelUrl: "/models/sunglasses.glb",
    thumbnailUrl: "https://images.pexels.com/photos/701877/pexels-photo-701877.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=1"
  },
  {
    id: "2",
    name: "Classic Black Sunglasses",
    category: "Sunglasses", 
    modelUrl: "/models/sunglasses-black.glb",
    thumbnailUrl: "https://images.pexels.com/photos/1674666/pexels-photo-1674666.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=1"
  },
  {
    id: "3",
    name: "Sport Sunglasses",
    category: "Sunglasses",
    modelUrl: "/models/sunglasses-sport.glb", 
    thumbnailUrl: "https://images.pexels.com/photos/2690323/pexels-photo-2690323.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=1"
  }
];

export default function ARTryOnPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<ARProduct | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const [modelScale, setModelScale] = useState([1]);
  const [modelOpacity, setModelOpacity] = useState([0.9]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Find the product and simulate loading
    const loadProduct = async () => {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const product = availableProducts.find(p => p.id === params.id) || availableProducts[0];
      setSelectedProduct(product);
      setIsLoading(false);
    };
    
    loadProduct();
  }, [params.id]);

  useEffect(() => {
    // Auto-hide controls after 3 seconds of inactivity
    const timer = setTimeout(() => {
      if (!isFullscreen) return;
      setShowControls(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [showControls, isFullscreen]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "AR link copied",
      description: "Share this AR experience with others!",
    });
  };

  const handleScreenshot = () => {
    toast({
      title: "Screenshot captured",
      description: "Your AR try-on has been saved to downloads.",
    });
  };

  const resetCamera = () => {
    toast({
      title: "Camera reset",
      description: "AR tracking has been reinitialized.",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-6"
        >
          <div className="relative">
            <div className="h-20 w-20 rounded-full border-4 border-primary border-t-transparent animate-spin" />
            <div className="absolute inset-0 h-20 w-20 rounded-full border-4 border-primary/20" />
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Initializing AR Experience</h2>
            <p className="text-muted-foreground">Loading 3D models and camera systems...</p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className={`relative ${isFullscreen ? 'fixed inset-0 z-50 bg-black' : 'min-h-screen'}`}
      onMouseMove={() => setShowControls(true)}
      onTouchStart={() => setShowControls(true)}
    >
      {/* Header Controls */}
      <AnimatePresence>
        {(!isFullscreen || showControls) && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`absolute top-0 left-0 right-0 z-40 ${
              isFullscreen ? 'bg-black/50 backdrop-blur-sm' : 'bg-background/80 backdrop-blur-sm border-b'
            }`}
          >
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-4">
                <Button 
                  variant={isFullscreen ? "secondary" : "ghost"} 
                  size="icon" 
                  onClick={() => router.back()}
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                {selectedProduct && (
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg overflow-hidden">
                      <img 
                        src={selectedProduct.thumbnailUrl} 
                        alt={selectedProduct.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <h1 className={`font-semibold ${isFullscreen ? 'text-white' : ''}`}>
                        {selectedProduct.name}
                      </h1>
                      <Badge variant="secondary" className="text-xs">
                        AR Try-On
                      </Badge>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                <Button 
                  variant={isFullscreen ? "secondary" : "outline"} 
                  size="icon"
                  onClick={() => setIsMuted(!isMuted)}
                >
                  {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </Button>
                <Button 
                  variant={isFullscreen ? "secondary" : "outline"} 
                  size="icon"
                  onClick={handleShare}
                >
                  <Share2 className="h-4 w-4" />
                </Button>
                <Button 
                  variant={isFullscreen ? "secondary" : "outline"} 
                  size="icon"
                  onClick={toggleFullscreen}
                >
                  {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main AR View */}
      <div className={`${isFullscreen ? 'h-screen' : 'h-screen pt-20'}`}>
        <VirtualTryOn />
      </div>

      {/* Bottom Controls */}
      <AnimatePresence>
        {(!isFullscreen || showControls) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className={`absolute bottom-0 left-0 right-0 z-40 ${
              isFullscreen ? 'bg-black/50 backdrop-blur-sm' : 'bg-background/80 backdrop-blur-sm border-t'
            }`}
          >
            <div className="p-4 space-y-4">
              {/* Quick Actions */}
              <div className="flex items-center justify-center gap-4">
                <Button 
                  variant={isFullscreen ? "secondary" : "outline"} 
                  size="icon"
                  onClick={resetCamera}
                  className="h-12 w-12"
                >
                  <RotateCcw className="h-5 w-5" />
                </Button>
                <Button 
                  size="lg"
                  onClick={handleScreenshot}
                  className="px-8"
                >
                  <Camera className="mr-2 h-5 w-5" />
                  Capture
                </Button>
                <Button 
                  variant={isFullscreen ? "secondary" : "outline"} 
                  size="icon"
                  className="h-12 w-12"
                >
                  <Download className="h-5 w-5" />
                </Button>
              </div>

              {/* Product Selector */}
              {!isFullscreen && (
                <div className="flex items-center gap-3 overflow-x-auto pb-2">
                  <span className="text-sm font-medium whitespace-nowrap">Try Different Models:</span>
                  {availableProducts.map((product) => (
                    <motion.button
                      key={product.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedProduct(product)}
                      className={`flex-shrink-0 relative h-16 w-16 rounded-lg overflow-hidden border-2 transition-all ${
                        selectedProduct?.id === product.id 
                          ? 'border-primary shadow-lg shadow-primary/25' 
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <img 
                        src={product.thumbnailUrl} 
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
                      {selectedProduct?.id === product.id && (
                        <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                          <Sparkles className="h-4 w-4 text-primary" />
                        </div>
                      )}
                    </motion.button>
                  ))}
                </div>
              )}

              {/* Advanced Controls */}
              {!isFullscreen && (
                <Card className="bg-card/50 backdrop-blur-sm">
                  <CardContent className="p-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Zap className="h-4 w-4 text-primary" />
                          <span className="text-sm font-medium">Scale</span>
                          <span className="text-xs text-muted-foreground ml-auto">
                            {Math.round(modelScale[0] * 100)}%
                          </span>
                        </div>
                        <Slider
                          value={modelScale}
                          onValueChange={setModelScale}
                          max={1.5}
                          min={0.5}
                          step={0.1}
                          className="w-full"
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Settings className="h-4 w-4 text-primary" />
                          <span className="text-sm font-medium">Opacity</span>
                          <span className="text-xs text-muted-foreground ml-auto">
                            {Math.round(modelOpacity[0] * 100)}%
                          </span>
                        </div>
                        <Slider
                          value={modelOpacity}
                          onValueChange={setModelOpacity}
                          max={1}
                          min={0.3}
                          step={0.1}
                          className="w-full"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading Overlay for Model Switching */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <div className="text-center text-white">
              <div className="h-12 w-12 rounded-full border-4 border-white border-t-transparent animate-spin mx-auto mb-4" />
              <p className="text-lg font-medium">Loading AR Model...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}