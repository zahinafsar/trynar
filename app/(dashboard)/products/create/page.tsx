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
} from "lucide-react";
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
import { StorageService } from "@/lib/storage";
import { ModelsService } from "@/lib/models";
import { supabase } from "@/lib/supabase";
import OpenAI from "openai";

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

export default function CreateProductPage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(
    null
  );
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
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setGeneratedImageUrl(null);
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
        throw new Error("Failed to generate image");
      }

      const result = (await response.json()) as OpenAI.Images.ImagesResponse;

      if (result.data?.[0]?.b64_json) {
        setGeneratedImageUrl(
          `data:image/png;base64,${result.data[0].b64_json}`
        );
        toast({
          title: "Image generated successfully",
          description: "Your optimized image is ready.",
        });
      } else {
        throw new Error("Failed to generate image");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Generation failed",
        description:
          "There was an error generating your image. Please try again.",
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

      // Upload the original image to Supabase storage
      const originalImagePath = StorageService.generateFilePath(
        user.id,
        selectedImage!.name
      );
      const originalImageUrl = await StorageService.uploadFile(
        selectedImage!,
        originalImagePath
      );

      // Create model record in database
      const modelData = {
        user: user.id,
        name: formValues.name,
        category: formValues.category,
        instructions: "",
        product_url: originalImageUrl,
        image_url: generatedImageUrl,
        status: "complete" as const,
      };

      await ModelsService.createModel(modelData);

      toast({
        title: "Product saved successfully",
        description: "Your product has been saved to the database.",
      });

      router.push("/products");
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

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="space-y-4">
        <h2 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Create AR Model
        </h2>
        <p className="text-lg text-gray-300 max-w-2xl">
          Upload an image, generate an optimized version, and save your AR
          model.
        </p>
      </div>

      {/* Two Flex Boxes for Image Processing */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Left Box - Image Input */}
        <Card className="bg-slate-900/50 backdrop-blur-xl border border-purple-500/20 shadow-xl shadow-black/10">
          <CardHeader className="border-b border-purple-500/10">
            <CardTitle className="text-xl font-semibold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Upload Image
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
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
                      alt="Product preview"
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

                <Button
                  onClick={generateImage}
                  disabled={isGenerating}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 shadow-lg shadow-purple-500/25"
                >
                  {isGenerating && (
                    <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  )}
                  {isGenerating ? "Generating..." : "Generate"}
                  <Wand2 className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Right Box - Generated Image Display */}
        <Card className="bg-slate-900/50 backdrop-blur-xl border border-purple-500/20 shadow-xl shadow-black/10">
          <CardHeader className="border-b border-purple-500/10">
            <CardTitle className="text-xl font-semibold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Generated Image
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {!generatedImageUrl ? (
              <div className="border-2 border-dashed border-purple-500/30 rounded-xl p-8 bg-gradient-to-br from-purple-900/10 to-pink-900/10">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-r from-gray-600 to-gray-700 rounded-full flex items-center justify-center mb-4">
                    <ImageIcon className="h-8 w-8 text-gray-400" />
                  </div>
                  <div className="text-center">
                    <span className="block text-sm font-medium text-gray-300">
                      Generated image will appear here
                    </span>
                    <span className="mt-1 block text-xs text-gray-400">
                      Click &quot;Generate&quot; to create optimized image
                    </span>
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

                <div className="space-y-2">
                  <Button
                    variant="outline"
                    onClick={generateImage}
                    className="w-full border-purple-500/30 text-gray-300 hover:bg-purple-900/20 hover:border-purple-500/50"
                    disabled={isGenerating}
                  >
                    <Wand2 className="mr-2 h-4 w-4" />
                    Regenerate
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Form Section */}
      <Card className="bg-slate-900/50 backdrop-blur-xl border border-purple-500/20 shadow-xl shadow-black/10">
        <CardHeader className="border-b border-purple-500/10">
          <CardTitle className="text-xl font-semibold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Product Details
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid gap-6 lg:grid-cols-2">
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
                          placeholder="Blue Aviator Sunglasses"
                          {...field}
                          className="bg-slate-800/50 border-purple-500/30 text-white placeholder:text-gray-400"
                        />
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
                      <FormLabel className="text-gray-300">Category</FormLabel>
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
                            >
                              {category.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button
                type="submit"
                disabled={isSaving || !generatedImageUrl}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white border-0 shadow-lg shadow-green-500/25"
              >
                {isSaving && (
                  <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                )}
                {isSaving ? "Saving..." : "Save Product"}
                <Save className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

const base64ToBlob = (base64: string, mime: string) => {
  const byteCharacters = atob(base64.split(",")[1]);
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

  return new Blob(byteArrays, { type: mime });
};

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
