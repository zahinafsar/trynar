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
  name: z.string().min(3, { message: "Model name must be at least 3 characters." }),
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

export default function CreateARModelPage() {
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
        description: "Please fill in the model name and category first.",
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

      // Call API to generate optimized image
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageData: base64Image,
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
        
        // Save to database immediately after successful generation
        await saveToDatabase(formValues, result.imageUrl);
        
        toast({
          title: "AR model created successfully",
          description: "Your AR model has been generated and saved to the database.",
        });
        
        router.push("/products");
      } else {
        throw new Error(result.error || 'Failed to generate image');
      }
    } catch (error) {
      setGenerationStatus("error");
      toast({
        variant: "destructive",
        title: "Creation failed",
        description: "There was an error creating your AR model. Please try again.",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const saveToDatabase = async (formValues: z.infer<typeof formSchema>, imageUrl: string) => {
    // Here you would save the AR model to your database
    // For now, we'll simulate the process
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // In a real implementation, you would:
    // 1. Save the model details (name, category, instructions) to your database
    // 2. Save the generated image URL or upload the image to your storage
    // 3. Create the relationship between the model and the image
    console.log('Saving to database:', {
      name: formValues.name,
      category: formValues.category,
      instructions: formValues.instructions,
      imageUrl: imageUrl
    });
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!selectedImage) {
      toast({
        variant: "destructive",
        title: "Image required",
        description: "Please upload an image first.",
      });
      return;
    }

    // Start the generation and save process
    await generateOptimizedImage();
  }

  return (
    <div className="space-y-8">
      {/* Header Section with Gradient Text */}
      <div className="space-y-4">
        <h2 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Create AR Model
        </h2>
        <p className="text-lg text-gray-300 max-w-2xl">
          Add a new AR model with AI-optimized images for virtual try-on experiences.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* AR Model Form */}
        <div className="space-y-6">
          <Card className="bg-slate-900/50 backdrop-blur-xl border border-purple-500/20 shadow-xl shadow-black/10">
            <CardHeader className="border-b border-purple-500/10">
              <CardTitle className="text-xl font-semibold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                AR Model Details
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Model Name</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Blue Aviator Sunglasses" 
                            {...field} 
                            className="bg-slate-800/50 border-purple-500/30 text-white placeholder:text-gray-400"
                          />
                        </FormControl>
                        <FormDescription className="text-gray-400">
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
                        <FormLabel className="text-gray-300">Category</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-slate-800/50 border-purple-500/30 text-white">
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-slate-900 border-purple-500/20">
                            {categories.map((category) => (
                              <SelectItem key={category.value} value={category.value}>
                                {category.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription className="text-gray-400">
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
                        <FormLabel className="text-gray-300">Enhancement Instructions (Optional)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Make the lenses more reflective, adjust colors to be more vibrant, enhance metallic finish..."
                            className="resize-none bg-slate-800/50 border-purple-500/30 text-white placeholder:text-gray-400"
                            rows={4}
                            {...field}
                          />
                        </FormControl>
                        <FormDescription className="text-gray-400">
                          Specific instructions for AI to enhance your AR model image
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        {/* Image Upload and Processing */}
        <div className="space-y-6">
          <Card className="bg-slate-900/50 backdrop-blur-xl border border-purple-500/20 shadow-xl shadow-black/10">
            <CardHeader className="border-b border-purple-500/10">
              <CardTitle className="text-xl font-semibold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                AR Model Image
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              {!imagePreview ? (
                <div className="border-2 border-dashed border-purple-500/30 rounded-xl p-8 bg-gradient-to-br from-purple-900/10 to-pink-900/10">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mb-4">
                      <ImageIcon className="h-8 w-8 text-white" />
                    </div>
                    <div className="mt-4">
                      <label htmlFor="image-upload" className="cursor-pointer">
                        <span className="mt-2 block text-sm font-medium text-white">
                          Upload AR model image
                        </span>
                        <span className="mt-1 block text-xs text-gray-400">
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
                    <Button 
                      className="mt-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0" 
                      asChild
                    >
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
                    <div className="relative overflow-hidden rounded-xl border border-purple-500/20 aspect-square">
                      <Image
                        src={imagePreview}
                        alt="AR model preview"
                        className="object-contain"
                        fill
                      />
                    </div>
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 bg-red-600 hover:bg-red-700"
                      onClick={removeImage}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  {generationStatus === "idle" && (
                    <Alert className="bg-purple-900/20 border-purple-500/30">
                      <AlertCircle className="h-4 w-4 text-purple-400" />
                      <AlertTitle className="text-purple-300">Ready to create</AlertTitle>
                      <AlertDescription className="text-gray-300">
                        Fill in the model details above, then click "Create AR Model" to generate and save your AR model.
                      </AlertDescription>
                    </Alert>
                  )}

                  <Button
                    type="submit"
                    onClick={form.handleSubmit(onSubmit)}
                    disabled={isGenerating || !form.watch("name") || !form.watch("category")}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 shadow-lg shadow-purple-500/25"
                  >
                    {isGenerating && (
                      <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    )}
                    {isGenerating ? "Creating AR Model..." : "Create AR Model"}
                    <Wand2 className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Generation Status */}
          {generationStatus !== "idle" && (
            <Card className="bg-slate-900/50 backdrop-blur-xl border border-purple-500/20 shadow-xl shadow-black/10">
              <CardHeader className="border-b border-purple-500/10">
                <CardTitle className="text-xl font-semibold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  AI Image Generation
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                {generationStatus === "processing" && (
                  <div className="flex flex-col items-center justify-center py-8 space-y-4">
                    <div className="h-16 w-16 rounded-full border-4 border-purple-500 border-t-transparent animate-spin" />
                    <div className="text-center">
                      <h3 className="text-lg font-medium text-white">Generating AR-Ready Image</h3>
                      <p className="text-sm text-gray-300">
                        ChatGPT is creating a perfect image for AR try-on...
                      </p>
                    </div>
                  </div>
                )}

                {generationStatus === "complete" && generatedImage && (
                  <div className="space-y-4">
                    <Alert className="bg-green-900/20 border-green-500/30">
                      <CheckCircle2 className="h-4 w-4 text-green-400" />
                      <AlertTitle className="text-green-300">Generation Complete!</AlertTitle>
                      <AlertDescription className="text-gray-300">
                        Your AR-ready image has been generated with transparent background and perfect optimization.
                      </AlertDescription>
                    </Alert>
                    <div className="aspect-square relative overflow-hidden rounded-xl border border-purple-500/20 bg-checkered">
                      <Image
                        src={generatedImage}
                        alt="Generated AR-ready model"
                        className="object-contain"
                        fill
                      />
                    </div>
                    <Button
                      variant="outline"
                      onClick={generateOptimizedImage}
                      className="w-full border-purple-500/30 text-gray-300 hover:bg-purple-900/20 hover:border-purple-500/50"
                      disabled={isGenerating}
                    >
                      <Wand2 className="mr-2 h-4 w-4" />
                      Regenerate Image
                    </Button>
                  </div>
                )}

                {generationStatus === "error" && (
                  <div className="flex flex-col items-center justify-center py-8 space-y-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-red-600 to-pink-600 rounded-full flex items-center justify-center">
                      <AlertCircle className="h-8 w-8 text-white" />
                    </div>
                    <div className="text-center">
                      <h3 className="text-lg font-medium text-white">Generation Failed</h3>
                      <p className="text-sm text-gray-300">
                        There was an error generating your AR-ready image. Please try again.
                      </p>
                    </div>
                    <Button 
                      variant="outline" 
                      onClick={() => setGenerationStatus("idle")}
                      className="border-purple-500/30 text-gray-300 hover:bg-purple-900/20 hover:border-purple-500/50"
                    >
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