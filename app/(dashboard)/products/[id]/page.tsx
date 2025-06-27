"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  Share2, 
  Eye, 
  Smartphone, 
  Download,
  Code,
  Link as LinkIcon,
  Sparkles,
  Zap,
  Star,
  Copy,
  ExternalLink
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface ProductData {
  id: string;
  name: string;
  description: string;
  category: string;
  originalImage: string;
  generatedImage: string;
  arModelUrl: string;
  features: string[];
  stats: {
    views: number;
    tryOns: number;
    rating: number;
  };
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [product, setProduct] = useState<ProductData | null>(null);
  const [activeImage, setActiveImage] = useState<'original' | 'generated'>('generated');
  const [showEmbedCode, setShowEmbedCode] = useState(false);

  useEffect(() => {
    // Simulate loading product data
    const loadProduct = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setProduct({
        id: params.id as string,
        name: "Premium Blue Sunglasses",
        description: "High-quality sunglasses with UV protection and polarized lenses. Perfect for outdoor activities and everyday wear. Features a durable frame and comfortable fit.",
        category: "Sunglasses",
        originalImage: "https://images.pexels.com/photos/701877/pexels-photo-701877.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        generatedImage: "https://images.pexels.com/photos/1674666/pexels-photo-1674666.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        arModelUrl: "/models/sunglasses-ar.glb",
        features: [
          "UV400 Protection",
          "Polarized Lenses",
          "Lightweight Frame",
          "Anti-Scratch Coating",
          "Adjustable Nose Pads"
        ],
        stats: {
          views: 1247,
          tryOns: 89,
          rating: 4.8
        }
      });
      
      setIsLoading(false);
    };
    
    loadProduct();
  }, [params.id]);

  const getEmbedCode = () => {
    const baseUrl = window.location.origin;
    return `<iframe src="${baseUrl}/try-on/${product?.id}" width="100%" height="600" frameborder="0" allowfullscreen></iframe>`;
  };

  const getArLink = () => {
    return `${window.location.origin}/try-on/${product?.id}`;
  };

  const handleCopyEmbedCode = () => {
    navigator.clipboard.writeText(getEmbedCode());
    toast({
      title: "Embed code copied",
      description: "The iframe embed code has been copied to your clipboard.",
    });
  };

  const handleCopyArLink = () => {
    navigator.clipboard.writeText(getArLink());
    toast({
      title: "AR link copied",
      description: "The AR try-on link has been copied to your clipboard.",
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product?.name,
        text: `Check out this AR try-on experience for ${product?.name}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied",
        description: "Product link has been copied to your clipboard.",
      });
    }
  };

  const handleDownload = () => {
    toast({
      title: "Download started",
      description: "AR model is being downloaded.",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-16 w-16 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          <p className="text-lg font-medium">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Product not found</h1>
          <p className="text-muted-foreground mb-4">The product you&apos;re looking for doesn&apos;t exist.</p>
          <Button onClick={() => router.back()}>Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{product.name}</h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="secondary">{product.category}</Badge>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">{product.stats.rating}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={handleShare}>
            <Share2 className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleDownload}>
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Image Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-4"
        >
          <Card className="overflow-hidden bg-gradient-to-br from-background via-background to-muted/20">
            <CardContent className="p-0">
              <div className="relative aspect-square">
                <Image
                  src={activeImage === 'original' ? product.originalImage : product.generatedImage}
                  alt={product.name}
                  className="object-cover transition-all duration-500"
                  fill
                />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-primary/90 backdrop-blur-sm">
                    {activeImage === 'original' ? 'Original' : 'AI Enhanced'}
                    {activeImage === 'generated' && <Sparkles className="ml-1 h-3 w-3" />}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Image Toggle */}
          <div className="flex gap-2">
            <Button
              variant={activeImage === 'original' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveImage('original')}
              className="flex-1"
            >
              Original Image
            </Button>
            <Button
              variant={activeImage === 'generated' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveImage('generated')}
              className="flex-1"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              AI Enhanced
            </Button>
          </div>
        </motion.div>

        {/* Product Info */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          {/* Stats and Description */}
          {/* <Card className="bg-gradient-to-r from-primary/5 to-purple-500/5 border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="text-2xl font-bold text-primary">
                  AR Experience
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    {product.stats.views}
                  </div>
                  <div className="flex items-center gap-1">
                    <Smartphone className="h-4 w-4" />
                    {product.stats.tryOns}
                  </div>
                </div>
              </div>
              
              <p className="text-muted-foreground mb-6">
                {product.description}
              </p>

              <div className="flex gap-3">
                <Button asChild className="flex-1">
                  <Link href={`/try-on/${product.id}`}>
                    <Smartphone className="mr-2 h-4 w-4" />
                    Try in AR
                  </Link>
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowEmbedCode(!showEmbedCode)}
                >
                  <Code className="mr-2 h-4 w-4" />
                  Embed
                </Button>
              </div>
            </CardContent>
          </Card> */}

          {/* Embed & Share Options */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LinkIcon className="h-5 w-5 text-primary" />
                Share & Embed
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* AR Link */}
              <div className="space-y-2">
                <Label htmlFor="ar-link">AR Try-On Link</Label>
                <div className="flex gap-2">
                  <Input
                    id="ar-link"
                    value={getArLink()}
                    readOnly
                    className="font-mono text-sm"
                  />
                  <Button variant="outline" size="icon" onClick={handleCopyArLink}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Embed Code */}
              <div className="space-y-2">
                <Label htmlFor="embed-code">Embed Code (iframe)</Label>
                <div className="space-y-2">
                  <Textarea
                    id="embed-code"
                    value={getEmbedCode()}
                    readOnly
                    className="font-mono text-sm resize-none"
                    rows={3}
                  />
                  <Button variant="outline" size="sm" onClick={handleCopyEmbedCode} className="w-full">
                    <Copy className="mr-2 h-4 w-4" />
                    Copy Embed Code
                  </Button>
                </div>
              </div>

              {/* Quick Actions */}
              <Separator />
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm" onClick={handleShare}>
                  <Share2 className="mr-2 h-4 w-4" />
                  Share Link
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/try-on/${product.id}`} target="_blank">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Open AR
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* AR Model Info */}
          <Card className="bg-gradient-to-r from-green-500/5 to-blue-500/5 border-green-500/20">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <Smartphone className="h-5 w-5 text-green-500" />
                AR Ready
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                This product has been optimized for augmented reality try-on experiences.
                Compatible with any device
              </p>
              <div className="flex items-center gap-2 text-sm">
                <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                  ✓ Face Detection
                </Badge>
                <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
                  ✓ Real-time Tracking
                </Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}