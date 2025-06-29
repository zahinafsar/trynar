"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Upload,
  Image as ImageIcon,
  Wand2,
  CheckCircle2,
  X,
  Save,
  ArrowLeft,
  Sparkles,
  Zap,
  Camera,
  FileImage,
  Loader2,
  AlertCircle,
  Info,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { StorageService } from "@/lib/storage";
import { ModelsService } from "@/lib/models";
import { supabase } from "@/lib/supabase";
import type OpenAI from "openai";

const formSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Product name must be at least 3 characters." }),
  category: z.string().min(1, { message: "Please select a category." }),
});

const categories = [
  { value: "sunglasses", label: "Sunglasses", disabled: false },
  { value: "eyeglasses", label: "Eyeglasses", disabled: true },
  { value: "hats", label: "Hats & Caps", disabled: true },
  { value: "jewelry", label: "Jewelry", disabled: true },
  { value: "watches", label: "Watches", disabled: true },
  { value: "masks", label: "Face Masks", disabled: true },
  { value: "headphones", label: "Headphones", disabled: true },
  { value: "other", label: "Other", disabled: true },
];

function base64ToBlob(base64: string, contentType = "image/png") {
  try {
    // Handle data URL format (data:image/png;base64,<data>)
    if (base64.includes(",")) {
      const parts = base64.split(",");
      if (parts.length !== 2) {
        throw new Error("Invalid data URL format");
      }
      
      const dataPart = parts[1];
      const mimeType = parts[0].split(":")[1].split(";")[0];
      
      // Validate base64 string
      if (!dataPart || dataPart.length === 0) {
        throw new Error("Empty base64 data");
      }
      
      // Check if the base64 string is valid
      if (!/^[A-Za-z0-9+/]*={0,2}$/.test(dataPart)) {
        throw new Error("Invalid base64 characters");
      }
      
      const byteCharacters = atob(dataPart);
      const byteArrays = [];

      for (let offset = 0; offset < byteCharacters.length; offset += 512) {
        const slice = byteCharacters.slice(offset, offset + 512);

        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
      }

      return new Blob(byteArrays, { type: mimeType });
    } else {
      // Handle raw base64 string
      // Validate base64 string
      if (!base64 || base64.length === 0) {
        throw new Error("Empty base64 data");
      }
      
      // Check if the base64 string is valid
      if (!/^[A-Za-z0-9+/]*={0,2}$/.test(base64)) {
        throw new Error("Invalid base64 characters");
      }
      
      const byteCharacters = atob(base64);
      const byteArrays = [];

      for (let offset = 0; offset < byteCharacters.length; offset += 512) {
        const slice = byteCharacters.slice(offset, offset + 512);

        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
      }

      return new Blob(byteArrays, { type: contentType });
    }
  } catch (error: unknown) {
    console.error("Error in base64ToBlob:", error);
    console.error("Base64 string length:", base64?.length);
    console.error("Base64 string preview:", base64?.substring(0, 100));
    throw new Error(`Failed to convert base64 to blob: ${error instanceof Error ? error.message : String(error)}`);
  }
}

const convertImageToPng = (file: File): Promise<File> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      reject(new Error("Could not get canvas context"));
      return;
    }

    const img = new window.Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
      try {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        canvas.toBlob((blob) => {
          if (blob) {
            const pngFile = new File([blob], "image.png", {
              type: "image/png",
            });
            resolve(pngFile);
          } else {
            reject(new Error("Failed to convert image to PNG"));
          }
        }, "image/png");
      } catch (error) {
        reject(new Error("Failed to process image on canvas"));
      } finally {
        URL.revokeObjectURL(img.src);
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(img.src);
      reject(new Error("Failed to load image for conversion"));
    };

    try {
      img.src = URL.createObjectURL(file);
    } catch (error) {
      reject(new Error("Failed to create object URL for image"));
    }
  });
};

