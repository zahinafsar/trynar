"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpDown, MoreHorizontal, Cuboid as Cube } from "lucide-react";

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

interface Product {
  id: string;
  name: string;
  image: string;
  price: number;
  modelStatus: "available" | "unavailable";
  category: string;
}

const products: Product[] = [
  {
    id: "1",
    name: "Blue Sneakers",
    image: "https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    price: 89.99,
    modelStatus: "available",
    category: "Footwear",
  },
  {
    id: "2",
    name: "Silver Watch",
    image: "https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    price: 129.99,
    modelStatus: "available",
    category: "Accessories",
  },
  {
    id: "3",
    name: "Black Headphones",
    image: "https://images.pexels.com/photos/577769/pexels-photo-577769.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    price: 99.99,
    modelStatus: "available",
    category: "Electronics",
  },
  {
    id: "4",
    name: "Green Backpack",
    image: "https://images.pexels.com/photos/1546003/pexels-photo-1546003.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    price: 59.99,
    modelStatus: "unavailable",
    category: "Bags",
  },
  {
    id: "5",
    name: "Sunglasses",
    image: "https://images.pexels.com/photos/701877/pexels-photo-701877.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    price: 79.99,
    modelStatus: "unavailable",
    category: "Accessories",
  },
];

export function ProductList() {
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

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

    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
    }

    return 0;
  });

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
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
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => handleSort("price")}
                className="px-0 font-medium"
              >
                Price
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>3D Model</TableHead>
            <TableHead className="w-[100px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedProducts.map((product) => (
            <TableRow key={product.id}>
              <TableCell>
                <div className="relative h-10 w-10 overflow-hidden rounded-md">
                  <Image
                    src={product.image}
                    alt={product.name}
                    className="object-cover"
                    fill
                  />
                </div>
              </TableCell>
              <TableCell className="font-medium">
                <Link href={`/products/${product.id}`} className="hover:underline">
                  {product.name}
                </Link>
              </TableCell>
              <TableCell>{product.category}</TableCell>
              <TableCell>${product.price.toFixed(2)}</TableCell>
              <TableCell>
                {product.modelStatus === "available" ? (
                  <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20">
                    Available
                  </Badge>
                ) : (
                  <Button variant="outline" size="sm" className="h-8">
                    <Cube className="mr-2 h-4 w-4" />
                    Create Model
                  </Button>
                )}
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
                    <DropdownMenuItem>View product</DropdownMenuItem>
                    <DropdownMenuItem>Edit product</DropdownMenuItem>
                    {product.modelStatus === "available" ? (
                      <DropdownMenuItem>View 3D model</DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem>Create 3D model</DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive">
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