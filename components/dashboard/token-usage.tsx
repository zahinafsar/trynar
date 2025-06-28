"use client";

import { useState } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
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
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: "rgba(15, 23, 42, 0.9)", 
                border: "1px solid rgba(147, 51, 234, 0.3)",
                borderRadius: "8px",
                color: "white"
              }}
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
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}