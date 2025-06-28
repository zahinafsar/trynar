"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Cuboid as Cube, CheckCircle2, AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { useTokens } from "@/hooks/use-tokens";

const formSchema = z.object({
  productUrl: z.string().url({ message: "Please enter a valid URL." }),
  modelName: z.string().min(1, { message: "Model name is required." }),
  quality: z.enum(["standard", "high", "ultra"]),
});

const qualityTokenCosts = {
  standard: 1,
  high: 2,
  ultra: 3,
};

export default function CreateModelPage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStatus, setGenerationStatus] = useState<
    "idle" | "processing" | "complete" | "error"
  >("idle");
  const router = useRouter();
  const { toast } = useToast();
  const { balance, loading: tokensLoading, consumeTokens } = useTokens();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productUrl: "",
      modelName: "",
      quality: "standard",
    },
  });

  const selectedQuality = form.watch("quality");
  const tokenCost = qualityTokenCosts[selectedQuality];

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (isGenerating) return;

    // Check token balance
    if (balance < tokenCost) {
      toast({
        variant: "destructive",
        title: "Insufficient tokens",
        description: `You need ${tokenCost} tokens for ${selectedQuality} quality. You have ${balance} tokens available.`,
      });
      return;
    }

    setIsGenerating(true);
    setGenerationStatus("processing");

    // Simulate 3D model generation process
    try {
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // Consume tokens after successful generation
      await consumeTokens(tokenCost);

      setGenerationStatus("complete");
      toast({
        title: "3D Model Created",
        description: `Your 3D model has been successfully generated using ${tokenCost} tokens.`,
      });

      // Redirect to the model page after a delay
      setTimeout(() => {
        router.push("/models");
      }, 1500);
    } catch (error) {
      setGenerationStatus("error");
      toast({
        variant: "destructive",
        title: "Generation failed",
        description:
          "There was an error creating your 3D model. Please try again.",
      });
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <div className="space-y-8">
      {/* Header Section with Gradient Text */}
      <div className="space-y-4">
        <h2 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Create 3D Model
        </h2>
        <p className="text-lg text-gray-300 max-w-2xl">
          Generate a new 3D model from a product URL using advanced AI technology.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <Card className="bg-slate-900/50 backdrop-blur-xl border border-purple-500/20 shadow-xl shadow-black/10">
                <CardContent className="pt-6">
                  <Alert className="mb-6 bg-purple-900/20 border-purple-500/30">
                    <AlertCircle className="h-4 w-4 text-purple-400" />
                    <AlertTitle className="text-purple-300">Token Required</AlertTitle>
                    <AlertDescription className="text-gray-300">
                      Creating a {selectedQuality} quality 3D model will use{" "}
                      {tokenCost} token{tokenCost !== 1 ? "s" : ""} from your
                      account.
                      {tokensLoading ? (
                        <span> Loading token balance...</span>
                      ) : (
                        <span>
                          {" "}
                          You currently have {balance} tokens available.
                        </span>
                      )}
                    </AlertDescription>
                  </Alert>

                  <FormField
                    control={form.control}
                    name="productUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Product URL</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://example.com/product"
                            {...field}
                            disabled={isGenerating}
                            className="bg-slate-800/50 border-purple-500/30 text-white placeholder:text-gray-400"
                          />
                        </FormControl>
                        <FormDescription className="text-gray-400">
                          Enter the URL of the product you want to create a 3D
                          model for.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="modelName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Model Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="My Product 3D Model"
                            {...field}
                            disabled={isGenerating}
                            className="bg-slate-800/50 border-purple-500/30 text-white placeholder:text-gray-400"
                          />
                        </FormControl>
                        <FormDescription className="text-gray-400">
                          Enter a name for your 3D model.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="quality"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Quality</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          disabled={isGenerating}
                        >
                          <FormControl>
                            <SelectTrigger className="bg-slate-800/50 border-purple-500/30 text-white">
                              <SelectValue placeholder="Select quality" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-slate-900 border-purple-500/20">
                            <SelectItem value="standard">
                              Standard (1 token)
                            </SelectItem>
                            <SelectItem value="high">
                              High (2 tokens)
                            </SelectItem>
                            <SelectItem value="ultra">
                              Ultra (3 tokens)
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription className="text-gray-400">
                          Higher quality models require more tokens.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 shadow-lg shadow-purple-500/25"
                disabled={isGenerating || tokensLoading || balance < tokenCost}
              >
                {isGenerating && (
                  <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                )}
                {isGenerating ? "Generating..." : "Generate 3D Model"}
                <Cube className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </Form>
        </div>

        <div className="flex flex-col space-y-6">
          <Card className="flex-1 bg-slate-900/50 backdrop-blur-xl border border-purple-500/20 shadow-xl shadow-black/10">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center justify-center h-full space-y-4">
                {generationStatus === "idle" && (
                  <div className="flex flex-col items-center justify-center text-center space-y-4 py-12">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                      <Cube className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-white">Ready to Generate</h3>
                      <p className="text-sm text-gray-300">
                        Fill in the form and click "Generate 3D Model" to start.
                      </p>
                    </div>
                  </div>
                )}

                {generationStatus === "processing" && (
                  <div className="flex flex-col items-center justify-center text-center space-y-4 py-12">
                    <div className="h-16 w-16 rounded-full border-4 border-purple-500 border-t-transparent animate-spin" />
                    <div>
                      <h3 className="text-lg font-medium text-white">
                        Generating 3D Model
                      </h3>
                      <p className="text-sm text-gray-300">
                        This may take a few minutes. Please wait...
                      </p>
                    </div>
                  </div>
                )}

                {generationStatus === "complete" && (
                  <div className="flex flex-col items-center justify-center text-center space-y-4 py-12">
                    <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full flex items-center justify-center">
                      <CheckCircle2 className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-white">3D Model Created!</h3>
                      <p className="text-sm text-gray-300">
                        Your 3D model has been successfully generated.
                      </p>
                    </div>
                  </div>
                )}

                {generationStatus === "error" && (
                  <div className="flex flex-col items-center justify-center text-center space-y-4 py-12">
                    <div className="w-16 h-16 bg-gradient-to-r from-red-600 to-pink-600 rounded-full flex items-center justify-center">
                      <AlertCircle className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-white">Generation Failed</h3>
                      <p className="text-sm text-gray-300">
                        There was an error creating your 3D model.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}