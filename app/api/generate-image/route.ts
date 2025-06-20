import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { imageData, prompt, category } = await request.json();

    if (!imageData || !prompt) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Remove the data URL prefix to get just the base64 data
    const base64Data = imageData.replace(/^data:image\/[a-z]+;base64,/, '');

    // Create the enhanced prompt for DALL-E
    const enhancedPrompt = `${prompt}

IMPORTANT REQUIREMENTS:
- Create a PNG image with completely transparent background
- Perfect for AR/virtual try-on applications
- High quality, professional product photography
- Centered and properly oriented
- Clean edges with no artifacts
- Optimal lighting and contrast
- Remove any existing background completely
- Maintain product proportions and details
- Make it look like a premium product catalog image`;

    // Use DALL-E 3 to generate the optimized image
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: enhancedPrompt,
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
    });

  } catch (error: any) {
    console.error('Error generating image:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to generate optimized image' 
      },
      { status: 500 }
    );
  }
}