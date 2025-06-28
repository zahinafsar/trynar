"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Cuboid as Cube,
  CheckCircle2,
  AlertCircle,
  Upload,
  X,
} from "lucide-react";
import Image from "next/image";

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
import { StorageService } from "@/lib/storage";
import { ModelsService } from "@/lib/models";
import { supabase } from "@/lib/supabase";

const formSchema = z.object({
  modelName: z.string().min(1, { message: "Model name is required." }),
  productUrl: z
    .string()
    .url({ message: "Please enter a valid URL." })
    .optional(),
  quality: z.enum(["standard", "high", "ultra"]),
  category: z.string().min(1, { message: "Please select a category." }),
  productImage: z.any().optional(),
});

const categories = [
  { value: "sunglasses", label: "Sunglasses" },
  { value: "eyeglasses", label: "Eyeglasses" },
  { value: "hats", label: "Hats & Caps" },
  { value: "jewelry", label: "Jewelry" },
  { value: "watches", label: "Watches" },
  { value: "masks", label: "Face Masks" },
  { value: "headphones", label: "Headphones" },
  { value: "other", label: "Other" },
];

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
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();
  const { balance, loading: tokensLoading, consumeTokens } = useTokens();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      modelName: "",
      productUrl: "",
      quality: "standard",
      category: "",
    },
  });

  const selectedQuality = form.watch("quality");
  const tokenCost = qualityTokenCosts[selectedQuality];

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          variant: "destructive",
          title: "File too large",
          description: "Please select an image smaller than 5MB.",
        });
        return;
      }

      // Check file type
      if (!file.type.startsWith("image/")) {
        toast({
          variant: "destructive",
          title: "Invalid file type",
          description: "Please select an image file.",
        });
        return;
      }

      setSelectedImage(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
  };

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

    // Validate that either product URL or image is provided
    if (!values.productUrl && !selectedImage) {
      toast({
        variant: "destructive",
        title: "Missing product information",
        description: "Please provide either a product URL or upload an image.",
      });
      return;
    }

    setIsGenerating(true);
    setGenerationStatus("processing");

    try {
      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("User not authenticated");
      }

      let imageUrl: string | undefined;

      // Upload image if provided
      if (selectedImage) {
        const filePath = StorageService.generateFilePath(
          user.id,
          selectedImage.name
        );
        imageUrl = await StorageService.uploadFile(selectedImage, filePath);
      }

      // Create model record in database
      const modelData = {
        user: user.id,
        name: values.modelName,
        product_url: values.productUrl || "",
        image_url: imageUrl,
        category: values.category,
      };

      const createdModel = await ModelsService.createModel(modelData);

      // Simulate 3D model generation process
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // Consume tokens after successful generation
      await consumeTokens(tokenCost);

      setGenerationStatus("complete");
      toast({
        title: "3D Model Created",
        description: `Your 3D model "${values.modelName}" has been successfully generated using ${tokenCost} tokens.`,
      });

      // Redirect to the model page after a delay
      setTimeout(() => {
        router.push("/models");
      }, 1500);
    } catch (error) {
      setGenerationStatus("error");
      console.error("Model creation error:", error);
      toast({
        variant: "destructive",
        title: "Generation failed",
        description:
          error instanceof Error
            ? error.message
            : "There was an error creating your 3D model. Please try again.",
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
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          disabled={isGenerating}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem
                                key={category.value}
                                value={category.value}
                              >
                                {category.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Select the category that best describes your product.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-4">
                    <FormLabel>Product Information</FormLabel>
                    <p className="text-sm text-muted-foreground">
                      Provide either a product URL or upload an image of your
                      product.
                    </p>

                    <FormField
                      control={form.control}
                      name="productUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Product URL (Optional)</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="https://example.com/product"
                              {...field}
                              disabled={isGenerating}
                            />
                          </FormControl>
                          <FormDescription>
                            Enter the URL of the product page.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="space-y-2">
                      <FormLabel>Product Image (Optional)</FormLabel>
                      {!imagePreview ? (
                        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
                          <div className="flex flex-col items-center justify-center space-y-4">
                            <Upload className="h-8 w-8 text-muted-foreground" />
                            <div className="text-center">
                              <p className="text-sm font-medium">
                                Upload product image
                              </p>
                              <p className="text-xs text-muted-foreground">
                                PNG, JPG, WebP up to 5MB
                              </p>
                            </div>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              disabled={isGenerating}
                              onClick={() =>
                                document.getElementById("image-upload")?.click()
                              }
                            >
                              Choose File
                            </Button>
                            <input
                              id="image-upload"
                              type="file"
                              accept="image/*"
                              onChange={handleImageUpload}
                              className="hidden"
                              disabled={isGenerating}
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="relative border rounded-lg overflow-hidden">
                          <Image
                            src={imagePreview}
                            alt="Product preview"
                            width={400}
                            height={300}
                            className="w-full h-48 object-cover"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute top-2 right-2"
                            onClick={removeImage}
                            disabled={isGenerating}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>

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
                        <FormDescription>
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
                className="w-full"
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
          <Card className="flex-1">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center justify-center h-full space-y-4">
                {generationStatus === "idle" && (
                  <div className="flex flex-col items-center justify-center text-center space-y-4 py-12">
                    <Cube className="h-16 w-16 text-muted-foreground" />
                    <div>
                      <h3 className="text-lg font-medium">Ready to Generate</h3>
                      <p className="text-sm text-muted-foreground">
                        Fill in the form and click &quot;Generate 3D Model&quot;
                        to start.
                      </p>
                    </div>
                  </div>
                )}

                {generationStatus === "processing" && (
                  <div className="flex flex-col items-center justify-center text-center space-y-4 py-12">
                    <div className="h-16 w-16 rounded-full border-4 border-primary border-t-transparent animate-spin" />
                    <div>
                      <h3 className="text-lg font-medium">
                        Generating 3D Model
                      </h3>
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
