import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Cuboid as Cube, Package, CreditCard, Settings } from "lucide-react";

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>
          Get started with these common tasks
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Button className="h-auto flex-col py-4 justify-start items-start space-y-2" variant="outline" asChild>
            <Link href="/models/create">
              <Cube className="h-5 w-5" />
              <div className="space-y-1 text-left">
                <h3 className="font-medium">Create 3D Model</h3>
                <p className="text-xs text-muted-foreground">
                  Generate a new 3D model from a product
                </p>
              </div>
            </Link>
          </Button>
          <Button className="h-auto flex-col py-4 justify-start items-start space-y-2" variant="outline" asChild>
            <Link href="/products">
              <Package className="h-5 w-5" />
              <div className="space-y-1 text-left">
                <h3 className="font-medium">Manage Products</h3>
                <p className="text-xs text-muted-foreground">
                  View and manage your product list
                </p>
              </div>
            </Link>
          </Button>
          <Button className="h-auto flex-col py-4 justify-start items-start space-y-2" variant="outline" asChild>
            <Link href="/tokens">
              <CreditCard className="h-5 w-5" />
              <div className="space-y-1 text-left">
                <h3 className="font-medium">Buy Tokens</h3>
                <p className="text-xs text-muted-foreground">
                  Purchase tokens for 3D model generation
                </p>
              </div>
            </Link>
          </Button>
          <Button className="h-auto flex-col py-4 justify-start items-start space-y-2" variant="outline" asChild>
            <Link href="/settings">
              <Settings className="h-5 w-5" />
              <div className="space-y-1 text-left">
                <h3 className="font-medium">Settings</h3>
                <p className="text-xs text-muted-foreground">
                  Configure your account settings
                </p>
              </div>
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}