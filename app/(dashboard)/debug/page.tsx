"use client";

import { useState, useEffect } from "react";
import { ModelsService } from "@/lib/models";
import { ModelRow } from "@/types/db";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Database, User } from "lucide-react";

export default function DebugPage() {
  const [models, setModels] = useState<ModelRow[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get current user
        const { data: { user: currentUser }, error: userError } = await supabase.auth.getUser();
        
        if (userError) {
          throw new Error(`User error: ${userError.message}`);
        }

        if (!currentUser) {
          setError("No user authenticated");
          setLoading(false);
          return;
        }

        setUser(currentUser);
        console.log("Current user:", currentUser);

        // Fetch all models for the user
        const userModels = await ModelsService.getUserModels(currentUser.id);
        console.log("User models:", userModels);
        setModels(userModels);

      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Unknown error";
        setError(errorMessage);
        console.error("Debug page error:", err);
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-16 w-16 rounded-full border-4 border-purple-500 border-t-transparent animate-spin" />
          <p className="text-lg font-medium text-white">Loading debug info...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-8">
      <div>
        <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
          Database Debug
        </h1>
        <p className="text-gray-300">
          This page helps you debug database issues and check what models exist.
        </p>
      </div>

      {/* User Info */}
      <Card className="bg-slate-900/50 backdrop-blur-xl border border-purple-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            User Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          {user ? (
            <div className="space-y-2">
              <p><strong>ID:</strong> {user.id}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Created:</strong> {new Date(user.created_at).toLocaleString()}</p>
            </div>
          ) : (
            <p className="text-red-400">No user authenticated</p>
          )}
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <Card className="bg-red-900/20 border border-red-500/20">
          <CardHeader>
            <CardTitle className="text-red-400">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-300">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Models List */}
      <Card className="bg-slate-900/50 backdrop-blur-xl border border-purple-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Models in Database ({models.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {models.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400 mb-4">No models found in database</p>
              <p className="text-sm text-gray-500">
                This means you need to create some products first. 
                Go to <a href="/products/create" className="text-purple-400 hover:underline">Create Product</a> to add your first model.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {models.map((model) => (
                <div key={model.id} className="p-4 border border-purple-500/20 rounded-lg bg-slate-800/30">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-white">{model.name}</h3>
                    <Badge className="bg-purple-500/20 text-purple-300">
                      ID: {model.id}
                    </Badge>
                  </div>
                  <div className="space-y-1 text-sm text-gray-300">
                    <p><strong>Category:</strong> {model.category || 'None'}</p>
                    <p><strong>Created:</strong> {new Date(model.created_at).toLocaleString()}</p>
                    <p><strong>User:</strong> {model.user}</p>
                    <p><strong>Image URL:</strong> {model.image_url ? 'Yes' : 'No'}</p>
                    {model.image_url && (
                      <p className="text-xs text-gray-400 break-all">{model.image_url}</p>
                    )}
                  </div>
                  <div className="mt-3 flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => window.open(`/products/${model.id}`, '_blank')}
                      className="border-purple-500/30 text-gray-300 hover:bg-purple-900/20"
                    >
                      View Details
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => window.open(`/try-on/${model.id}`, '_blank')}
                      className="border-purple-500/30 text-gray-300 hover:bg-purple-900/20"
                    >
                      Try AR
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="bg-slate-900/50 backdrop-blur-xl border border-purple-500/20">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Button 
              asChild
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
            >
              <a href="/products/create">Create New Product</a>
            </Button>
            <Button 
              variant="outline"
              asChild
              className="border-purple-500/30 text-gray-300 hover:bg-purple-900/20"
            >
              <a href="/products">View All Products</a>
            </Button>
            <Button 
              variant="outline"
              onClick={() => window.location.reload()}
              className="border-purple-500/30 text-gray-300 hover:bg-purple-900/20"
            >
              Refresh Data
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 