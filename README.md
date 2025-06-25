# Trynar - 3D Model Platform

Generate 3D models for your products with AR try-on capability.

## Features

- 3D model generation for products
- AR virtual try-on experience
- Token-based payment system
- User authentication and management
- Dashboard for model and product management

## Setup

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account
- RevenueCat account (for payments)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd trynar
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory with the following variables:

```env
# RevenueCat Configuration
# Get your API key from https://app.revenuecat.com/
NEXT_PUBLIC_REVENUECAT_API_KEY=your_revenuecat_api_key_here

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# OpenAI Configuration (if using AI features)
OPENAI_API_KEY=your_openai_api_key_here
```

### RevenueCat Setup

1. Create a RevenueCat account at [https://app.revenuecat.com/](https://app.revenuecat.com/)
2. Create a new project
3. Get your API key from the project settings
4. Add the API key to your `.env.local` file
5. Configure your products in RevenueCat dashboard:
   - `basic_tokens` - 10 tokens for $9.99
   - `pro_tokens` - 50 tokens for $39.99 (popular)
   - `business_tokens` - 100 tokens for $69.99

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Current Status

The app is currently running in **demo mode** for the payment system. This means:

- All purchases are simulated
- No real payments are processed
- Token packages are displayed but not actually purchased
- The system works for testing the UI and user flow

To enable real payments:
1. Configure your RevenueCat API key in `.env.local`
2. Set up your products in the RevenueCat dashboard
3. The app will automatically switch to production mode

## Tech Stack

- **Frontend**: Next.js 13, React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Authentication**: Supabase Auth
- **Payments**: RevenueCat
- **3D Graphics**: Three.js, React Three Fiber
- **AR**: MediaPipe, TensorFlow.js
- **State Management**: React hooks
- **Forms**: React Hook Form, Zod validation

## Project Structure

```
trynar/
├── app/                    # Next.js app directory
│   ├── (ar)/              # AR try-on routes
│   ├── (auth)/            # Authentication routes
│   ├── (dashboard)/       # Dashboard routes
│   └── api/               # API routes
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── dashboard/        # Dashboard components
│   └── virtual-try-on/   # AR components
├── hooks/                # Custom React hooks
├── lib/                  # Utility libraries
└── public/               # Static assets
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
