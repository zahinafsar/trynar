"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpDown,
  MoreHorizontal,
  Cuboid as Cube,
  Loader2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ModelsService } from "@/lib/models";
import { ModelRow } from "@/types/db";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

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

    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
    }

    return 0;
  });

  const handleDeleteProduct = async (productId: number) => {
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
    <div className="rounded-md border bg-card">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="w-[80px]">Image</TableHead>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => handleSort("name")}
                className="px-0 font-medium"
              >
                Name
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => handleSort("category")}
                className="px-0 font-medium"
              >
                Category
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[100px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedProducts.map((product) => (
            <TableRow key={product.id} className="bg-card hover:bg-muted/50">
              <TableCell>
                <div className="relative h-10 w-10 overflow-hidden rounded-md">
                  {/* Use image_url if available, otherwise use product_url */}
                  {product.image_url || product.product_url ? (
                    <Image
                      src={product.image_url || product.product_url || ""}
                      alt={product.name}
                      className="object-cover"
                      fill
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-xs text-gray-500">No image</span>
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell className="font-medium">
                <Link
                  href={`/products/${product.id}`}
                  className="hover:underline"
                >
                  {product.name}
                </Link>
              </TableCell>
              <TableCell className="capitalize">{product.category}</TableCell>
              <TableCell>
                <Badge
                  className={
                    product.status === "complete"
                      ? "bg-green-500/10 text-green-500 hover:bg-green-500/20"
                      : product.status === "processing"
                      ? "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20"
                      : "bg-red-500/10 text-red-500 hover:bg-red-500/20"
                  }
                >
                  {product.status}
                </Badge>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href={`/products/${product.id}`}>View product</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/products/${product.id}/edit`}>
                        Edit product
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/ar/try-on/${product.id}`}>Try on AR</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => handleDeleteProduct(product.id)}
                    >
                      Delete product
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
