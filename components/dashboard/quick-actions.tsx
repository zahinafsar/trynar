"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Cuboid as Cube, Package, CreditCard, Settings, ArrowRight, Sparkles } from "lucide-react";

const actions = [
  {
    title: "Create 3D Model",
    description: "Generate a new 3D model from a product",
    icon: Cube,
    href: "/models/create",
    color: "from-purple-500 to-pink-500",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/20",
  },
  {
    title: "Manage Products",
    description: "View and manage your product list",
    icon: Package,
    href: "/products",
    color: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/20",
  },
  {
    title: "Buy Tokens",
    description: "Purchase tokens for 3D model generation",
    icon: CreditCard,
    href: "/tokens",
    color: "from-green-500 to-emerald-500",
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500/20",
  },
  {
    title: "Settings",
    description: "Configure your account settings",
    icon: Settings,
    href: "/settings",
    color: "from-orange-500 to-red-500",
    bgColor: "bg-orange-500/10",
    borderColor: "border-orange-500/20",
  },
];

export function QuickActions() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Card className="bg-slate-900/50 backdrop-blur-xl border border-purple-500/20 shadow-2xl shadow-purple-500/10 overflow-hidden relative">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-blue-500/5" />
        
        <CardHeader className="border-b border-purple-500/20 bg-gradient-to-r from-slate-900/80 to-purple-900/30 relative z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-500/20">
              <Sparkles className="h-5 w-5 text-purple-400" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Quick Actions
              </CardTitle>
              <CardDescription className="text-gray-400">
                Get started with these common tasks and streamline your workflow
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-8 relative z-10">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {actions.map((action, index) => (
              <motion.div
                key={action.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="group"
              >
                <Button
                  asChild
                  variant="outline"
                  className={`h-auto w-full p-0 bg-slate-900/50 backdrop-blur-sm ${action.borderColor} hover:bg-slate-800/50 transition-all duration-300 group-hover:shadow-lg overflow-hidden relative`}
                >
                  <Link href={action.href}>
                    {/* Hover gradient overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${action.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                    
                    <div className="relative z-10 flex flex-col items-start justify-start space-y-4 p-6 text-left w-full">
                      {/* Icon with gradient background */}
                      <div className={`p-3 rounded-xl ${action.bgColor} group-hover:scale-110 transition-transform duration-300`}>
                        <action.icon className={`h-6 w-6 bg-gradient-to-r ${action.color} bg-clip-text text-transparent`} />
                      </div>
                      
                      {/* Content */}
                      <div className="space-y-2 flex-1">
                        <h3 className="font-semibold text-white group-hover:text-white transition-colors duration-300">
                          {action.title}
                        </h3>
                        <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-300 leading-relaxed">
                          {action.description}
                        </p>
                      </div>
                      
                      {/* Arrow indicator */}
                      <div className="flex items-center justify-between w-full">
                        <div className={`h-1 w-8 bg-gradient-to-r ${action.color} rounded-full opacity-60 group-hover:opacity-100 transition-opacity duration-300`} />
                        <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-white group-hover:translate-x-1 transition-all duration-300" />
                      </div>
                    </div>
                  </Link>
                </Button>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}