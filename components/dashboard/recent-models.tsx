import Image from "next/image";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

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

export function RecentModels() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        {models.map((model) => (
          <div
            key={model.id}
            className="flex items-center justify-between space-x-4 rounded-lg border p-3"
          >
            <div className="flex items-center space-x-4">
              <div className="relative h-16 w-16 overflow-hidden rounded-md">
                <Image
                  src={model.thumbnail}
                  alt={model.name}
                  className="object-cover"
                  fill
                />
              </div>
              <div>
                <div className="font-medium">{model.name}</div>
                <div className="text-sm text-muted-foreground">
                  {model.productName}
                </div>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-xs",
                      model.status === "complete" && "bg-green-500/10 text-green-500 hover:bg-green-500/10 hover:text-green-500",
                      model.status === "processing" && "bg-blue-500/10 text-blue-500 hover:bg-blue-500/10 hover:text-blue-500",
                      model.status === "failed" && "bg-red-500/10 text-red-500 hover:bg-red-500/10 hover:text-red-500"
                    )}
                  >
                    {model.status}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(model.createdAt, { addSuffix: true })}
                  </span>
                </div>
              </div>
            </div>
            <Button size="sm" asChild>
              <Link href={`/models/${model.id}`}>View</Link>
            </Button>
          </div>
        ))}
      </div>
      <div className="text-center">
        <Button variant="outline" size="sm" asChild>
          <Link href="/models">View all models</Link>
        </Button>
      </div>
    </div>
  );
}