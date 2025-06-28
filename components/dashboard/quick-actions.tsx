import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Cuboid as Cube, Package, CreditCard, Settings } from "lucide-react";

export function QuickActions() {
  return (
    <Card className="bg-slate-900/50 backdrop-blur-xl border border-purple-500/20 shadow-xl shadow-black/10">
      <CardHeader className="border-b border-purple-500/10">
        <CardTitle className="text-xl font-semibold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Quick Actions
        </CardTitle>
        <CardDescription className="text-gray-300">
          Get started with these common tasks and streamline your workflow
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Button 
            className="h-auto flex-col py-6 justify-start items-start space-y-3 bg-gradient-to-br from-purple-900/30 to-pink-900/30 border border-purple-500/20 hover:border-purple-500/40 hover:from-purple-900/50 hover:to-pink-900/50 transition-all duration-300" 
            variant="outline" 
            asChild
          >
            <Link href="/models/create">
              <div className="p-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg">
                <Cube className="h-5 w-5 text-white" />
              </div>
              <div className="space-y-1 text-left">
                <h3 className="font-semibold text-white">Create 3D Model</h3>
                <p className="text-xs text-gray-300 leading-relaxed">
                  Generate a new 3D model from a product image
                </p>
              </div>
            </Link>
          </Button>

          <Button 
            className="h-auto flex-col py-6 justify-start items-start space-y-3 bg-gradient-to-br from-blue-900/30 to-cyan-900/30 border border-blue-500/20 hover:border-blue-500/40 hover:from-blue-900/50 hover:to-cyan-900/50 transition-all duration-300" 
            variant="outline" 
            asChild
          >
            <Link href="/products">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg">
                <Package className="h-5 w-5 text-white" />
              </div>
              <div className="space-y-1 text-left">
                <h3 className="font-semibold text-white">Manage Products</h3>
                <p className="text-xs text-gray-300 leading-relaxed">
                  View and manage your product catalog
                </p>
              </div>
            </Link>
          </Button>

          <Button 
            className="h-auto flex-col py-6 justify-start items-start space-y-3 bg-gradient-to-br from-green-900/30 to-emerald-900/30 border border-green-500/20 hover:border-green-500/40 hover:from-green-900/50 hover:to-emerald-900/50 transition-all duration-300" 
            variant="outline" 
            asChild
          >
            <Link href="/tokens">
              <div className="p-2 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg">
                <CreditCard className="h-5 w-5 text-white" />
              </div>
              <div className="space-y-1 text-left">
                <h3 className="font-semibold text-white">Buy Tokens</h3>
                <p className="text-xs text-gray-300 leading-relaxed">
                  Purchase tokens for 3D model generation
                </p>
              </div>
            </Link>
          </Button>

          <Button 
            className="h-auto flex-col py-6 justify-start items-start space-y-3 bg-gradient-to-br from-orange-900/30 to-red-900/30 border border-orange-500/20 hover:border-orange-500/40 hover:from-orange-900/50 hover:to-red-900/50 transition-all duration-300" 
            variant="outline" 
            asChild
          >
            <Link href="/settings">
              <div className="p-2 bg-gradient-to-r from-orange-600 to-red-600 rounded-lg">
                <Settings className="h-5 w-5 text-white" />
              </div>
              <div className="space-y-1 text-left">
                <h3 className="font-semibold text-white">Settings</h3>
                <p className="text-xs text-gray-300 leading-relaxed">
                  Configure your account preferences
                </p>
              </div>
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}