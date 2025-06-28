"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Eye, Cuboid as Cube, Share2, MoreHorizontal } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

interface Model {
  id: string;
  name: string;
  status: "complete" | "processing" | "failed";
  productName: string;
  thumbnail: string;
  createdAt: Date;
}

const models: Model[] = [
  {
    id: "1",
    name: "Sneaker-Blue-3D",
    status: "complete",
    productName: "Blue Sneakers",
    thumbnail: "https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    createdAt: new Date(2025, 4, 15),
  },
  {
    id: "2",
    name: "Watch-Silver-3D",
    status: "complete",
    productName: "Silver Watch",
    thumbnail: "https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    createdAt: new Date(2025, 4, 14),
  },
  {
    id: "3",
    name: "Headphones-Black-3D",
    status: "processing",
    productName: "Black Headphones",
    thumbnail: "https://images.pexels.com/photos/577769/pexels-photo-577769.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    createdAt: new Date(2025, 4, 13),
  },
  {
    id: "4",
    name: "Backpack-Green-3D",
    status: "failed",
    productName: "Green Backpack",
    thumbnail: "https://images.pexels.com/photos/1546003/pexels-photo-1546003.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    createdAt: new Date(2025, 4, 12),
  },
  {
    id: "5",
    name: "Sunglasses-Black-3D",
    status: "complete",
    productName: "Black Sunglasses",
    thumbnail: "https://images.pexels.com/photos/701877/pexels-photo-701877.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    createdAt: new Date(2025, 4, 10),
  },
  {
    id: "6",
    name: "Smartphone-3D",
    status: "complete",
    productName: "Smartphone Pro",
    thumbnail: "https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    createdAt: new Date(2025, 4, 8),
  },
];

