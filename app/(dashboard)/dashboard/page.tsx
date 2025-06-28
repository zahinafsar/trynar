import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DashboardStats } from "@/components/dashboard/dashboard-stats";
import { RecentModels } from "@/components/dashboard/recent-models";
import { TokenUsage } from "@/components/dashboard/token-usage";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Header Section with Gradient Text */}
      <div className="space-y-4">
        <h2 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Dashboard
        </h2>
        <p className="text-lg text-gray-300 max-w-2xl">
          Overview of your 3D models, products, and token usage. Monitor your AR
          experiences and track performance metrics.
        </p>
      </div>

      <DashboardStats />

      <div className="flex flex-col gap-8">
        <Card className="lg:col-span-3 bg-slate-900/50 backdrop-blur-xl border border-purple-500/20 shadow-xl shadow-black/10">
          <CardHeader className="border-b border-purple-500/10">
            <CardTitle className="text-xl font-semibold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Token Usage
            </CardTitle>
            <CardDescription className="text-gray-300">
              Your token consumption over the past 30 days.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <TokenUsage />
          </CardContent>
        </Card>
        <Card className="lg:col-span-4 bg-slate-900/50 backdrop-blur-xl border border-purple-500/20 shadow-xl shadow-black/10">
          <CardHeader className="border-b border-purple-500/10">
            <CardTitle className="text-xl font-semibold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Recent 3D Models
            </CardTitle>
            <CardDescription className="text-gray-300">
              Your most recently created 3D models and their status.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <RecentModels />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
