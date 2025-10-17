# 🚀 NX Monorepo Setup Guide

## What is Nx?

Nx is a powerful build system and monorepo management tool that provides:
- **Intelligent Builds**: Only builds what changed
- **Computation Caching**: Speeds up builds by reusing previous results
- **Dependency Graph**: Visualize your project structure
- **Parallel Execution**: Run tasks in parallel for faster builds
- **Affected Commands**: Only run tasks for affected projects

## Installation

Nx has been added to the LEGACORE monorepo. Here's what was configured:

### 1. Core Files Added
- `nx.json` - Nx configuration
- `apps/legacore-platform/project.json` - Project configuration
- Updated `package.json` with Nx scripts

### 2. Project Structure
\`\`\`
legacore-monorepo/
├── apps/
│   └── legacore-platform/     # Main Next.js application
├── packages/                   # Shared packages (future)
├── nx.json                     # Nx configuration
└── package.json               # Root package.json with Nx
\`\`\`

## Available Commands

### Development
\`\`\`bash
# Run dev server
npm run dev

# Run dev for specific app
nx dev legacore-platform
\`\`\`

### Building
\`\`\`bash
# Build all apps
npm run build

# Build specific app
nx build legacore-platform

# Build only what changed
nx affected:build
\`\`\`

### Testing
\`\`\`bash
# Run all tests
npm run test

# Test specific app
nx test legacore-platform

# Test only affected
nx affected:test
\`\`\`

### Linting
\`\`\`bash
# Lint all apps
npm run lint

# Lint specific app
nx lint legacore-platform

# Lint only affected
nx affected:lint
\`\`\`

### Type Checking
\`\`\`bash
# Type check all
npm run type-check

# Type check specific app
nx type-check legacore-platform
\`\`\`

## Nx Power Features

### 1. Dependency Graph
Visualize your project structure:
\`\`\`bash
npm run graph
\`\`\`

### 2. Affected Commands
Only run tasks for changed code:
\`\`\`bash
# What's affected?
nx affected:graph

# Build only affected
nx affected:build

# Test only affected
nx affected:test
\`\`\`

### 3. Run Many
Run commands across multiple projects:
\`\`\`bash
# Run build for all projects
nx run-many --target=build --all

# Run lint for all projects
nx run-many --target=lint --all
\`\`\`

### 4. Computation Caching
Nx caches build outputs. Clear cache if needed:
\`\`\`bash
nx reset
\`\`\`

## CI/CD Integration

### GitHub Actions Example
\`\`\`yaml
name: CI
on: [push, pull_request]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
        with:
          fetch-depth: 0
      
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      
      - run: npm ci
      
      - run: npx nx affected:lint --base=origin/main
      - run: npx nx affected:test --base=origin/main
      - run: npx nx affected:build --base=origin/main
\`\`\`

## Migration Benefits

### Before (Without Nx)
- ❌ Build entire project every time
- ❌ No caching
- ❌ Sequential task execution
- ❌ Hard to manage dependencies

### After (With Nx)
- ✅ Only build what changed
- ✅ Intelligent caching (builds are 10x faster)
- ✅ Parallel execution
- ✅ Dependency graph visualization
- ✅ Affected commands
- ✅ Better CI/CD integration

## Next Steps

### 1. Add More Apps (Optional)
\`\`\`bash
# Add a new Next.js app
nx g @nx/next:app my-new-app

# Add a React library
nx g @nx/react:lib my-lib
\`\`\`

### 2. Create Shared Packages
Move shared code to `packages/`:
\`\`\`
packages/
├── ui/              # Shared UI components
├── utils/           # Shared utilities
├── config/          # Shared configuration
└── types/           # Shared TypeScript types
\`\`\`

### 3. Configure Nx Cloud (Optional)
Speed up CI/CD with distributed caching:
\`\`\`bash
npx nx connect-to-nx-cloud
\`\`\`

## Troubleshooting

### Clear Nx Cache
\`\`\`bash
nx reset
\`\`\`

### View Nx Configuration
\`\`\`bash
nx show project legacore-platform
\`\`\`

### Debug Nx
\`\`\`bash
NX_VERBOSE_LOGGING=true nx build legacore-platform
\`\`\`

## Resources

- [Nx Documentation](https://nx.dev)
- [Nx Recipes](https://nx.dev/recipes)
- [Nx Cloud](https://nx.app)
- [Nx Discord](https://go.nx.dev/community)

---

**Your LEGACORE monorepo is now supercharged with Nx! 🚀**
\`\`\`

```shellscript file=".env.example"
# Database
NEXT_PUBLIC_SUPABASE_URL=https://yourproject.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Authentication
NEXTAUTH_SECRET=generate_with_openssl_rand_base64_32
NEXTAUTH_URL=http://localhost:3000

# AI Services
OPENAI_API_KEY=sk-your_openai_api_key_here

# Storage
BLOB_READ_WRITE_TOKEN=your_vercel_blob_token_here

# Payments
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key

# Email
RESEND_API_KEY=re_your_resend_api_key

# SMS
TWILIO_ACCOUNT_SID=ACyour_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=+1234567890

# Security & Rate Limiting
UPSTASH_REDIS_URL=https://your-redis.upstash.io
UPSTASH_REDIS_TOKEN=your_upstash_token
ENCRYPTION_KEY=generate_with_openssl_rand_hex_64

# OAuth (Optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Integrations (Optional)
GOOGLE_DRIVE_CLIENT_ID=your_drive_client_id
GOOGLE_DRIVE_CLIENT_SECRET=your_drive_secret
SLACK_BOT_TOKEN=xoxb-your_slack_token

# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
