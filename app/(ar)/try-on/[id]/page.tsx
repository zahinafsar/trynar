"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Share2, Smartphone } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

export default function TryOnPage() {
  const params = useParams();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [productDetails, setProductDetails] = useState<{
    id: string;
    name: string;
    description: string;
    price: number;
    storeName: string;
    image: string;
  } | null>(null);

  useEffect(() => {
    // Simulate loading product details
    const loadProduct = async () => {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setProductDetails({
        id: params.id as string,
        name: "Blue Sneakers",
        description: "Premium comfortable sneakers with cushioned insoles and durable outsoles.",
        price: 89.99,
        storeName: "Acme Footwear",
        image: "https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      });
      
      setIsLoading(false);
    };
    
    loadProduct();
  }, [params.id]);
  
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link copied",
      description: "The try-on link has been copied to your clipboard.",
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center px-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/">
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">Back</span>
            </Link>
          </Button>
          <div className="ml-4">
            <h1 className="text-lg font-semibold">AR Try-On</h1>
            {!isLoading && productDetails && (
              <p className="text-sm text-muted-foreground">{productDetails.name}</p>
            )}
          </div>
          <div className="ml-auto flex space-x-2">
            <Button variant="outline" size="icon" onClick={handleShare}>
              <Share2 className="h-4 w-4" />
              <span className="sr-only">Share</span>
            </Button>
          </div>
        </div>
      </header>
      
      <main className="flex-1 container mx-auto py-6 px-4">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-[400px]">
            <div className="h-16 w-16 rounded-full border-4 border-primary border-t-transparent animate-spin" />
            <p className="mt-4 text-lg">Loading AR experience...</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <div className="relative aspect-square overflow-hidden rounded-lg">
                <Image
                  src={productDetails?.image || ""}
                  alt={productDetails?.name || ""}
                  className="object-cover"
                  fill
                />
              </div>
              
              <div className="mt-6">
                <h2 className="text-2xl font-bold">{productDetails?.name}</h2>
                <p className="text-muted-foreground mt-2">
                  {productDetails?.description}
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <div>
                    <p className="text-lg font-bold">
                      ${productDetails?.price.toFixed(2)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      From {productDetails?.storeName}
                    </p>
                  </div>
                  <Button asChild>
                    <Link href={`https://example.com/store/${productDetails?.id}`} target="_blank">
                      Visit Store
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
            
            <div>
              <Tabs defaultValue="ar" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="ar">AR View</TabsTrigger>
                  <TabsTrigger value="3d">3D View</TabsTrigger>
                </TabsList>
                <TabsContent value="ar" className="mt-4">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex flex-col items-center text-center space-y-4">
                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                          <Smartphone className="h-10 w-10 text-primary" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold">Try on with AR</h3>
                          <p className="text-muted-foreground mt-2">
                            Use your smartphone camera to see how this product looks in your space.
                          </p>
                        </div>
                        <div className="pt-4">
                          <Button className="w-full" size="lg">
                            Launch AR Experience
                          </Button>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Compatible with iOS 12+ and Android 8.0+ devices with ARCore support.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="3d" className="mt-4">
                  <Card>
                    <CardContent className="p-6">
                      <div className="aspect-square w-full bg-secondary/30 rounded-lg flex items-center justify-center">
                        <div className="text-center p-6">
                          <h3 className="text-xl font-semibold mb-2">Interactive 3D View</h3>
                          <p className="text-muted-foreground">
                            Rotate, zoom, and explore the product in 3D
                          </p>
                          <Button variant="outline" className="mt-4">
                            Load 3D Model
                          </Button>
                        </div>
                      </div>
                      <div className="mt-4 grid grid-cols-3 gap-2">
                        <Button variant="outline" size="sm">Front</Button>
                        <Button variant="outline" size="sm">Side</Button>
                        <Button variant="outline" size="sm">Top</Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
              
              <div className="mt-6 space-y-4">
                <h3 className="text-lg font-semibold">How to use AR Try-On</h3>
                <div className="space-y-2">
                  <div className="flex items-start space-x-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                      1
                    </div>
                    <p>Launch the AR experience on your mobile device</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                      2
                    </div>
                    <p>Point your camera at your feet or desired space</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                      3
                    </div>
                    <p>The product will appear in AR - you can move around to see it from all angles</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}