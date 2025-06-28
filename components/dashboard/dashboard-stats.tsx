import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Cuboid as Cube, Package, ShoppingCart, Users } from "lucide-react";

export function DashboardStats() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <Card className="bg-slate-900/50 backdrop-blur-xl border border-purple-500/20 shadow-xl shadow-black/10 hover:border-purple-500/40 transition-all duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-sm font-medium text-gray-300">
            Total Products
          </CardTitle>
          <div className="p-2 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg">
            <Package className="h-4 w-4 text-white" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            24
          </div>
          <p className="text-xs text-gray-400 mt-1">
            <span className="text-green-400">+4</span> from last month
          </p>
        </CardContent>
      </Card>

      <Card className="bg-slate-900/50 backdrop-blur-xl border border-purple-500/20 shadow-xl shadow-black/10 hover:border-purple-500/40 transition-all duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-sm font-medium text-gray-300">
            3D Models Created
          </CardTitle>
          <div className="p-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg">
            <Cube className="h-4 w-4 text-white" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            18
          </div>
          <p className="text-xs text-gray-400 mt-1">
            <span className="text-green-400">+2</span> from last month
          </p>
        </CardContent>
      </Card>

      <Card className="bg-slate-900/50 backdrop-blur-xl border border-purple-500/20 shadow-xl shadow-black/10 hover:border-purple-500/40 transition-all duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-sm font-medium text-gray-300">
            AR Try-ons
          </CardTitle>
          <div className="p-2 bg-gradient-to-r from-orange-600 to-red-600 rounded-lg">
            <Users className="h-4 w-4 text-white" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
            387
          </div>
          <p className="text-xs text-gray-400 mt-1">
            <span className="text-green-400">+42</span> from last month
          </p>
        </CardContent>
      </Card>

      <Card className="bg-slate-900/50 backdrop-blur-xl border border-purple-500/20 shadow-xl shadow-black/10 hover:border-purple-500/40 transition-all duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-sm font-medium text-gray-300">
            Available Tokens
          </CardTitle>
          <div className="p-2 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg">
            <ShoppingCart className="h-4 w-4 text-white" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
            25
          </div>
          <p className="text-xs text-gray-400 mt-1">
            <span className="text-orange-400">5</span> used this month
          </p>
        </CardContent>
      </Card>
    </div>
  );
}