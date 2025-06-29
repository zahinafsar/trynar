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

    // Check token balance
    const { data: tokenData } = await supabase
      .from('tokens')
      .select('amount')

    const total = tokenData?.reduce((acc, curr) => acc + curr.amount, 0) || 0;

    const currentBalance = total || 0;

    if (currentBalance < 1500000) {
      return NextResponse.json({
        error: "Insufficient tokens. You need at least 1.5M tokens to generate an image."
      }, { status: 402 });
    }

    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: "OpenAI API key not configured" }, { status: 500 })
    }

    const formData = await request.formData()
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

    if (response.usage?.input_tokens && response.usage?.output_tokens) {
      await supabase.from('tokens').insert({
        amount: (response.usage?.input_tokens + response.usage?.output_tokens) * -1000,
      })
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