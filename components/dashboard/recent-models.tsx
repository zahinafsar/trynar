"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Eye, Clock, CheckCircle, AlertCircle, XCircle } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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
];

const getStatusConfig = (status: string) => {
  switch (status) {
    case "complete":
      return {
        icon: CheckCircle,
        color: "text-green-400",
        bgColor: "bg-green-500/10",
        borderColor: "border-green-500/20",
        label: "Complete",
      };
    case "processing":
      return {
        icon: Clock,
        color: "text-blue-400",
        bgColor: "bg-blue-500/10",
        borderColor: "border-blue-500/20",
        label: "Processing",
      };
    case "failed":
      return {
        icon: XCircle,
        color: "text-red-400",
        bgColor: "bg-red-500/10",
        borderColor: "border-red-500/20",
        label: "Failed",
      };
    default:
      return {
        icon: AlertCircle,
        color: "text-gray-400",
        bgColor: "bg-gray-500/10",
        borderColor: "border-gray-500/20",
        label: "Unknown",
      };
  }
};

export function RecentModels() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        {models.map((model, index) => {
          const statusConfig = getStatusConfig(model.status);
          
          return (
            <motion.div
              key={model.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.01, x: 4 }}
              className="group"
            >
              <div className="flex items-center justify-between space-x-4 rounded-xl border border-slate-700/50 bg-slate-800/30 backdrop-blur-sm p-4 transition-all duration-300 group-hover:border-purple-500/30 group-hover:bg-slate-800/50 group-hover:shadow-lg group-hover:shadow-purple-500/10">
                <div className="flex items-center space-x-4">
                  {/* Thumbnail with overlay effect */}
                  <div className="relative h-16 w-16 overflow-hidden rounded-xl border border-slate-600/50 group-hover:border-purple-500/30 transition-colors duration-300">
                    <Image
                      src={model.thumbnail}
                      alt={model.name}
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                      fill
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  
                  {/* Model Info */}
                  <div className="space-y-2">
                    <div className="font-semibold text-white group-hover:text-purple-300 transition-colors duration-300">
                      {model.name}
                    </div>
                    <div className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                      {model.productName}
                    </div>
                    
                    {/* Status and Time */}
                    <div className="flex items-center space-x-3">
                      <Badge
                        className={cn(
                          "text-xs font-medium px-2 py-1 rounded-lg border transition-all duration-300",
                          statusConfig.bgColor,
                          statusConfig.borderColor,
                          statusConfig.color,
                          "group-hover:scale-105"
                        )}
                      >
                        <statusConfig.icon className="mr-1 h-3 w-3" />
                        {statusConfig.label}
                      </Badge>
                      <span className="text-xs text-gray-500 group-hover:text-gray-400 transition-colors duration-300">
                        {formatDistanceToNow(model.createdAt, { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Action Button */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    size="sm" 
                    asChild
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <Link href={`/models/${model.id}`} className="flex items-center gap-2">
                      <Eye className="h-4 w-4" />
                      View
                    </Link>
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          );
        })}
      </div>
      
      {/* View All Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-center pt-4"
      >
        <Button 
          variant="outline" 
          size="sm" 
          asChild
          className="bg-slate-800/50 backdrop-blur-sm border-purple-500/30 text-purple-300 hover:bg-purple-500/10 hover:border-purple-500/50 hover:text-purple-200 transition-all duration-300"
        >
          <Link href="/models" className="flex items-center gap-2">
            View all models
            <motion.div
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              →
            </motion.div>
          </Link>
        </Button>
      </motion.div>
    </div>
  );
}