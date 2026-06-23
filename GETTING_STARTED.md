# Getting Started with Innov8Edge Academy

Welcome to Innov8Edge Academy! This project is a hands-on AI automation learning platform that teaches complete beginners how modern AI systems work through interactive sandboxes.

## Prerequisites

1. **Node.js** (v18 or higher recommended)
2. **npm** (v9 or higher)
3. **Supabase Account** (for database and authentication)
4. **Stripe Account** (for billing and subscriptions)

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd "Innov8Edge Academy"
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Copy `.env.local.example` to `.env.local` (or create one) and fill in your keys:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   
   STRIPE_SECRET_KEY=sk_test_...
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3030](http://localhost:3030) in your browser (note: ensure you use the correct port configured in your dev script, which may default to 3000).

## Architecture

This is a Next.js App Router application with:
- **Tailwind CSS + Vanilla CSS** for styling
- **Framer Motion** for animations
- **React Flow** for the Workflow Builder
- **Supabase** for Backend (Auth + Database)
- **Stripe** for Subscriptions
