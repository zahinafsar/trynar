import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductList } from "@/components/products/product-list";

export default function ProductsPage() {
  return (
    <div className="space-y-8">
      {/* Header Section with Gradient Text */}
      <div className="flex items-center justify-between">
        <div className="space-y-4">
          <h2 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Products
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl">
            Manage your product catalog and create stunning AR experiences for your customers.
          </p>
        </div>
        <Button 
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 shadow-lg shadow-purple-500/25"
          asChild
        >
          <Link href="/products/create">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Product
          </Link>
        </Button>
      </div>
      
      <ProductList />
    </div>
  );
}