export default function CreateProductPage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(
    null
  );
  const [currentStep, setCurrentStep] = useState<
    "upload" | "generate" | "details" | "complete"
  >("upload");
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      category: "",
    },
  });

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const pngFile = await convertImageToPng(file);
      setSelectedImage(pngFile);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(pngFile);
      setGeneratedImageUrl(null);
      setCurrentStep("generate");
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setGeneratedImageUrl(null);
    setCurrentStep("upload");
  };

  const generateImage = async () => {
    if (!selectedImage) {
      toast({
        variant: "destructive",
        title: "No image selected",
        description: "Please upload an image first.",
      });
      return;
    }

    setIsGenerating(true);

    try {
      const formData = new FormData();
      formData.append("image", selectedImage);

      const response = await fetch("/api/generate-image", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        let errorMsg = "Failed to generate image";
        try {
          const errorData = await response.json();
          if (errorData && errorData.error) {
            errorMsg = errorData.error;
          }
        } catch (e) {}
        toast({
          variant: "destructive",
          title: "Generation failed",
          description: errorMsg,
        });
        setIsGenerating(false);
        return;
      }

      const result = (await response.json()) as OpenAI.Images.ImagesResponse;

      if (result.data?.[0]?.b64_json) {
        const imageData = result.data[0].b64_json;
        if (imageData.startsWith('http')) {
          setGeneratedImageUrl(imageData);
        } else {
          setGeneratedImageUrl(`data:image/png;base64,${imageData}`);
        }
        setCurrentStep("details");
        toast({
          title: "Image generated successfully",
          description: "Your optimized image is ready.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Generation failed",
          description: "Failed to generate image. No image data returned.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Generation failed",
        description:
          error instanceof Error ? error.message : "There was an error generating your image. Please try again.",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const saveToDatabase = async (formValues: z.infer<typeof formSchema>) => {
    if (!generatedImageUrl) {
      toast({
        variant: "destructive",
        title: "No generated image",
        description: "Please generate an image first.",
      });
      return;
    }

    setIsSaving(true);

    try {
      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("User not authenticated");
      }

      let generatedImageStorageUrl = "";
      if (generatedImageUrl.startsWith('data:')) {
        // It's a data URL (base64), convert to blob
        const generatedImageBlob = base64ToBlob(generatedImageUrl);
        const generatedImageFile = new File([generatedImageBlob], `generated-${Date.now()}.png`, {
          type: "image/png"
        });

        const generatedImagePath = StorageService.generateFilePath(
          user.id,
          generatedImageFile.name
        );

        generatedImageStorageUrl = await StorageService.uploadFile(
          generatedImageFile,
          generatedImagePath
        );
      } else {
        // It's already a URL, use it directly
        generatedImageStorageUrl = generatedImageUrl;
      }

      await ModelsService.createModel({
        name: formValues.name,
        category: formValues.category,
        image_url: generatedImageStorageUrl,
      });

      setCurrentStep("complete");
      toast({
        title: "Product saved successfully",
        description: "Your AR product has been created and saved.",
      });

      // Redirect after a short delay
      setTimeout(() => {
        router.push("/products");
      }, 2000);
    } catch (error: any) {
      console.error("Error saving to database:", error);
      toast({
        variant: "destructive",
        title: "Save failed",
        description:
          "There was an error saving your product. Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await saveToDatabase(values);
  }

  const getStepStatus = (step: string) => {
    const steps = ["upload", "generate", "details", "complete"];
    const currentIndex = steps.indexOf(currentStep);
    const stepIndex = steps.indexOf(step);

    if (stepIndex < currentIndex) return "completed";
    if (stepIndex === currentIndex) return "current";
    return "upcoming";
  };

  if (currentStep === "complete") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full space-y-8 text-center">
          <div className="space-y-6">
            <div className="mx-auto w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
              <CheckCircle2 className="h-10 w-10 text-white" />
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                Product Created!
              </h1>
              <p className="text-gray-300 text-lg">
                Your AR-ready product has been successfully created and saved.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <Button
                asChild
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
              >
                <Link href="/products">View All Products</Link>
              </Button>
              <Button
                variant="outline"
                asChild
                className="border-purple-500/30 text-gray-300 hover:bg-purple-900/20"
              >
                <Link href="/products/create">Create Another</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          className="text-gray-300 hover:text-white hover:bg-slate-800/50"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Create AR Product
          </h1>
          <p className="text-lg text-gray-300">
            Transform your product images into immersive AR experiences
          </p>
        </div>
      </div>

      {/* Progress Steps */}
      <Card className="bg-slate-900/50 backdrop-blur-xl border border-purple-500/20 shadow-xl shadow-black/10">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            {[
              { key: "upload", label: "Upload Image", icon: Upload },
              { key: "generate", label: "AI Processing", icon: Wand2 },
              { key: "details", label: "Product Details", icon: FileImage },
              { key: "complete", label: "Complete", icon: CheckCircle2 },
            ].map((step, index) => {
              const status = getStepStatus(step.key);
              return (
                <div key={step.key} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={`
                      w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300
                      ${
                        status === "completed"
                          ? "bg-green-500 text-white"
                          : status === "current"
                          ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                          : "bg-slate-700 text-gray-400"
                      }
                    `}
                    >
                      <step.icon className="h-5 w-5" />
                    </div>
                    <span
                      className={`
                      mt-2 text-sm font-medium
                      ${status === "current" ? "text-white" : "text-gray-400"}
                    `}
                    >
                      {step.label}
                    </span>
                  </div>
                  {index < 3 && (
                    <div
                      className={`
                      flex-1 h-0.5 mx-4 transition-all duration-300
                      ${
                        status === "completed" ? "bg-green-500" : "bg-slate-700"
                      }
                    `}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Left Column - Image Processing */}
        <div className="space-y-6">
          {/* Upload Section */}
          <Card className="bg-slate-900/50 backdrop-blur-xl border border-purple-500/20 shadow-xl shadow-black/10">
            <CardHeader className="border-b border-purple-500/10">
              <CardTitle className="flex items-center gap-2 text-xl font-semibold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                <Camera className="h-5 w-5 text-purple-400" />
                Original Image
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {!imagePreview ? (
                <div className="border-2 border-dashed border-purple-500/30 rounded-xl p-8 bg-gradient-to-br from-purple-900/10 to-pink-900/10 hover:border-purple-500/50 transition-all duration-300">
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 mx-auto bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                      <ImageIcon className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">
                        Upload Product Image
                      </h3>
                      <p className="text-sm text-gray-400 mb-4">
                        Choose a high-quality image of your product for AR
                        optimization
                      </p>
                      <div className="flex flex-wrap gap-2 justify-center mb-4">
                        <Badge
                          variant="outline"
                          className="border-purple-500/30 text-purple-300"
                        >
                          PNG, JPG, GIF
                        </Badge>
                        <Badge
                          variant="outline"
                          className="border-purple-500/30 text-purple-300"
                        >
                          Max 4MB
                        </Badge>
                        <Badge
                          variant="outline"
                          className="border-purple-500/30 text-purple-300"
                        >
                          1024x1024 recommended
                        </Badge>
                      </div>
                    </div>
                    <Button
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0"
                      asChild
                    >
                      <label htmlFor="image-upload" className="cursor-pointer">
                        <Upload className="mr-2 h-4 w-4" />
                        Choose Image
                      </label>
                    </Button>
                    <input
                      id="image-upload"
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative group">
                    <div className="relative overflow-hidden rounded-xl border border-purple-500/20 aspect-square bg-checkered">
                      <Image
                        src={imagePreview}
                        alt="Product preview"
                        className="object-contain"
                        fill
                      />
                    </div>
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={removeImage}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  {currentStep === "generate" && (
                    <Button
                      onClick={generateImage}
                      disabled={isGenerating}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 shadow-lg shadow-purple-500/25"
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing with AI...
                        </>
                      ) : (
                        <>
                          <Wand2 className="mr-2 h-4 w-4" />
                          Generate AR-Ready Image
                        </>
                      )}
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* AI Processing Info */}
          {currentStep === "generate" && imagePreview && (
            <Alert className="border-blue-500/20 bg-blue-900/20">
              <Info className="h-4 w-4 text-blue-400" />
              <AlertTitle className="text-blue-300">AI Processing</AlertTitle>
              <AlertDescription className="text-blue-200">
                Our AI will optimize your image for AR by removing backgrounds,
                enhancing clarity, and preparing it for virtual try-on
                experiences.
              </AlertDescription>
            </Alert>
          )}
        </div>

        {/* Right Column - Generated Image & Form */}
        <div className="space-y-6">
          {/* Generated Image */}
          <Card className="bg-slate-900/50 backdrop-blur-xl border border-purple-500/20 shadow-xl shadow-black/10">
            <CardHeader className="border-b border-purple-500/10">
              <CardTitle className="flex items-center gap-2 text-xl font-semibold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                <Sparkles className="h-5 w-5 text-purple-400" />
                AI-Enhanced Image
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {!generatedImageUrl ? (
                <div className="border-2 border-dashed border-purple-500/30 rounded-xl p-8 bg-gradient-to-br from-purple-900/10 to-pink-900/10">
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 mx-auto bg-gradient-to-r from-gray-600 to-gray-700 rounded-full flex items-center justify-center">
                      <Zap className="h-8 w-8 text-gray-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-300 mb-2">
                        AI-Enhanced Image
                      </h3>
                      <p className="text-sm text-gray-400">
                        Your optimized AR-ready image will appear here after
                        processing
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="aspect-square relative overflow-hidden rounded-xl border border-purple-500/20 bg-checkered">
                    <Image
                      src={generatedImageUrl}
                      alt="Generated AR-ready model"
                      className="object-contain"
                      fill
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={generateImage}
                      className="flex-1 border-purple-500/30 text-gray-300 hover:bg-purple-900/20 hover:border-purple-500/50"
                      disabled={isGenerating}
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing with AI...
                        </>
                      ) : (
                        <>
                          <Wand2 className="mr-2 h-4 w-4" />
                          Regenerate
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Product Details Form */}
          {currentStep === "details" && (
            <Card className="bg-slate-900/50 backdrop-blur-xl border border-purple-500/20 shadow-xl shadow-black/10">
              <CardHeader className="border-b border-purple-500/10">
                <CardTitle className="text-xl font-semibold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Product Information
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                  >
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300">
                            Product Name
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., Blue Aviator Sunglasses"
                              {...field}
                              className="bg-slate-800/50 border-purple-500/30 text-white placeholder:text-gray-400"
                            />
                          </FormControl>
                          <FormDescription className="text-gray-400">
                            Choose a descriptive name for your product
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
                          <FormLabel className="text-gray-300">
                            Category
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="bg-slate-800/50 border-purple-500/30 text-white">
                                <SelectValue placeholder="Select a category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-slate-900 border-purple-500/20">
                              {categories.map((category) => (
                                <SelectItem
                                  key={category.value}
                                  value={category.value}
                                  disabled={category.disabled}
                                  className="text-white hover:bg-slate-800"
                                >
                                  <div className="flex items-center gap-2">
                                    {category.label}
                                    {category.disabled && (
                                      <Badge
                                        variant="outline"
                                        className="text-xs"
                                      >
                                        Coming Soon
                                      </Badge>
                                    )}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormDescription className="text-gray-400">
                            Select the category that best describes your product
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Separator className="bg-purple-500/20" />

                    <Button
                      type="submit"
                      disabled={isSaving}
                      className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white border-0 shadow-lg shadow-green-500/25"
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving Product...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Save AR Product
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
