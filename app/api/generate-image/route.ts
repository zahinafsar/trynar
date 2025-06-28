import { createSupabaseServer } from "@/lib/supabase-server";
import { type NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const prompt = {
  sunglasses: "generate front side view of this sunglasses, remove arms, background and any other text or objects. We will use this image for Augmented Reality"
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseServer()

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
    // const response = await openai.images.edit({
    //   image: image,
    //   prompt: prompt.sunglasses,
    //   n: 1,
    //   size: "1024x1024",
    //   background: 'transparent',
    //   quality: 'medium',
    //   model: 'gpt-image-1'
    // });

    // if (response.usage?.input_tokens && response.usage?.output_tokens) {
    //   await supabase.from('tokens').insert({
    //     amount: (response.usage?.input_tokens + response.usage?.output_tokens) * -1,
    //   })
    // }

    // dummy
    await supabase.from('tokens').insert({
      amount: -15000,
    })

    return NextResponse.json(dummyResponse)
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


const dummyResponse = {
  "created": 1751135530,
  "background": "transparent",
  "data": [
    {
      "b64_json": "https://sdyjesjzzgafsdkpxeuz.supabase.co/storage/v1/object/public/models/ceed643f-3465-4a73-bc43-a23bf741ed0c/1751091989774-wxxdzlrl4zj.png"
    }
  ],
  "output_format": "png",
  "quality": "medium",
  "size": "1024x1024",
  "usage": {
    "input_tokens": 244,
    "input_tokens_details": {
      "image_tokens": 194,
      "text_tokens": 50
    },
    "output_tokens": 1056,
    "total_tokens": 1300
  }
}