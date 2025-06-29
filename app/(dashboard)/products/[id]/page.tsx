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
import { ModelsService } from "@/lib/models";
import { ModelRow } from "@/types/db";

interface ProductData extends ModelRow {
  // Only extend with fields that actually exist in the database
  // No additional fields needed since ModelRow already has all available fields
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
    const loadProduct = async () => {
      try {
        setIsLoading(true);
        
        // Get the model ID from URL params (it's a UUID string, not a number)
        const modelId = params.id as string;
        console.log("Attempting to load model with ID:", modelId);
        
        if (!modelId) {
          throw new Error("Invalid model ID");
        }

        // Fetch the model from Supabase
        const model = await ModelsService.getModel(modelId);
        console.log("Fetched model:", model);
        
        if (!model) {
          throw new Error(`Model with ID ${modelId} not found in database`);
        }

        // Use the model data directly - no transformation needed
        setProduct(model);
      } catch (error) {
        console.error("Error loading product:", error);
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to load product",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadProduct();
  }, [params.id, toast]);

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
          <div className="h-16 w-16 rounded-full border-4 border-purple-500 border-t-transparent animate-spin" />
          <p className="text-lg font-medium text-white">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2 text-white">Product not found</h1>
          <p className="text-gray-300 mb-4">The product you&apos;re looking for doesn&apos;t exist.</p>
          <Button 
            onClick={() => router.back()}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0"
          >
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => router.back()}
            className="text-gray-300 hover:text-white hover:bg-slate-800/50"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              {product.name}
            </h1>
            <div className="flex items-center gap-3 mt-2">
              <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                {product.category || 'Product'}
              </Badge>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={handleShare}
            className="border-purple-500/30 text-gray-300 hover:bg-purple-900/20 hover:border-purple-500/50"
          >
            <Share2 className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={handleDownload}
            className="border-purple-500/30 text-gray-300 hover:bg-purple-900/20 hover:border-purple-500/50"
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Image Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          {product.image_url && (
            <Card className="overflow-hidden bg-slate-900/50 backdrop-blur-xl border border-purple-500/20 shadow-xl shadow-black/10">
              <CardContent className="p-0">
                <div className="relative aspect-square">
                  <Image
                    src={product.image_url}
                    alt={product.name}
                    className="object-cover transition-all duration-500"
                    fill
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-slate-900/80 backdrop-blur-sm border border-purple-500/30 text-purple-300">
                      AI Enhanced
                      <Sparkles className="ml-1 h-3 w-3" />
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>

        {/* Product Info */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          {/* Embed & Share Options */}
          <Card className="bg-slate-900/50 backdrop-blur-xl border border-purple-500/20 shadow-xl shadow-black/10">
            <CardHeader className="border-b border-purple-500/10">
              <CardTitle className="flex items-center gap-2 text-xl font-semibold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                <LinkIcon className="h-5 w-5 text-purple-400" />
                Share & Embed
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              {/* AR Link */}
              <div className="space-y-2">
                <Label htmlFor="ar-link" className="text-gray-300">AR Try-On Link</Label>
                <div className="flex gap-2">
                  <Input
                    id="ar-link"
                    value={getArLink()}
                    readOnly
                    className="font-mono text-sm bg-slate-800/50 border-purple-500/30 text-white"
                  />
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={handleCopyArLink}
                    className="border-purple-500/30 text-gray-300 hover:bg-purple-900/20 hover:border-purple-500/50"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Embed Code */}
              <div className="space-y-2">
                <Label htmlFor="embed-code" className="text-gray-300">Embed Code (iframe)</Label>
                <div className="space-y-3">
                  <Textarea
                    id="embed-code"
                    value={getEmbedCode()}
                    readOnly
                    className="font-mono text-sm resize-none bg-slate-800/50 border-purple-500/30 text-white"
                    rows={3}
                  />
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleCopyEmbedCode} 
                    className="w-full border-purple-500/30 text-gray-300 hover:bg-purple-900/20 hover:border-purple-500/50"
                  >
                    <Copy className="mr-2 h-4 w-4" />
                    Copy Embed Code
                  </Button>
                </div>
              </div>

              {/* Quick Actions */}
              <Separator className="bg-purple-500/20" />
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleShare}
                  className="border-purple-500/30 text-gray-300 hover:bg-purple-900/20 hover:border-purple-500/50"
                >
                  <Share2 className="mr-2 h-4 w-4" />
                  Share Link
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  asChild
                  className="border-purple-500/30 text-gray-300 hover:bg-purple-900/20 hover:border-purple-500/50"
                >
                  <Link href={`/try-on/${product.id}`} target="_blank">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Open AR
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* AR Model Info */}
          <Card className="bg-gradient-to-r from-green-900/20 to-emerald-900/20 border border-green-500/20 shadow-xl shadow-black/10">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-white">
                <Smartphone className="h-5 w-5 text-green-400" />
                AR Ready
              </h3>
              <p className="text-sm text-gray-300 mb-4 leading-relaxed">
                This product has been optimized for augmented reality try-on experiences.
                Compatible with any device with camera access.
              </p>
              <div className="flex items-center gap-2 text-sm">
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                  ✓ Face Detection
                </Badge>
                <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
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