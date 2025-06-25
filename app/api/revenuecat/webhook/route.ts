import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// RevenueCat webhook handler for server-side purchase verification
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { event, api_version } = body;

    // Verify the webhook signature (in production, you should verify this)
    // const signature = request.headers.get('authorization');
    
    console.log('RevenueCat webhook received:', event.type);

    switch (event.type) {
      case 'INITIAL_PURCHASE':
      case 'NON_RENEWING_PURCHASE':
        await handleTokenPurchase(event);
        break;
      
      case 'RENEWAL':
        await handleSubscriptionRenewal(event);
        break;
      
      case 'CANCELLATION':
        await handleSubscriptionCancellation(event);
        break;
      
      case 'EXPIRATION':
        await handleSubscriptionExpiration(event);
        break;
      
      default:
        console.log('Unhandled event type:', event.type);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

async function handleTokenPurchase(event: any) {
  const { app_user_id, product_id, price, currency } = event;
  
  // Map product IDs to token amounts
  const tokenMapping: Record<string, number> = {
    'basic_tokens': 10,
    'pro_tokens': 50,
    'business_tokens': 100,
    'starter_tokens': 5,
    'premium_tokens': 200,
  };

  const tokensToAdd = tokenMapping[product_id] || 0;

  if (tokensToAdd > 0) {
    // Update user's token balance in your database
    // This is a simplified example - you should implement proper user token management
    console.log(`Adding ${tokensToAdd} tokens to user ${app_user_id}`);
    
    // Example: Update user tokens in Supabase
    // const { error } = await supabase
    //   .from('user_tokens')
    //   .upsert({
    //     user_id: app_user_id,
    //     tokens: tokensToAdd,
    //     purchase_date: new Date().toISOString(),
    //     product_id,
    //     price,
    //     currency,
    //   });

    // if (error) {
    //   console.error('Failed to update user tokens:', error);
    // }
  }
}

async function handleSubscriptionRenewal(event: any) {
  const { app_user_id, product_id } = event;
  console.log(`Subscription renewed for user ${app_user_id}, product ${product_id}`);
  
  // Handle subscription renewal logic
  // Update user's subscription status, add tokens if applicable
}

async function handleSubscriptionCancellation(event: any) {
  const { app_user_id, product_id } = event;
  console.log(`Subscription cancelled for user ${app_user_id}, product ${product_id}`);
  
  // Handle subscription cancellation logic
  // Update user's subscription status
}

async function handleSubscriptionExpiration(event: any) {
  const { app_user_id, product_id } = event;
  console.log(`Subscription expired for user ${app_user_id}, product ${product_id}`);
  
  // Handle subscription expiration logic
  // Update user's subscription status, remove access if needed
}