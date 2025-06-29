"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/auth";
import { ModelRow } from "@/types/db";
import { Loader2, Package } from "lucide-react";

export function RecentModels() {
  const { user } = useAuth();
  const [models, setModels] = useState<ModelRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentModels = async () => {
      if (!user?.id) return;

      try {
        setLoading(true);

        const { data, error } = await supabase
          .from("models")
          .select("*")
          .eq("user", user.id)
          .order("created_at", { ascending: false })
          .limit(4);

        if (error) {
          console.error("Error fetching recent models:", error);
          return;
        }

        setModels(data || []);
      } catch (error) {
        console.error("Error fetching recent models:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentModels();
  }, [user?.id]);

  const getStatusBadge = (model: ModelRow) => {
    // Since we don't have a status field, we'll determine status based on data completeness
    if (model.image_url) {
      return { status: "complete", color: "bg-green-500/20 text-green-400 hover:bg-green-500/30" };
    } else {
      return { status: "processing", color: "bg-blue-500/20 text-blue-400 hover:bg-blue-500/30" };
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between space-x-4 rounded-xl border border-purple-500/20 p-4 bg-gradient-to-r from-slate-900/50 to-purple-900/20"
            >
              <div className="flex items-center space-x-4">
                <div className="h-16 w-16 bg-slate-700 rounded-lg animate-pulse" />
                <div className="space-y-2">
                  <div className="h-4 w-32 bg-slate-700 rounded animate-pulse" />
                  <div className="h-3 w-24 bg-slate-700 rounded animate-pulse" />
                  <div className="h-3 w-20 bg-slate-700 rounded animate-pulse" />
                </div>
              </div>
              <div className="h-8 w-16 bg-slate-700 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (models.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
          <Package className="h-8 w-8 text-white" />
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">No models yet</h3>
        <p className="text-gray-400 mb-4">
          Create your first 3D model to see it here.
        </p>
        <Button 
          asChild
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0"
        >
          <Link href="/products/create">Create Your First Model</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        {models.map((model) => {
          const { status, color } = getStatusBadge(model);
          
          return (
            <div
              key={model.id}
              className="flex items-center justify-between space-x-4 rounded-xl border border-purple-500/20 p-4 bg-gradient-to-r from-slate-900/50 to-purple-900/20 hover:border-purple-500/40 transition-all duration-300"
            >
              <div className="flex items-center space-x-4">
                <div className="relative h-16 w-16 overflow-hidden rounded-lg border border-purple-500/20 bg-slate-800">
                  {model.image_url ? (
                    <Image
                      src={model.image_url}
                      alt={model.name}
                      className="object-cover"
                      fill
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="h-6 w-6 text-gray-500" />
                    </div>
                  )}
                </div>
                <div>
                  <div className="font-semibold text-white">{model.name}</div>
                  <div className="text-sm text-gray-300 capitalize">
                    {model.category || 'Product'}
                  </div>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge
                      variant="outline"
                      className={cn("text-xs border-0", color)}
                    >
                      {status}
                    </Badge>
                    <span className="text-xs text-gray-400">
                      {formatDistanceToNow(new Date(model.created_at), { addSuffix: true })}
                    </span>
                  </div>
                </div>
              </div>
              <Button 
                size="sm" 
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0"
                asChild
              >
                <Link href={`/products/${model.id}`}>View</Link>
              </Button>
            </div>
          );
        })}
      </div>
      
      {models.length > 0 && (
        <div className="text-center pt-4">
          <Button 
            variant="outline" 
            size="sm" 
            className="border-purple-500/20 text-gray-300 hover:border-purple-500/40 hover:bg-purple-900/20"
            asChild
          >
            <Link href="/products">View all products</Link>
          </Button>
        </div>
      )}
    </div>
  );
}