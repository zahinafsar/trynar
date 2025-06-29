"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpDown,
  Grid,
  List,
  Filter,
  Loader2,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { ModelsService } from "@/lib/models";
import { ModelRow } from "@/types/db";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@radix-ui/react-dropdown-menu";

export function ProductList() {
  const [products, setProducts] = useState<ModelRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const { toast } = useToast();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
          toast({
            variant: "destructive",
            title: "Authentication required",
            description: "Please sign in to view your products.",
          });
          return;
        }

        const result = await ModelsService.getUserModels(user.id);
        setProducts(result);
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Error loading products",
          description:
            error.message || "Failed to load your products. Please try again.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [toast]);

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const sortedProducts = [...products].sort((a, b) => {
    if (!sortColumn) return 0;

    const aValue = a[sortColumn as keyof ModelRow];
    const bValue = b[sortColumn as keyof ModelRow];

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortDirection === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    return 0;
  });

  const handleDeleteProduct = async (productId: string) => {
    try {
      await ModelsService.deleteModel(productId);
      setProducts(products.filter((p) => p.id !== productId));
      toast({
        title: "Product deleted",
        description: "Product has been successfully deleted.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Delete failed",
        description:
          error.message || "Failed to delete product. Please try again.",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading products...</span>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center p-8">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">No products found</h3>
          <p className="text-muted-foreground">
            You haven&apos;t created any products yet. Click &quot;Add
            Product&quot; to get started.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Product Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {sortedProducts.map((product) => (
          <Card
            key={product.id}
            className="group hover:shadow-lg transition-all duration-200 hover:scale-[1.02] border border-gray-200 dark:border-gray-800"
          >
            <CardHeader className="p-0">
              <div className="relative h-64 p-5 bg-white overflow-hidden rounded-t-lg">
                {product.image_url ? (
                  <Image
                    src={product.image_url}
                    alt={product.name}
                    height={100}
                    width={100}
                    priority={false}
                    quality={85}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      No image
                    </span>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-2">
                <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                  <Link href={`/products/${product.id}`}>{product.name}</Link>
                </h3>
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="capitalize">
                    {product.category}
                  </Badge>
                </div>
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <div className="flex w-full space-x-2">
                <Button variant="outline" size="sm" className="flex-1" asChild>
                  <Link href={`/products/${product.id}`}>
                    <Eye className="mr-2 h-4 w-4" />
                    View
                  </Link>
                </Button>
                <Button variant="outline" size="sm" className="flex-1" asChild>
                  <Link href={`/try-on/${product.id}`}>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Try AR
                  </Link>
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
