"use client";

import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function ProductSearch() {
  return (
    <div className="flex flex-col space-y-4 md:flex-row md:items-center md:space-x-4 md:space-y-0">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search products..."
          className="pl-8"
        />
      </div>
      <div className="flex items-center space-x-4">
        <Select defaultValue="all">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="footwear">Footwear</SelectItem>
            <SelectItem value="accessories">Accessories</SelectItem>
            <SelectItem value="electronics">Electronics</SelectItem>
            <SelectItem value="bags">Bags</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="all">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="3D Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="available">With 3D Model</SelectItem>
            <SelectItem value="unavailable">Without 3D Model</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="icon">
          <SlidersHorizontal className="h-4 w-4" />
          <span className="sr-only">More filters</span>
        </Button>
      </div>
    </div>
  );
}