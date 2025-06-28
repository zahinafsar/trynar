"use client";

import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const data = [
  { name: "Week 1", tokens: 4 },
  { name: "Week 2", tokens: 7 },
  { name: "Week 3", tokens: 5 },
  { name: "Week 4", tokens: 9 },
];

export function TokenUsage() {
  const [period, setPeriod] = useState("30days");

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-[180px] bg-slate-800/50 border-purple-500/20 text-gray-300">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent className="bg-slate-900 border-purple-500/20">
            <SelectItem value="7days">Last 7 days</SelectItem>
            <SelectItem value="30days">Last 30 days</SelectItem>
            <SelectItem value="90days">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="h-[200px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
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
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: "rgba(15, 23, 42, 0.9)", 
                border: "1px solid rgba(147, 51, 234, 0.3)",
                borderRadius: "8px",
                color: "white"
              }}
            />
            <Bar 
              dataKey="tokens" 
              fill="url(#tokenGradient)" 
              radius={4} 
            />
            <defs>
              <linearGradient id="tokenGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#9333EA" />
                <stop offset="100%" stopColor="#EC4899" />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="flex justify-between items-center rounded-xl border border-purple-500/20 p-4 bg-gradient-to-r from-slate-900/50 to-purple-900/20">
        <div>
          <div className="text-sm font-medium text-gray-300">Total tokens used</div>
          <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            25
          </div>
        </div>
        <div>
          <div className="text-sm font-medium text-gray-300">Available tokens</div>
          <div className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
            25
          </div>
        </div>
      </div>
    </div>
  );
}