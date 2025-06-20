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
  category: z.string().min(1, { message: "Please select a category." }),
  instructions: z.string().optional(),
  image: z.any().optional(),
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
      category: "",
      instructions: "",
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
      setGenerationStatus("idle");
      setGeneratedImage(null);
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

    const formValues = form.getValues();
    if (!formValues.name || !formValues.category) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please fill in the product name and category first.",
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

      // Generate prompt based on form inputs
      const categoryPrompts = {
        sunglasses: "sunglasses with perfect lens reflection and frame details",
        eyeglasses: "eyeglasses with clear lenses and precise frame geometry",
        hats: "hat with proper shape and texture details",
        jewelry: "jewelry piece with metallic shine and gemstone details",
        watches: "watch with clear face and band details",
        masks: "face mask with proper fit and material texture",
        headphones: "headphones with sleek design and proper proportions",
        other: "product with enhanced details and professional appearance"
      };

      const categorySpecific = categoryPrompts[formValues.category as keyof typeof categoryPrompts] || categoryPrompts.other;
      
      const generatedPrompt = `Create a perfect PNG image of ${formValues.name} (${categorySpecific}) optimized for AR try-on applications.

Requirements:
- Completely transparent background (no background at all)
- Professional product photography quality
- Perfect lighting with subtle shadows
- High contrast and sharp details
- Centered and properly oriented for virtual try-on
- Clean edges with no artifacts
- Optimal size and proportions
- Premium catalog-quality appearance

${formValues.instructions ? `Additional specifications: ${formValues.instructions}` : ''}

The image should look like it was photographed in a professional studio with perfect lighting, ready to be overlaid on a person's face/head in an AR application.`;

      // Call ChatGPT API to generate optimized image
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageData: base64Image,
          prompt: generatedPrompt,
          productName: formValues.name,
          category: formValues.category,
          instructions: formValues.instructions,
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
    if (!generatedImage) {
      toast({
        variant: "destructive",
        title: "Image optimization required",
        description: "Please upload an image and generate the optimized version first.",
      });
      return;
    }

    try {
      // Here you would save the product to your database
      // For now, we'll simulate the process
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Product created successfully",
        description: "Your product has been added to your catalog with optimized AR image.",
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
              <CardTitle>Product Details</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Blue Aviator Sunglasses" {...field} />
                        </FormControl>
                        <FormDescription>
                          This will be used in the AI prompt for image generation
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
                          Category determines specific optimization for AR try-on
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="instructions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Enhancement Instructions (Optional)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Make the lenses more reflective, adjust colors to be more vibrant, enhance metallic finish..."
                            className="resize-none"
                            rows={4}
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Specific instructions for AI to enhance your product image
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={!generatedImage}
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
                        Fill in the product details above, then click "Generate AR-Ready Image" to create a perfect image for virtual try-on.
                      </AlertDescription>
                    </Alert>
                  )}

                  <Button
                    onClick={generateOptimizedImage}
                    disabled={isGenerating || !form.watch("name") || !form.watch("category")}
                    className="w-full"
                  >
                    {isGenerating && (
                      <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    )}
                    {isGenerating ? "Generating..." : "Generate AR-Ready Image"}
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
                <CardTitle>AI Image Generation</CardTitle>
              </CardHeader>
              <CardContent>
                {generationStatus === "processing" && (
                  <div className="flex flex-col items-center justify-center py-8 space-y-4">
                    <div className="h-16 w-16 rounded-full border-4 border-primary border-t-transparent animate-spin" />
                    <div className="text-center">
                      <h3 className="text-lg font-medium">Generating AR-Ready Image</h3>
                      <p className="text-sm text-muted-foreground">
                        ChatGPT is creating a perfect image for AR try-on...
                      </p>
                    </div>
                  </div>
                )}

                {generationStatus === "complete" && generatedImage && (
                  <div className="space-y-4">
                    <Alert>
                      <CheckCircle2 className="h-4 w-4" />
                      <AlertTitle>Generation Complete!</AlertTitle>
                      <AlertDescription>
                        Your AR-ready image has been generated with transparent background and perfect optimization.
                      </AlertDescription>
                    </Alert>
                    <div className="aspect-square relative overflow-hidden rounded-lg border bg-checkered">
                      <Image
                        src={generatedImage}
                        alt="Generated AR-ready product"
                        className="object-contain"
                        fill
                      />
                    </div>
                    <Button
                      variant="outline"
                      onClick={generateOptimizedImage}
                      className="w-full"
                      disabled={isGenerating}
                    >
                      <Wand2 className="mr-2 h-4 w-4" />
                      Regenerate Image
                    </Button>
                  </div>
                )}

                {generationStatus === "error" && (
                  <div className="flex flex-col items-center justify-center py-8 space-y-4">
                    <AlertCircle className="h-16 w-16 text-destructive" />
                    <div className="text-center">
                      <h3 className="text-lg font-medium">Generation Failed</h3>
                      <p className="text-sm text-muted-foreground">
                        There was an error generating your AR-ready image. Please try again.
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