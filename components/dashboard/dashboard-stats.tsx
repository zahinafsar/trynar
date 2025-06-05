import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Cuboid as Cube, Package, ShoppingCart, Users } from "lucide-react";

export function DashboardStats() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="bg-secondary/50 backdrop-blur-xl border-secondary">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total Products
          </CardTitle>
          <Package className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">24</div>
          <p className="text-xs text-muted-foreground">
            +4 from last month
          </p>
        </CardContent>
      </Card>
      <Card className="bg-secondary/50 backdrop-blur-xl border-secondary">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            3D Models Created
          </CardTitle>
          <Cube className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">18</div>
          <p className="text-xs text-muted-foreground">
            +2 from last month
          </p>
        </CardContent>
      </Card>
      <Card className="bg-secondary/50 backdrop-blur-xl border-secondary">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            AR Try-ons
          </CardTitle>
          <Users className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">387</div>
          <p className="text-xs text-muted-foreground">
            +42 from last month
          </p>
        </CardContent>
      </Card>
      <Card className="bg-secondary/50 backdrop-blur-xl border-secondary">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Available Tokens
          </CardTitle>
          <ShoppingCart className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">25</div>
          <p className="text-xs text-muted-foreground">
            5 used this month
          </p>
        </CardContent>
      </Card>
    </div>
  );
}