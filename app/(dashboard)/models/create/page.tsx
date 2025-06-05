"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Cuboid as Cube, AlertCircle, CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
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
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  productUrl: z.string().url({ message: "Please enter a valid URL." }),
  modelName: z.string().min(3, { message: "Model name must be at least 3 characters." }),
  quality: z.string(),
});

export default function CreateModelPage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStatus, setGenerationStatus] = useState<"idle" | "processing" | "complete" | "error">("idle");
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productUrl: "",
      modelName: "",
      quality: "standard",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (isGenerating) return;

    // Check token balance
    const tokensAvailable = 25;
    if (tokensAvailable <= 0) {
      toast({
        variant: "destructive",
        title: "No tokens available",
        description: "Please purchase tokens to create 3D models.",
      });
      return;
    }

    setIsGenerating(true);
    setGenerationStatus("processing");

    // Simulate 3D model generation process
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      setGenerationStatus("complete");
      toast({
        title: "3D Model Created",
        description: "Your 3D model has been successfully generated.",
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
        description: "There was an error creating your 3D model. Please try again.",
      });
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Create 3D Model</h2>
        <p className="text-muted-foreground">
          Generate a new 3D model from a product URL
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <Card>
                <CardContent className="pt-6">
                  <Alert className="mb-6">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Token Required</AlertTitle>
                    <AlertDescription>
                      Creating a 3D model will use 1 token from your account.
                      You currently have 25 tokens available.
                    </AlertDescription>
                  </Alert>

                  <FormField
                    control={form.control}
                    name="productUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product URL</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="https://example.com/product" 
                            {...field} 
                            disabled={isGenerating} 
                          />
                        </FormControl>
                        <FormDescription>
                          Enter the URL of the product you want to create a 3D model for.
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
                        <FormLabel>Model Name</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="My Product 3D Model" 
                            {...field} 
                            disabled={isGenerating} 
                          />
                        </FormControl>
                        <FormDescription>
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
                        <FormLabel>Quality</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value} 
                          disabled={isGenerating}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select quality" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="standard">Standard (1 token)</SelectItem>
                            <SelectItem value="high">High (2 tokens)</SelectItem>
                            <SelectItem value="ultra">Ultra (3 tokens)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Higher quality models require more tokens.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Button type="submit" className="w-full" disabled={isGenerating}>
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
          <Card className="flex-1">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center justify-center h-full space-y-4">
                {generationStatus === "idle" && (
                  <div className="flex flex-col items-center justify-center text-center space-y-4 py-12">
                    <Cube className="h-16 w-16 text-muted-foreground" />
                    <div>
                      <h3 className="text-lg font-medium">Ready to Generate</h3>
                      <p className="text-sm text-muted-foreground">
                        Fill in the form and click "Generate 3D Model" to start.
                      </p>
                    </div>
                  </div>
                )}

                {generationStatus === "processing" && (
                  <div className="flex flex-col items-center justify-center text-center space-y-4 py-12">
                    <div className="h-16 w-16 rounded-full border-4 border-primary border-t-transparent animate-spin" />
                    <div>
                      <h3 className="text-lg font-medium">Generating 3D Model</h3>
                      <p className="text-sm text-muted-foreground">
                        This may take a few minutes. Please wait...
                      </p>
                    </div>
                  </div>
                )}

                {generationStatus === "complete" && (
                  <div className="flex flex-col items-center justify-center text-center space-y-4 py-12">
                    <CheckCircle2 className="h-16 w-16 text-green-500" />
                    <div>
                      <h3 className="text-lg font-medium">3D Model Created!</h3>
                      <p className="text-sm text-muted-foreground">
                        Your 3D model has been successfully generated.
                      </p>
                    </div>
                  </div>
                )}

                {generationStatus === "error" && (
                  <div className="flex flex-col items-center justify-center text-center space-y-4 py-12">
                    <AlertCircle className="h-16 w-16 text-destructive" />
                    <div>
                      <h3 className="text-lg font-medium">Generation Failed</h3>
                      <p className="text-sm text-muted-foreground">
                        There was an error creating your 3D model. Please try again.
                      </p>
                    </div>
                    <Button variant="outline" onClick={() => setGenerationStatus("idle")}>
                      Try Again
                    </Button>
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