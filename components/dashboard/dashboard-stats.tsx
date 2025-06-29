"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Cuboid as Cube, Package, Users, Coins } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/auth";
import { useTokens } from "@/hooks/use-tokens";

interface DashboardStats {
  totalProducts: number;
  totalModels: number;
  totalTryOns: number;
  availableTokens: number;
  monthlyGrowth: {
    products: number;
    models: number;
    tryOns: number;
    tokens: number;
  };
}

export function DashboardStats() {
  const { user } = useAuth();
  const { balance } = useTokens();
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalModels: 0,
    totalTryOns: 0,
    availableTokens: 0,
    monthlyGrowth: {
      products: 0,
      models: 0,
      tryOns: 0,
      tokens: 0,
    },
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!user?.id) return;

      try {
        setLoading(true);

        // Get current date and last month date
        const now = new Date();
        const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());

        // Fetch total models/products for this user
        const { data: allModels, error: modelsError } = await supabase
          .from("models")
          .select("id, created_at")
          .eq("user", user.id);

        if (modelsError) {
          console.error("Error fetching models:", modelsError);
          return;
        }

        const totalModels = allModels?.length || 0;
        const totalProducts = totalModels; // Same as models in this case

        // Calculate monthly growth for models/products
        const modelsThisMonth = allModels?.filter(
          (model) => new Date(model.created_at) >= lastMonth
        ).length || 0;

        // For AR try-ons, we'll simulate based on models (in a real app, you'd track this separately)
        const estimatedTryOns = totalModels * 15; // Estimate 15 try-ons per model
        const tryOnsGrowth = modelsThisMonth * 15;

        // Get token balance from the hook
        const availableTokens = balance;

        // Calculate token usage this month (negative amounts)
        const { data: tokenData } = await supabase
          .from("tokens")
          .select("amount, created_at")
          .eq("user", user.id)
          .gte("created_at", lastMonth.toISOString());

        const tokensUsedThisMonth = tokenData
          ?.filter((token) => token.amount < 0)
          .reduce((sum, token) => sum + Math.abs(token.amount), 0) || 0;

        setStats({
          totalProducts,
          totalModels,
          totalTryOns: estimatedTryOns,
          availableTokens,
          monthlyGrowth: {
            products: modelsThisMonth,
            models: modelsThisMonth,
            tryOns: tryOnsGrowth,
            tokens: tokensUsedThisMonth,
          },
        });
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user?.id, balance]);

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toString();
  };

  const formatTokens = (tokens: number) => {
    if (tokens >= 1000000) {
      return `${(tokens / 1000000).toFixed(1)}M`;
    } else if (tokens >= 1000) {
      return `${(tokens / 1000).toFixed(1)}k`;
    }
    return tokens.toString();
  };

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
            {loading ? (
              <div className="h-9 w-16 bg-slate-700 rounded animate-pulse" />
            ) : (
              formatNumber(stats.totalProducts)
            )}
          </div>
          <p className="text-xs text-gray-400 mt-1">
            {loading ? (
              <div className="h-4 w-20 bg-slate-700 rounded animate-pulse" />
            ) : stats.monthlyGrowth.products > 0 ? (
              <>
                <span className="text-green-400">+{stats.monthlyGrowth.products}</span> from last month
              </>
            ) : (
              <span className="text-gray-500">No new products this month</span>
            )}
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
            {loading ? (
              <div className="h-9 w-16 bg-slate-700 rounded animate-pulse" />
            ) : (
              formatNumber(stats.totalModels)
            )}
          </div>
          <p className="text-xs text-gray-400 mt-1">
            {loading ? (
              <div className="h-4 w-20 bg-slate-700 rounded animate-pulse" />
            ) : stats.monthlyGrowth.models > 0 ? (
              <>
                <span className="text-green-400">+{stats.monthlyGrowth.models}</span> from last month
              </>
            ) : (
              <span className="text-gray-500">No new models this month</span>
            )}
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
            {loading ? (
              <div className="h-9 w-16 bg-slate-700 rounded animate-pulse" />
            ) : (
              formatNumber(stats.totalTryOns)
            )}
          </div>
          <p className="text-xs text-gray-400 mt-1">
            {loading ? (
              <div className="h-4 w-20 bg-slate-700 rounded animate-pulse" />
            ) : stats.monthlyGrowth.tryOns > 0 ? (
              <>
                <span className="text-green-400">+{stats.monthlyGrowth.tryOns}</span> estimated this month
              </>
            ) : (
              <span className="text-gray-500">No new try-ons this month</span>
            )}
          </p>
        </CardContent>
      </Card>

      <Card className="bg-slate-900/50 backdrop-blur-xl border border-purple-500/20 shadow-xl shadow-black/10 hover:border-purple-500/40 transition-all duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-sm font-medium text-gray-300">
            Available Tokens
          </CardTitle>
          <div className="p-2 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg">
            <Coins className="h-4 w-4 text-white" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
            {loading ? (
              <div className="h-9 w-16 bg-slate-700 rounded animate-pulse" />
            ) : (
              formatTokens(stats.availableTokens)
            )}
          </div>
          <p className="text-xs text-gray-400 mt-1">
            {loading ? (
              <div className="h-4 w-20 bg-slate-700 rounded animate-pulse" />
            ) : stats.monthlyGrowth.tokens > 0 ? (
              <>
                <span className="text-orange-400">{formatTokens(stats.monthlyGrowth.tokens)}</span> used this month
              </>
            ) : (
              <span className="text-gray-500">No tokens used this month</span>
            )}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}