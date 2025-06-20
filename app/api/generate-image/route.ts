import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { imageData, prompt, productName, category, instructions } = await request.json();

    if (!imageData || !prompt || !productName || !category) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Use DALL-E 3 to generate the optimized image based on the prompt
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
      quality: "hd",
      style: "natural",
    });

    const generatedImageUrl = response.data[0]?.url;

    if (!generatedImageUrl) {
      throw new Error('No image generated');
    }

    return NextResponse.json({
      success: true,
      imageUrl: generatedImageUrl,
      prompt: prompt, // Return the generated prompt for debugging
    });

  } catch (error: any) {
    console.error('Error generating image:', error);
    
    // Handle specific OpenAI errors
    if (error.code === 'content_policy_violation') {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Image content violates OpenAI policy. Please try a different image or description.' 
        },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to generate optimized image' 
      },
      { status: 500 }
    );
  }
}