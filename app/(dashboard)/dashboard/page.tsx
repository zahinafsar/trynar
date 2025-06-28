"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardStats } from "@/components/dashboard/dashboard-stats";
import { RecentModels } from "@/components/dashboard/recent-models";
import { TokenUsage } from "@/components/dashboard/token-usage";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { Sparkles, TrendingUp, Zap, Star } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-purple-950/30 to-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,_rgba(147,51,234,0.15)_0%,_transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,_rgba(59,130,246,0.1)_0%,_transparent_50%)]" />
        
        {/* Floating particles */}
        <div className="absolute inset-0">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white/20 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.2, 0.8, 0.2],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 space-y-8">
        {/* Hero Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-6 py-12"
        >
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-purple-500/20 backdrop-blur-xl rounded-full border border-purple-500/30">
            <Sparkles className="w-5 h-5 text-purple-400" />
            <span className="text-sm font-medium text-purple-300">
              Welcome to your Dashboard
            </span>
          </div>

          <div className="space-y-4">
            <h1 className="text-5xl sm:text-6xl font-bold">
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                Your Creative Hub
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Monitor your 3D models, track performance, and manage your AR experiences all in one place.
            </p>
          </div>

          {/* Feature highlights */}
          <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
            {[
              { icon: Star, text: "AI-Generated Models", color: "text-yellow-400" },
              { icon: TrendingUp, text: "Real-time Analytics", color: "text-green-400" },
              { icon: Zap, text: "Instant Processing", color: "text-blue-400" },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm rounded-full border border-white/10"
              >
                <feature.icon className={`w-4 h-4 ${feature.color}`} />
                <span className="text-sm text-gray-300">{feature.text}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Dashboard Content */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="max-w-7xl mx-auto px-6"
        >
          <Tabs defaultValue="overview" className="space-y-8">
            {/* Glass Morphism Tab List */}
            <div className="flex justify-center">
              <TabsList className="bg-slate-900/50 backdrop-blur-xl border border-purple-500/20 p-2 rounded-2xl">
                <TabsTrigger 
                  value="overview" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white rounded-xl px-6 py-3 font-medium transition-all duration-300"
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger 
                  value="analytics" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-cyan-600 data-[state=active]:text-white rounded-xl px-6 py-3 font-medium transition-all duration-300"
                >
                  Analytics
                </TabsTrigger>
                <TabsTrigger 
                  value="reports" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-600 data-[state=active]:to-emerald-600 data-[state=active]:text-white rounded-xl px-6 py-3 font-medium transition-all duration-300"
                >
                  Reports
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="overview" className="space-y-8">
              {/* Stats Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <DashboardStats />
              </motion.div>
              
              {/* Main Content Grid */}
              <div className="grid gap-8 lg:grid-cols-3">
                {/* Recent Models - Takes 2 columns */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="lg:col-span-2"
                >
                  <Card className="bg-slate-900/50 backdrop-blur-xl border border-purple-500/20 shadow-2xl shadow-purple-500/10">
                    <CardHeader className="border-b border-purple-500/20 bg-gradient-to-r from-slate-900/80 to-purple-900/30">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-purple-500/20">
                          <Star className="h-5 w-5 text-purple-400" />
                        </div>
                        <div>
                          <CardTitle className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                            Recent 3D Models
                          </CardTitle>
                          <CardDescription className="text-gray-400">
                            Your most recently created 3D models and their status.
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6">
                      <RecentModels />
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Token Usage - Takes 1 column */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                >
                  <Card className="bg-slate-900/50 backdrop-blur-xl border border-blue-500/20 shadow-2xl shadow-blue-500/10">
                    <CardHeader className="border-b border-blue-500/20 bg-gradient-to-r from-slate-900/80 to-blue-900/30">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-blue-500/20">
                          <TrendingUp className="h-5 w-5 text-blue-400" />
                        </div>
                        <div>
                          <CardTitle className="text-lg font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                            Token Usage
                          </CardTitle>
                          <CardDescription className="text-gray-400">
                            Your token consumption over time.
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6">
                      <TokenUsage />
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
              
              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
              >
                <QuickActions />
              </motion.div>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-8">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
              >
                <Card className="bg-slate-900/50 backdrop-blur-xl border border-blue-500/20 shadow-2xl shadow-blue-500/10">
                  <CardHeader className="border-b border-blue-500/20 bg-gradient-to-r from-slate-900/80 to-blue-900/30">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500/20 to-cyan-500/20">
                        <TrendingUp className="h-6 w-6 text-blue-400" />
                      </div>
                      <div>
                        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                          Advanced Analytics
                        </CardTitle>
                        <CardDescription className="text-gray-400">
                          Detailed insights about your 3D models and AR experiences performance.
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-8">
                    <div className="h-[400px] flex items-center justify-center border border-dashed border-blue-500/30 rounded-2xl bg-gradient-to-br from-blue-500/5 to-cyan-500/5">
                      <div className="text-center space-y-4">
                        <div className="p-4 rounded-full bg-blue-500/10 w-fit mx-auto">
                          <TrendingUp className="h-12 w-12 text-blue-400" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-white mb-2">Analytics Dashboard</h3>
                          <p className="text-gray-400 max-w-md">
                            Comprehensive analytics data will be displayed here, including model performance, user engagement, and conversion metrics.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            <TabsContent value="reports" className="space-y-8">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
              >
                <Card className="bg-slate-900/50 backdrop-blur-xl border border-green-500/20 shadow-2xl shadow-green-500/10">
                  <CardHeader className="border-b border-green-500/20 bg-gradient-to-r from-slate-900/80 to-green-900/30">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-xl bg-gradient-to-r from-green-500/20 to-emerald-500/20">
                        <Zap className="h-6 w-6 text-green-400" />
                      </div>
                      <div>
                        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                          Reports & Exports
                        </CardTitle>
                        <CardDescription className="text-gray-400">
                          Generate and download comprehensive reports about your 3D model generation and usage.
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-8">
                    <div className="h-[400px] flex items-center justify-center border border-dashed border-green-500/30 rounded-2xl bg-gradient-to-br from-green-500/5 to-emerald-500/5">
                      <div className="text-center space-y-4">
                        <div className="p-4 rounded-full bg-green-500/10 w-fit mx-auto">
                          <Zap className="h-12 w-12 text-green-400" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-white mb-2">Report Generation</h3>
                          <p className="text-gray-400 max-w-md">
                            Export detailed reports about your 3D model generation, token usage, and performance metrics in various formats.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}