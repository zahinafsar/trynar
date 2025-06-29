"use client";

import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ModelsService } from "@/lib/models";

// Dynamically import VirtualTryOn with SSR disabled
const VirtualTryOn = dynamic(
  () =>
    import("@/components/try-on").then((mod) => ({
      default: mod.VirtualTryOn,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="w-screen h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600">Loading Virtual Try-On...</p>
        </div>
      </div>
    ),
  }
);

export default function ARTryOnPage() {
  const params = useParams();
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadProduct = async () => {
      try {
        setIsLoading(true);
        
        // Fetch from database using the UUID
        const productId = params.id as string;
        if (productId) {
          const product = await ModelsService.getModel(productId);
          if (product?.image_url) {
            setGeneratedImageUrl(product.image_url);
          }
        }
      } catch (error) {
        console.error("Error loading product:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadProduct();
  }, [params.id]);
  
  if (isLoading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600">Loading product data...</p>
        </div>
      </div>
    );
  }
  
  return <VirtualTryOn generatedImageUrl={generatedImageUrl} />;
}
