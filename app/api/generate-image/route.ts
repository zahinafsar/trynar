import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { imageData, productName, category, instructions } = await request.json();

    if (!imageData || !productName || !category) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

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

    const categorySpecific = categoryPrompts[category as keyof typeof categoryPrompts] || categoryPrompts.other;
    
    const generatedPrompt = `Create a perfect PNG image of ${productName} (${categorySpecific}) optimized for AR try-on applications.

Requirements:
- Completely transparent background (no background at all)
- Professional product photography quality
- Perfect lighting with subtle shadows
- High contrast and sharp details
- Centered and properly oriented for virtual try-on
- Clean edges with no artifacts
- Optimal size and proportions
- Premium catalog-quality appearance

${instructions ? `Additional specifications: ${instructions}` : ''}

The image should look like it was photographed in a professional studio with perfect lighting, ready to be overlaid on a person's face/head in an AR application.`;

    // Use DALL-E 3 to generate the optimized image based on the prompt
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: generatedPrompt,
      n: 1,
      size: "1024x1024",
      quality: "hd",
      style: "natural",
    });

    const generatedImageUrl = response.data?.[0]?.url;

    if (!generatedImageUrl) {
      throw new Error('No image generated');
    }

    return NextResponse.json({
      success: true,
      imageUrl: generatedImageUrl,
      prompt: generatedPrompt, // Return the generated prompt for debugging
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