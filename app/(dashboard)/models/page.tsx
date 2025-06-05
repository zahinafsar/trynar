import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModelGrid } from "@/components/models/model-grid";
import { ModelSearch } from "@/components/models/model-search";

export default function ModelsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">3D Models</h2>
          <p className="text-muted-foreground">
            View and manage your 3D models
          </p>
        </div>
        <Button asChild>
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