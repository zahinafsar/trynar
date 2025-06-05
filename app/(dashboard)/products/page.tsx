import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductList } from "@/components/products/product-list";
import { ProductSearch } from "@/components/products/product-search";

export default function ProductsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Products</h2>
          <p className="text-muted-foreground">
            Manage your products and link them to 3D models
          </p>
        </div>
        <Button asChild>
          <Link href="/products/create">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Product
          </Link>
        </Button>
      </div>
      
      <ProductSearch />
      <ProductList />
    </div>
  );
}