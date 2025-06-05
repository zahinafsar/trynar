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
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7days">Last 7 days</SelectItem>
            <SelectItem value="30days">Last 30 days</SelectItem>
            <SelectItem value="90days">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="h-[200px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="name" className="text-xs text-muted-foreground" />
            <YAxis className="text-xs text-muted-foreground" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: "hsl(var(--card))", 
                border: "1px solid hsl(var(--border))",
                borderRadius: "var(--radius)",
              }}
            />
            <Bar dataKey="tokens" fill="hsl(var(--primary))" radius={4} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="flex justify-between items-center rounded-lg border p-3">
        <div>
          <div className="text-sm font-medium">Total tokens used</div>
          <div className="text-2xl font-bold">25</div>
        </div>
        <div>
          <div className="text-sm font-medium">Available tokens</div>
          <div className="text-2xl font-bold">25</div>
        </div>
      </div>
    </div>
  );
}