export function ModelGrid() {
  const [view, setView] = useState<"grid" | "list">("grid");
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Tabs defaultValue="all" className="w-[400px]">
          <TabsList className="bg-slate-900/50 backdrop-blur-xl border border-purple-500/20">
            <TabsTrigger 
              value="all"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white"
            >
              All
            </TabsTrigger>
            <TabsTrigger 
              value="complete"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white"
            >
              Complete
            </TabsTrigger>
            <TabsTrigger 
              value="processing"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white"
            >
              Processing
            </TabsTrigger>
            <TabsTrigger 
              value="failed"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white"
            >
              Failed
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="flex space-x-2">
          <Button
            variant={view === "grid" ? "default" : "outline"}
            size="icon"
            onClick={() => setView("grid")}
            className={view === "grid" 
              ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0" 
              : "border-purple-500/30 text-gray-300 hover:bg-purple-900/20 hover:border-purple-500/50"
            }
          >
            <span className="grid grid-cols-2 gap-0.5">
              <span className="h-1.5 w-1.5 rounded-sm bg-current" />
              <span className="h-1.5 w-1.5 rounded-sm bg-current" />
              <span className="h-1.5 w-1.5 rounded-sm bg-current" />
              <span className="h-1.5 w-1.5 rounded-sm bg-current" />
            </span>
            <span className="sr-only">Grid view</span>
          </Button>
          <Button
            variant={view === "list" ? "default" : "outline"}
            size="icon"
            onClick={() => setView("list")}
            className={view === "list" 
              ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0" 
              : "border-purple-500/30 text-gray-300 hover:bg-purple-900/20 hover:border-purple-500/50"
            }
          >
            <span className="flex flex-col gap-0.5">
              <span className="h-1 w-5 rounded-sm bg-current" />
              <span className="h-1 w-5 rounded-sm bg-current" />
              <span className="h-1 w-5 rounded-sm bg-current" />
            </span>
            <span className="sr-only">List view</span>
          </Button>
        </div>
      </div>

      {view === "grid" ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {models.map((model) => (
            <Card key={model.id} className="overflow-hidden bg-slate-900/50 backdrop-blur-xl border border-purple-500/20 shadow-xl shadow-black/10 hover:border-purple-500/40 transition-all duration-300">
              <CardHeader className="p-0">
                <div className="relative aspect-square">
                  <Image
                    src={model.thumbnail}
                    alt={model.name}
                    className="object-cover transition-transform hover:scale-105"
                    fill
                  />
                  <Badge
                    className={cn(
                      "absolute top-2 right-2 border-0",
                      model.status === "complete" && "bg-green-500/20 text-green-400",
                      model.status === "processing" && "bg-blue-500/20 text-blue-400",
                      model.status === "failed" && "bg-red-500/20 text-red-400"
                    )}
                  >
                    {model.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <CardTitle className="text-lg text-white">{model.name}</CardTitle>
                <p className="text-sm text-gray-300 mt-1">
                  {model.productName}
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  Created {formatDistanceToNow(model.createdAt, { addSuffix: true })}
                </p>
              </CardContent>
              <CardFooter className="p-4 pt-0 flex justify-between">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="border-purple-500/30 text-gray-300 hover:bg-purple-900/20 hover:border-purple-500/50"
                  asChild
                >
                  <Link href={`/models/${model.id}`}>
                    <Eye className="mr-2 h-4 w-4" />
                    View
                  </Link>
                </Button>
                <div className="flex space-x-1">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-8 w-8 border-purple-500/30 text-gray-300 hover:bg-purple-900/20 hover:border-purple-500/50"
                  >
                    <Share2 className="h-4 w-4" />
                    <span className="sr-only">Share</span>
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-8 w-8 border-purple-500/30 text-gray-300 hover:bg-purple-900/20 hover:border-purple-500/50"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">More</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-slate-900 border-purple-500/20">
                      <DropdownMenuLabel className="text-gray-300">Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator className="bg-purple-500/20" />
                      <DropdownMenuItem className="text-gray-300 hover:bg-slate-800 hover:text-white">Edit</DropdownMenuItem>
                      <DropdownMenuItem className="text-gray-300 hover:bg-slate-800 hover:text-white">Regenerate</DropdownMenuItem>
                      <DropdownMenuItem className="text-gray-300 hover:bg-slate-800 hover:text-white">Copy AR link</DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-purple-500/20" />
                      <DropdownMenuItem className="text-red-400 hover:bg-red-900/20 hover:text-red-300">
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {models.map((model) => (
            <Card key={model.id} className="bg-slate-900/50 backdrop-blur-xl border border-purple-500/20 shadow-xl shadow-black/10 hover:border-purple-500/40 transition-all duration-300">
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <div className="relative h-16 w-16 overflow-hidden rounded-md border border-purple-500/20">
                    <Image
                      src={model.thumbnail}
                      alt={model.name}
                      className="object-cover"
                      fill
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-white">{model.name}</h3>
                    <p className="text-sm text-gray-300">
                      {model.productName}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-xs border-0",
                          model.status === "complete" && "bg-green-500/20 text-green-400",
                          model.status === "processing" && "bg-blue-500/20 text-blue-400",
                          model.status === "failed" && "bg-red-500/20 text-red-400"
                        )}
                      >
                        {model.status}
                      </Badge>
                      <span className="text-xs text-gray-400">
                        {formatDistanceToNow(model.createdAt, { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="border-purple-500/30 text-gray-300 hover:bg-purple-900/20 hover:border-purple-500/50"
                      asChild
                    >
                      <Link href={`/models/${model.id}`}>
                        <Eye className="mr-2 h-4 w-4" />
                        View
                      </Link>
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-8 w-8 border-purple-500/30 text-gray-300 hover:bg-purple-900/20 hover:border-purple-500/50"
                    >
                      <Share2 className="h-4 w-4" />
                      <span className="sr-only">Share</span>
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="h-8 w-8 border-purple-500/30 text-gray-300 hover:bg-purple-900/20 hover:border-purple-500/50"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">More</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-slate-900 border-purple-500/20">
                        <DropdownMenuLabel className="text-gray-300">Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator className="bg-purple-500/20" />
                        <DropdownMenuItem className="text-gray-300 hover:bg-slate-800 hover:text-white">Edit</DropdownMenuItem>
                        <DropdownMenuItem className="text-gray-300 hover:bg-slate-800 hover:text-white">Regenerate</DropdownMenuItem>
                        <DropdownMenuItem className="text-gray-300 hover:bg-slate-800 hover:text-white">Copy AR link</DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-purple-500/20" />
                        <DropdownMenuItem className="text-red-400 hover:bg-red-900/20 hover:text-red-300">
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}