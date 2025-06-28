import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModelGrid } from "@/components/models/model-grid";
import { ModelSearch } from "@/components/models/model-search";

export default function ModelsPage() {
  return (
    <div className="space-y-8">
      {/* Header Section with Gradient Text */}
      <div className="flex items-center justify-between">
        <div className="space-y-4">
          <h2 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            3D Models
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl">
            View and manage your 3D models with advanced AR capabilities and real-time rendering.
          </p>
        </div>
        <Button 
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 shadow-lg shadow-purple-500/25"
          asChild
        >
          <Link href="/models/create">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Model
          </Link>
        </Button>
      </div>
      
      <ModelSearch />
      <ModelGrid />
    </div>
  );
}