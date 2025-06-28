"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpDown, Grid, List, Filter } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

interface Product {
  id: string;
  name: string;
  image: string;
  category: string;
}

const products: Product[] = [
  {
    id: "1",
    name: "Blue Sneakers",
    image: "https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    category: "Footwear",
  },
  {
    id: "2",
    name: "Silver Watch",
    image: "https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    category: "Accessories",
  },
  {
    id: "3",
    name: "Black Headphones",
    image: "https://images.pexels.com/photos/577769/pexels-photo-577769.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    category: "Electronics",
  },
  {
    id: "4",
    name: "Green Backpack",
    image: "https://images.pexels.com/photos/1546003/pexels-photo-1546003.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    category: "Bags",
  },
  {
    id: "5",
    name: "Sunglasses",
    image: "https://images.pexels.com/photos/701877/pexels-photo-701877.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    category: "Accessories",
  },
];

export function ProductList() {
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

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

    const aValue = a[sortColumn as keyof Product];
    const bValue = b[sortColumn as keyof Product];

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortDirection === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    return 0;
  });

  return (
    <div className="space-y-6">
      {/* Product Grid */}
      <div className={`grid gap-6 ${
        viewMode === "grid" 
          ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
          : "grid-cols-1"
      }`}>
        {sortedProducts.map((product) => (
          <Card key={product.id} className="group bg-slate-900/50 border-purple-500/20 hover:bg-slate-800/50 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10 hover:border-purple-500/40 overflow-hidden">
            <CardHeader className="p-0">
              <div className="relative h-48 w-full overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.name}
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  fill
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-3">
                <h3 className="font-semibold text-white text-lg leading-tight">
                  {product.name}
                </h3>
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="bg-slate-800/50 border-purple-500/30 text-purple-300 text-xs font-medium">
                    {product.category}
                  </Badge>
                </div>
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <Link href={`/products/${product.id}`} className="w-full">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full bg-purple-500/10 border-purple-500/30 text-purple-400 hover:bg-purple-500/20 hover:border-purple-500/50 transition-all duration-200 font-medium"
                >
                  View Product
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}