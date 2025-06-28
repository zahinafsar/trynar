"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Cuboid as Cube, Package, ShoppingCart, Users, TrendingUp, ArrowUp } from "lucide-react";

const stats = [
  {
    title: "Total Products",
    value: "24",
    change: "+4 from last month",
    icon: Package,
    color: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/20",
    shadowColor: "shadow-blue-500/10",
  },
  {
    title: "3D Models Created",
    value: "18",
    change: "+2 from last month",
    icon: Cube,
    color: "from-purple-500 to-pink-500",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/20",
    shadowColor: "shadow-purple-500/10",
  },
  {
    title: "AR Try-ons",
    value: "387",
    change: "+42 from last month",
    icon: Users,
    color: "from-green-500 to-emerald-500",
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500/20",
    shadowColor: "shadow-green-500/10",
  },
  {
    title: "Available Tokens",
    value: "25",
    change: "5 used this month",
    icon: ShoppingCart,
    color: "from-orange-500 to-red-500",
    bgColor: "bg-orange-500/10",
    borderColor: "border-orange-500/20",
    shadowColor: "shadow-orange-500/10",
  },
];

export function DashboardStats() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: index * 0.1 }}
          whileHover={{ scale: 1.02, y: -2 }}
          className="group"
        >
          <Card className={`bg-slate-900/50 backdrop-blur-xl ${stat.borderColor} ${stat.shadowColor} shadow-2xl transition-all duration-300 group-hover:shadow-3xl overflow-hidden relative`}>
            {/* Animated background gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-5 group-hover:opacity-10 transition-opacity duration-300`} />
            
            {/* Floating particles effect */}
            <div className="absolute inset-0 overflow-hidden">
              {Array.from({ length: 3 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-white/20 rounded-full"
                  style={{
                    left: `${20 + i * 30}%`,
                    top: `${20 + i * 20}%`,
                  }}
                  animate={{
                    y: [0, -10, 0],
                    opacity: [0.2, 0.6, 0.2],
                  }}
                  transition={{
                    duration: 2 + i * 0.5,
                    repeat: Infinity,
                    delay: i * 0.3,
                  }}
                />
              ))}
            </div>

            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative z-10">
              <CardTitle className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors duration-300">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-xl ${stat.bgColor} group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon className={`h-4 w-4 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`} />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="flex items-baseline space-x-2">
                <div className={`text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                  {stat.value}
                </div>
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="flex items-center"
                >
                  <ArrowUp className="h-3 w-3 text-green-400 mr-1" />
                </motion.div>
              </div>
              <p className="text-xs text-gray-400 mt-2 group-hover:text-gray-300 transition-colors duration-300">
                {stat.change}
              </p>
            </CardContent>

            {/* Hover glow effect */}
            <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-lg`} />
          </Card>
        </motion.div>
      ))}
    </div>
  );
}