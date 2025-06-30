import { createSupabaseServer } from "@/lib/supabase-server";
import { type NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const prompt = {
  sunglasses: "Extract only the sunglasses from this image. Do not include glasses temples or arms. Remove person, face, hands, and any background. Keep the sunglasses centered, front-facing, with a transparent background to use in augmented reality"
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseServer()
    const formData = await request.formData()
    
    // Get userId from form data (passed from frontend)
    const userIdFromForm = formData.get("userId") as string;
    
    // Get the current authenticated user as fallback
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    // Use userId from form data if available, otherwise use authenticated user
    const userId = userIdFromForm || user?.id;
    
    if (authError || !userId) {
      return NextResponse.json({
        error: "Authentication required. Please log in to generate images."
      }, { status: 401 });
    }

    // Check token balance for the specified user
    const { data: tokenData, error: tokenError } = await supabase
      .from('tokens')
      .select('amount')
      .eq('user', userId); // Use the determined userId

    if (tokenError) {
      console.error("Error fetching user tokens:", tokenError);
      return NextResponse.json({
        error: "Failed to check token balance. Please try again."
      }, { status: 500 });
    }

    // Calculate total balance for the user
    const currentBalance = tokenData?.reduce((acc, curr) => acc + curr.amount, 0) || 0;

    // Check if user has sufficient tokens (1.5M tokens required)
    const requiredTokens = 1500000;
    if (currentBalance < requiredTokens) {
      return NextResponse.json({
        error: `Insufficient tokens. You need at least ${(requiredTokens / 1000000).toFixed(1)}M tokens to generate an image. Current balance: ${(currentBalance / 1000000).toFixed(1)}M tokens.`
      }, { status: 402 });
    }

    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: "OpenAI API key not configured" }, { status: 500 })
    }

    const image = formData.get("image") as File

    if (!image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 })
    }

    // Validate file size (max 4MB)
    if (image.size > 4 * 1024 * 1024) {
      return NextResponse.json({ error: "Image too large. Maximum size is 4MB." }, { status: 400 })
    }

    // Call OpenAI's image edit API
    const response = await openai.images.edit({
      image: image,
      prompt: prompt.sunglasses,
      n: 1,
      size: "1024x1024",
      background: 'transparent',
      quality: 'low',
      model: 'gpt-image-1'
    });

    // Deduct tokens from the user's account
    if (response.usage?.input_tokens && response.usage?.output_tokens) {
      const tokensUsed = (response.usage.input_tokens + response.usage.output_tokens) * 1000;
      
      const { error: deductError } = await supabase
        .from('tokens')
        .insert({
          amount: -tokensUsed, // Negative amount to represent usage
          user: userId // Use the determined userId
        });

      if (deductError) {
        console.error("Error deducting tokens:", deductError);
        // Don't fail the request if token deduction fails, but log it
      }
    } else {
      // If no usage data, deduct the estimated amount
      const estimatedTokens = requiredTokens;
      
      const { error: deductError } = await supabase
        .from('tokens')
        .insert({
          amount: -estimatedTokens,
          user: userId
        });

      if (deductError) {
        console.error("Error deducting estimated tokens:", deductError);
      }
    }

    return NextResponse.json(response)
  } catch (error: any) {
    console.error("Error editing image:", error)

    // Handle specific OpenAI API errors
    if (error?.status === 401) {
      return NextResponse.json({ error: "Invalid OpenAI API key" }, { status: 401 })
    }

    if (error?.status === 429) {
      return NextResponse.json({ error: "Rate limit exceeded. Please try again later." }, { status: 429 })
    }

    return NextResponse.json(
      {
        error: error?.message || "Failed to process image. Please try again.",
      },
      { status: 500 },
    )
  }
}