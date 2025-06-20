"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Upload, Image as ImageIcon, Wand2, AlertCircle, CheckCircle2, X } from "lucide-react";
import Image from "next/image";

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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  name: z.string().min(3, { message: "Product name must be at least 3 characters." }),
  description: z.string().optional(),
  category: z.string().min(1, { message: "Please select a category." }),
  price: z.string().min(1, { message: "Price is required." }),
  image: z.any().optional(),
  enhancementPrompt: z.string().optional(),
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

export default function CreateProductPage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStatus, setGenerationStatus] = useState<"idle" | "processing" | "complete" | "error">("idle");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      category: "",
      price: "",
      enhancementPrompt: "",
    },
  });

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
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
    setGeneratedImage(null);
    setGenerationStatus("idle");
  };

  const generateOptimizedImage = async () => {
    if (!selectedImage) {
      toast({
        variant: "destructive",
        title: "No image selected",
        description: "Please upload an image first.",
      });
      return;
    }

    setIsGenerating(true);
    setGenerationStatus("processing");

    try {
      // Convert image to base64
      const base64Image = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.readAsDataURL(selectedImage);
      });

      const category = form.getValues("category");
      const customPrompt = form.getValues("enhancementPrompt");
      
      // Create enhancement prompt based on category and custom input
      let enhancementPrompt = `Create a perfect, clean PNG image of this ${category || "product"} optimized for AR try-on. The image should have:
- Transparent background (no background at all)
- Perfect lighting and shadows
- High contrast and sharp details
- Centered and properly oriented
- Optimal size and proportions for virtual try-on
- Professional product photography quality`;

      if (customPrompt) {
        enhancementPrompt += `\n\nAdditional requirements: ${customPrompt}`;
      }

      // Call ChatGPT API to generate optimized image
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageData: base64Image,
          prompt: enhancementPrompt,
          category: category,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate optimized image');
      }

      const result = await response.json();
      
      if (result.success) {
        setGeneratedImage(result.imageUrl);
        setGenerationStatus("complete");
        toast({
          title: "Image optimized successfully",
          description: "Your product image has been optimized for AR try-on.",
        });
      } else {
        throw new Error(result.error || 'Failed to generate image');
      }
    } catch (error) {
      setGenerationStatus("error");
      toast({
        variant: "destructive",
        title: "Generation failed",
        description: "There was an error optimizing your image. Please try again.",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!generatedImage && !selectedImage) {
      toast({
        variant: "destructive",
        title: "Image required",
        description: "Please upload and optimize an image for your product.",
      });
      return;
    }

    try {
      // Here you would save the product to your database
      // For now, we'll simulate the process
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Product created successfully",
        description: "Your product has been added to your catalog.",
      });
      
      router.push("/products");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create product. Please try again.",
      });
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Create Product</h2>
        <p className="text-muted-foreground">
          Add a new product with AI-optimized images for AR try-on
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Product Form */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Product Information</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Blue Aviator Sunglasses" {...field} />
                        </FormControl>
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
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category.value} value={category.value}>
                                {category.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Category helps optimize the image for AR try-on
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price</FormLabel>
                        <FormControl>
                          <Input placeholder="99.99" type="number" step="0.01" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description (Optional)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Premium aviator sunglasses with UV protection..."
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="enhancementPrompt"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Enhancement Instructions (Optional)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Make the lenses more reflective, adjust the frame color to be more vibrant..."
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Specific instructions for AI image optimization
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={!generatedImage && !selectedImage}
                  >
                    Create Product
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        {/* Image Upload and Processing */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Product Image</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {!imagePreview ? (
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8">
                  <div className="text-center">
                    <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground" />
                    <div className="mt-4">
                      <label htmlFor="image-upload" className="cursor-pointer">
                        <span className="mt-2 block text-sm font-medium text-foreground">
                          Upload product image
                        </span>
                        <span className="mt-1 block text-xs text-muted-foreground">
                          PNG, JPG, GIF up to 10MB
                        </span>
                      </label>
                      <input
                        id="image-upload"
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageUpload}
                      />
                    </div>
                    <Button className="mt-4" asChild>
                      <label htmlFor="image-upload" className="cursor-pointer">
                        <Upload className="mr-2 h-4 w-4" />
                        Choose Image
                      </label>
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative">
                    <div className="aspect-square relative overflow-hidden rounded-lg border">
                      <Image
                        src={imagePreview}
                        alt="Product preview"
                        className="object-cover"
                        fill
                      />
                    </div>
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={removeImage}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  {generationStatus === "idle" && (
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Ready to optimize</AlertTitle>
                      <AlertDescription>
                        Click "Optimize for AR" to generate a perfect image for virtual try-on.
                      </AlertDescription>
                    </Alert>
                  )}

                  <Button
                    onClick={generateOptimizedImage}
                    disabled={isGenerating}
                    className="w-full"
                  >
                    {isGenerating && (
                      <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    )}
                    {isGenerating ? "Optimizing..." : "Optimize for AR"}
                    <Wand2 className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Generation Status */}
          {generationStatus !== "idle" && (
            <Card>
              <CardHeader>
                <CardTitle>AI Optimization</CardTitle>
              </CardHeader>
              <CardContent>
                {generationStatus === "processing" && (
                  <div className="flex flex-col items-center justify-center py-8 space-y-4">
                    <div className="h-16 w-16 rounded-full border-4 border-primary border-t-transparent animate-spin" />
                    <div className="text-center">
                      <h3 className="text-lg font-medium">Optimizing Image</h3>
                      <p className="text-sm text-muted-foreground">
                        AI is enhancing your image for perfect AR try-on...
                      </p>
                    </div>
                  </div>
                )}

                {generationStatus === "complete" && generatedImage && (
                  <div className="space-y-4">
                    <Alert>
                      <CheckCircle2 className="h-4 w-4" />
                      <AlertTitle>Optimization Complete!</AlertTitle>
                      <AlertDescription>
                        Your image has been optimized for AR try-on with transparent background and perfect sizing.
                      </AlertDescription>
                    </Alert>
                    <div className="aspect-square relative overflow-hidden rounded-lg border bg-checkered">
                      <Image
                        src={generatedImage}
                        alt="Optimized product"
                        className="object-contain"
                        fill
                      />
                    </div>
                  </div>
                )}

                {generationStatus === "error" && (
                  <div className="flex flex-col items-center justify-center py-8 space-y-4">
                    <AlertCircle className="h-16 w-16 text-destructive" />
                    <div className="text-center">
                      <h3 className="text-lg font-medium">Optimization Failed</h3>
                      <p className="text-sm text-muted-foreground">
                        There was an error optimizing your image. Please try again.
                      </p>
                    </div>
                    <Button variant="outline" onClick={() => setGenerationStatus("idle")}>
                      Try Again
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}