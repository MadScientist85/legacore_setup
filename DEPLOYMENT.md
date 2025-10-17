# LegaCore Deployment Guide

## Prerequisites

- Node.js 18+ installed
- Supabase account
- OpenAI API key
- Vercel account (for deployment)
- Optional: Twilio account, Google Cloud account

## Environment Variables

Create a `.env.local` file with the following variables:

\`\`\`env
# NextAuth
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=http://localhost:3000

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# OpenAI
OPENAI_API_KEY=your_openai_api_key

# Twilio (Optional)
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=your_twilio_phone

# Google Drive (Optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/google/callback
\`\`\`

## Local Development

1. Install dependencies:
\`\`\`bash
npm install
\`\`\`

2. Set up Supabase:
\`\`\`bash
# Run the schema script in Supabase SQL Editor
# Located at: scripts/supabase-schema.sql
\`\`\`

3. Run development server:
\`\`\`bash
npm run dev
\`\`\`

4. Open http://localhost:3000

## Production Deployment (Vercel)

1. Push your code to GitHub

2. Import project in Vercel

3. Add environment variables in Vercel dashboard

4. Deploy!

## Post-Deployment

1. Test authentication
2. Test agent execution
3. Configure webhook URLs (Twilio)
4. Set up custom domain (optional)

## Monitoring

- Check Vercel Analytics for performance
- Monitor Supabase dashboard for database metrics
- Review OpenAI usage in OpenAI dashboard
\`\`\`

```shellscript file=".env.local.example"
# NextAuth Configuration
NEXTAUTH_SECRET=generate_with_openssl_rand_base64_32
NEXTAUTH_URL=http://localhost:3000

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# OpenAI Configuration
OPENAI_API_KEY=sk-your_openai_api_key

# Twilio Configuration (Optional)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=+1234567890

# Google Drive Configuration (Optional)
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/google/callback

# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
