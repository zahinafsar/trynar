import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardStats } from "@/components/dashboard/dashboard-stats";
import { RecentModels } from "@/components/dashboard/recent-models";
import { TokenUsage } from "@/components/dashboard/token-usage";
import { QuickActions } from "@/components/dashboard/quick-actions";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Header Section with Gradient Text */}
      <div className="space-y-4">
        <h2 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Dashboard
        </h2>
        <p className="text-lg text-gray-300 max-w-2xl">
          Overview of your 3D models, products, and token usage. Monitor your AR experiences and track performance metrics.
        </p>
      </div>
      
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-slate-900/50 backdrop-blur-xl border border-purple-500/20">
          <TabsTrigger 
            value="overview" 
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger 
            value="analytics"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white"
          >
            Analytics
          </TabsTrigger>
          <TabsTrigger 
            value="reports"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white"
          >
            Reports
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-8">
          <DashboardStats />
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-7">
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
          </div>
          
          <QuickActions />
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-6">
          <Card className="bg-slate-900/50 backdrop-blur-xl border border-purple-500/20 shadow-xl shadow-black/10">
            <CardHeader className="border-b border-purple-500/10">
              <CardTitle className="text-xl font-semibold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Analytics Dashboard
              </CardTitle>
              <CardDescription className="text-gray-300">
                Detailed analytics about your 3D models and AR experiences performance.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <div className="h-[400px] flex items-center justify-center border border-purple-500/20 rounded-xl bg-gradient-to-br from-purple-900/20 to-pink-900/20 backdrop-blur-sm">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Analytics Coming Soon</h3>
                    <p className="text-gray-300 max-w-md">
                      Advanced analytics and insights about your 3D models, user engagement, and AR try-on performance will be available here.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reports" className="space-y-6">
          <Card className="bg-slate-900/50 backdrop-blur-xl border border-purple-500/20 shadow-xl shadow-black/10">
            <CardHeader className="border-b border-purple-500/10">
              <CardTitle className="text-xl font-semibold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Reports & Exports
              </CardTitle>
              <CardDescription className="text-gray-300">
                Export and manage comprehensive reports about your 3D model generation and usage.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <div className="h-[400px] flex items-center justify-center border border-purple-500/20 rounded-xl bg-gradient-to-br from-purple-900/20 to-pink-900/20 backdrop-blur-sm">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Reports Coming Soon</h3>
                    <p className="text-gray-300 max-w-md">
                      Detailed reports, export functionality, and data insights about your 3D model generation and AR experiences will be available here.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}