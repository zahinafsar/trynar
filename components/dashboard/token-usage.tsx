"use client";

import { useState, useEffect } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/auth";
import { TokenRow } from "@/types/db";
import { Loader2 } from "lucide-react";

interface ChartData {
  name: string;
  tokens: number;
  date: string;
}

export function TokenUsage() {
  const { user } = useAuth();
  const [period, setPeriod] = useState("30days");
  const [data, setData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTokenUsage = async () => {
      if (!user?.id) return;

      try {
        setLoading(true);

        // Calculate date range based on period
        const now = new Date();
        let startDate: Date;
        let groupBy: 'day' | 'week' | 'month' = 'day';

        switch (period) {
          case "7days":
            startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            groupBy = 'day';
            break;
          case "30days":
            startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            groupBy = 'day';
            break;
          case "90days":
            startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
            groupBy = 'week';
            break;
          default:
            startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            groupBy = 'day';
        }

        // Fetch token usage data
        const { data: tokenData, error } = await supabase
          .from("tokens")
          .select("*")
          .eq("user", user.id)
          .gte("created_at", startDate.toISOString())
          .order("created_at", { ascending: true });

        if (error) {
          console.error("Error fetching token usage:", error);
          return;
        }

        // Process data for chart
        const processedData = processTokenData(tokenData || [], groupBy, startDate, now);
        setData(processedData);
      } catch (error) {
        console.error("Error fetching token usage:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTokenUsage();
  }, [user?.id, period]);

  const processTokenData = (
    tokens: TokenRow[],
    groupBy: 'day' | 'week' | 'month',
    startDate: Date,
    endDate: Date
  ): ChartData[] => {
    const result: ChartData[] = [];
    const current = new Date(startDate);

    while (current <= endDate) {
      let periodEnd: Date;
      let label: string;

      if (groupBy === 'day') {
        periodEnd = new Date(current.getTime() + 24 * 60 * 60 * 1000);
        label = current.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      } else if (groupBy === 'week') {
        periodEnd = new Date(current.getTime() + 7 * 24 * 60 * 60 * 1000);
        label = `Week ${Math.ceil((current.getTime() - startDate.getTime()) / (7 * 24 * 60 * 60 * 1000)) + 1}`;
      } else {
        periodEnd = new Date(current.getFullYear(), current.getMonth() + 1, 1);
        label = current.toLocaleDateString('en-US', { month: 'short' });
      }

      // Calculate tokens used in this period (negative amounts only)
      const tokensUsed = tokens
        .filter(token => {
          const tokenDate = new Date(token.created_at);
          return tokenDate >= current && tokenDate < periodEnd && token.amount < 0;
        })
        .reduce((sum, token) => sum + Math.abs(token.amount), 0);

      result.push({
        name: label,
        tokens: Math.round(tokensUsed / 1000000), // Convert to millions for display
        date: current.toISOString(),
      });

      if (groupBy === 'day') {
        current.setDate(current.getDate() + 1);
      } else if (groupBy === 'week') {
        current.setDate(current.getDate() + 7);
      } else {
        current.setMonth(current.getMonth() + 1);
      }
    }

    return result;
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="h-6 w-32 bg-slate-700 rounded animate-pulse" />
          <div className="h-10 w-32 bg-slate-700 rounded animate-pulse" />
        </div>
        <div className="h-[200px] w-full flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium text-gray-300">Token Usage Over Time</h3>
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-32 bg-slate-800/50 border-purple-500/30 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-slate-900 border-purple-500/20">
            <SelectItem value="7days" className="text-white hover:bg-slate-800">Last 7 days</SelectItem>
            <SelectItem value="30days" className="text-white hover:bg-slate-800">Last 30 days</SelectItem>
            <SelectItem value="90days" className="text-white hover:bg-slate-800">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="h-[200px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(147, 51, 234, 0.2)" />
            <XAxis 
              dataKey="name" 
              className="text-xs" 
              tick={{ fill: 'rgb(156, 163, 175)' }}
              axisLine={{ stroke: 'rgba(147, 51, 234, 0.2)' }}
            />
            <YAxis 
              className="text-xs" 
              tick={{ fill: 'rgb(156, 163, 175)' }}
              axisLine={{ stroke: 'rgba(147, 51, 234, 0.2)' }}
              label={{ value: 'Tokens (M)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: 'rgb(156, 163, 175)' } }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: "rgba(15, 23, 42, 0.9)", 
                border: "1px solid rgba(147, 51, 234, 0.3)",
                borderRadius: "8px",
                color: "white"
              }}
              formatter={(value: number) => [`${value}M tokens`, 'Used']}
              labelFormatter={(label) => `Period: ${label}`}
            />
            <defs>
              <linearGradient id="tokenGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#9333EA" />
                <stop offset="100%" stopColor="#EC4899" />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="tokens"
              stroke="url(#tokenGradient)"
              fill="url(#tokenGradient)"
              fillOpacity={0.2}
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {data.every(d => d.tokens === 0) && (
        <div className="text-center py-4">
          <p className="text-sm text-gray-400">No token usage in this period</p>
        </div>
      )}
    </div>
  );
}