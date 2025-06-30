"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, AlertCircle, CheckCircle2, Shield } from "lucide-react";
import { motion } from "framer-motion";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { signIn } from "@/lib/auth";
import { GalaxyEffect } from "@/components/ui/3d-effects";

type ImpersonationState = 'parsing' | 'authenticating' | 'success' | 'error';

export default function ImpersonatePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  
  const [state, setState] = useState<ImpersonationState>('parsing');
  const [error, setError] = useState<string | null>(null);
  const [credentials, setCredentials] = useState<{ email: string; password: string } | null>(null);

  useEffect(() => {
    const handleImpersonation = async () => {
      try {
        setState('parsing');
        setError(null);

        // Get token from URL parameters
        const token = searchParams.get('token');
        
        if (!token) {
          throw new Error('No impersonation token provided');
        }

        // Parse the token (format: "email|password")
        const decodedToken = decodeURIComponent(token);
        const parts = decodedToken.split('|');
        
        if (parts.length !== 2) {
          throw new Error('Invalid token format. Expected format: email|password');
        }

        const [email, password] = parts;
        
        if (!email || !password) {
          throw new Error('Email and password are required');
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          throw new Error('Invalid email format');
        }

        setCredentials({ email, password });
        
        // Attempt to sign in
        setState('authenticating');
        
        const result = await signIn(email, password);
        
        if (result.success) {
          setState('success');
          
          toast({
            title: "Impersonation successful",
            description: `Logged in as ${email}`,
          });

          // Redirect to dashboard after a short delay
          setTimeout(() => {
            router.push("/dashboard");
          }, 1500);
        } else {
          throw new Error(result.error || 'Authentication failed');
        }
        
      } catch (err) {
        console.error('Impersonation error:', err);
        setState('error');
        setError(err instanceof Error ? err.message : 'An unexpected error occurred');
        
        toast({
          variant: "destructive",
          title: "Impersonation failed",
          description: err instanceof Error ? err.message : 'An unexpected error occurred',
        });
      }
    };

    handleImpersonation();
  }, [searchParams, router, toast]);

  const getStateConfig = () => {
    switch (state) {
      case 'parsing':
        return {
          icon: <Loader2 className="h-8 w-8 animate-spin text-blue-500" />,
          title: "Parsing Token",
          description: "Extracting authentication credentials...",
          color: "from-blue-500 to-cyan-500"
        };
      case 'authenticating':
        return {
          icon: <Loader2 className="h-8 w-8 animate-spin text-purple-500" />,
          title: "Authenticating",
          description: credentials ? `Logging in as ${credentials.email}...` : "Authenticating user...",
          color: "from-purple-500 to-pink-500"
        };
      case 'success':
        return {
          icon: <CheckCircle2 className="h-8 w-8 text-green-500" />,
          title: "Success!",
          description: "Authentication successful. Redirecting to dashboard...",
          color: "from-green-500 to-emerald-500"
        };
      case 'error':
        return {
          icon: <AlertCircle className="h-8 w-8 text-red-500" />,
          title: "Authentication Failed",
          description: error || "An unexpected error occurred",
          color: "from-red-500 to-orange-500"
        };
    }
  };

  const config = getStateConfig();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      <GalaxyEffect />

      <div className="mx-auto w-full max-w-md space-y-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-2"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="p-3 rounded-full bg-gradient-to-r from-purple-600 to-pink-600">
              <Shield className="h-6 w-6 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
            User Impersonation
          </h1>
          <p className="text-gray-300">
            Authenticating with provided credentials
          </p>
        </motion.div>

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-slate-900/50 backdrop-blur-xl border border-purple-500/20 shadow-xl shadow-black/10">
            <CardHeader className="text-center border-b border-purple-500/10">
              <CardTitle className="flex items-center justify-center gap-3">
                <div className={`p-3 rounded-full bg-gradient-to-r ${config.color}`}>
                  {config.icon}
                </div>
                <span className="text-xl font-semibold text-white">
                  {config.title}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              {/* Status Description */}
              <div className="text-center">
                <p className="text-gray-300 leading-relaxed">
                  {config.description}
                </p>
              </div>

              {/* Credentials Display (when available) */}
              {credentials && state !== 'error' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-3"
                >
                  <div className="p-4 bg-slate-800/50 rounded-lg border border-purple-500/20">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-400">Email:</span>
                        <span className="text-sm font-medium text-white">{credentials.email}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-400">Password:</span>
                        <span className="text-sm font-medium text-white">{'•'.repeat(credentials.password.length)}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Error Display */}
              {state === 'error' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Alert variant="destructive" className="border-red-500/20 bg-red-900/20">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Authentication Error</AlertTitle>
                    <AlertDescription className="mt-2">
                      {error}
                    </AlertDescription>
                  </Alert>
                </motion.div>
              )}

              {/* Success Actions */}
              {state === 'success' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-3"
                >
                  <div className="flex items-center justify-center gap-2 text-green-400">
                    <CheckCircle2 className="h-5 w-5" />
                    <span className="text-sm font-medium">Redirecting to dashboard...</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <motion.div
                      className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 1.5 }}
                    />
                  </div>
                </motion.div>
              )}

              {/* Error Actions */}
              {state === 'error' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-3"
                >
                  <Button
                    variant="outline"
                    onClick={() => window.location.reload()}
                    className="flex-1 border-purple-500/30 text-gray-300 hover:bg-purple-900/20"
                  >
                    Try Again
                  </Button>
                  <Button
                    onClick={() => router.push('/login')}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                  >
                    Go to Login
                  </Button>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Security Notice */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center"
        >
          <Alert className="border-amber-500/20 bg-amber-900/20">
            <Shield className="h-4 w-4 text-amber-400" />
            <AlertDescription className="text-amber-200">
              <strong>Security Notice:</strong> This is an administrative impersonation feature. 
              Use only for authorized testing and support purposes.
            </AlertDescription>
          </Alert>
        </motion.div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}