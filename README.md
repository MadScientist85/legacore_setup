<!-- Banner / Hero Image -->
<p align="center">
  <img src="https://raw.githubusercontent.com/MadScientist85/legacore_setup/refs/heads/main/public/grok_image_xiledv2.jpg" alt="LEGACORE™ Banner" style="max-width:100%; border-radius:8px;" />
</p>

# Hi, I’m **David Daniels** 👋  
**Founder & CEO @ Humbled Beginnings Unlimited LLC**  
Architect of **LEGACORE™** — orchestration, automation, and intelligent systems.

---

## 🚀 What I Do  
- Build AI & multi-agent automation ecosystems for legal, finance, government, and enterprise  
- Recover surplus funds and automate trust & estate workflows  
- Integrate orchestration across OpenAI, OpenRouter, Supabase, Zapier, Twilio, and more  

---

## 💻 Skills & Technologies  
| Area | Tools & Tech |
|------|--------------|
| Languages / Frameworks | TypeScript, JavaScript, Python, Next.js, React, FastAPI |
| Infrastructure / Cloud | Vercel, Supabase, Docker, GitHub Actions, AWS, GCP |
| AI / Automation | OpenAI API, OpenRouter.ai, LangChain, Zapier, n8n, Twilio |
| Domains | Surplus Funds Recovery, Trust Systems, Credit Repair, Legal Tech |

---

## ⭐ Featured Projects  
- **LEGACORE™** — Flagship orchestration & AI workflow engine  
- **HBU Asset Recovery** — Automated surplus funds recovery  
- **Quorentis Financial** — Intelligence engine for debt & data furnishing  
- **Lumora Creations** — Branding + automation product ecosystem  
- **CODE System™** — Operating framework (Command • Optimize • Delegate • Execute)  

---

## 🔍 Bio & Fun Fact  
I hold **four Paralegal Certifications** and am designing systems that **think, automate, and execute with legacy in mind**.  
Fun Fact: LEGACORE™ is designed with internal agents that coordinate — a “council of micro-executives” if you will.

---

## 📬 Connect with Me  
| Platform | Link |
|----------|------|
| LinkedIn | [David Daniels](https://www.linkedin.com/in/david-d-056b3326a) |
| Facebook | https://www.facebook.com/share/19xkt5eCrb/ |
| Instagram | https://www.instagram.com/hbuassetrecovery/ |
| Website | https://humbledbeginningsunlimited.com *(or your main domain)* |

---

## 📊 GitHub Stats  
[![David’s GitHub stats](https://github-readme-stats.vercel.app/api?username=YOUR_GITHUB_USERNAME&show_icons=true&theme=dark&hide_rank=true)](https://github.com/YOUR_GITHUB_USERNAME)  

---

## 🛠️ Now Building  
- Surplus Funds Recovery AI Module  
- Quorentis Financial Engine  
- LEGACORE internal orchestration layer  
- Marketing & Affiliate Automation Suites  

---

## ✉️ Let’s Talk  
Want to collaborate on AI systems, automation, government workflows, or scale your backend? Reach out via LinkedIn, email, or message — I’m always open to ideas and mission-driven partnerships.

> *“Automate with intention. Build with legacy.”*  
> — David Daniels

---
# Humbled Beginnings Unlimited LLC - Enterprise Monorepo

Complete enterprise platform managing 6 business series with shared AI and database infrastructure.

## 🏢 Business Units

### 1. **HBU Asset Recovery** (Port 3001)
- Surplus funds recovery services
- Property search and claim filing
- Client dashboard with claim tracking

### 2. **Vivat Legacy Solutions** (Port 3002)
- Estate planning and document preparation
- Wills, trusts, and power of attorney
- Healthcare directives

### 3. **Turnaround Financial Solutions** (Port 3003)
- Credit repair and financial consulting
- Debt analysis and planning
- Credit monitoring dashboard

### 4. **Quorentis Financial Group** (Port 3004)
- Debt portfolio acquisition
- Portfolio management and analytics
- Collections and recovery

### 5. **Aurelian Digital Enterprises** (Port 3005)
- Digital marketing services
- SEO and content marketing
- Affiliate program management

### 6. **Lumora Creations** (Port 3006)
- Print-on-demand merchandise
- Custom product design
- E-commerce platform

### 7. **Admin Portal** (Port 3000)
- Central management dashboard
- Cross-company analytics
- User and resource management

## 🚀 Quick Start

\`\`\`bash
# Install dependencies
pnpm install

# Run all apps in development
pnpm dev

# Run specific app
cd apps/hbu-asset-recovery && pnpm dev

# Build all apps
pnpm build

# Run production
pnpm start
\`\`\`

## 📦 Package Structure

\`\`\`
├── apps/                          # Individual company applications
│   ├── hbu-asset-recovery/       # Port 3001
│   ├── vivat-legacy/             # Port 3002
│   ├── turnaround-financial/     # Port 3003
│   ├── quorentis-financial/      # Port 3004
│   ├── aurelian-digital/         # Port 3005
│   ├── lumora-creations/         # Port 3006
│   └── admin-portal/             # Port 3000
│
├── packages/                      # Shared packages
│   ├── ui/                       # Shared UI components
│   ├── auth/                     # Authentication system
│   ├── config/                   # Configuration management
│   ├── database/                 # Database clients (Prisma, Supabase)
│   └── ai/                       # AI provider integrations
\`\`\`

## 🔧 Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **Authentication**: NextAuth.js
- **Databases**: Prisma, Supabase, MongoDB, Neon, Heroku Postgres
- **AI Providers**: OpenAI, Anthropic, Google AI, Groq, xAI, OpenRouter, Heroku Inference
- **Monorepo**: Turborepo
- **Package Manager**: pnpm

## 🌐 Deployment

Each app can be deployed independently to Vercel:

\`\`\`bash
# Deploy specific app
cd apps/hbu-asset-recovery
vercel

# Or use Vercel CLI from root
vercel --cwd apps/hbu-asset-recovery
\`\`\`

## 📝 Environment Variables

See `.env.example` for required environment variables. Each app shares the same master keys.

## 📊 Dashboard Features

### Admin Dashboard (`/dashboard/admin`)

The admin dashboard provides comprehensive platform management capabilities:

#### Features:
- **User Management**: View, edit, and manage all platform users
  - User roles (admin, manager, user)
  - User status (active, inactive, suspended)
  - Last login tracking
  - User creation dates

- **Database Management**: Monitor all database connections
  - Supabase, MongoDB, Redis, Heroku Postgres
  - Connection status and latency
  - Real-time health monitoring

- **AI Provider Status**: Track AI service usage and health
  - OpenAI, Anthropic, Google, Groq, OpenRouter
  - Daily request counts
  - Token usage statistics
  - Provider availability

- **RFP Analytics**: Request for Proposal processing metrics
  - Total, active, and completed RFPs
  - Success rate tracking
  - Average completion time
  - Recent activity feed

- **System Metrics**: Platform performance and deployment info
  - System uptime
  - Environment information (production, staging, development)
  - Version and commit SHA
  - Node.js and Next.js versions
  - Last deployment timestamp

#### Access:
Navigate to `/dashboard/admin` after logging in. Admin role required (TODO: implement role-based access control).

### Health Dashboard (`/dashboard/health`)

Real-time system health monitoring and diagnostics:

#### Features:
- **Database Connectivity**: Live checks for all databases
  - Connection status (healthy, degraded, unhealthy)
  - Latency measurements
  - Connection pool metrics
  - Error reporting

- **Application Health**: Service availability monitoring
  - API endpoint status
  - Background job processing
  - Message queue status
  - WebSocket server health

- **Storage Status**: Vercel Blob storage monitoring
  - Storage usage percentage
  - Available storage
  - File count and total size
  - Connection latency

- **Version Information**: Current deployment details
  - Git commit SHA
  - Branch name
  - Version tag
  - Build ID
  - Deployment timestamp

#### Access:
Navigate to `/dashboard/health` after logging in. Available to admin and manager roles.

### Extending the Dashboards

#### Adding New Metrics:

1. **Define Schema**: Add Zod schemas in `lib/admin/schemas.ts` or `lib/health/schemas.ts`
2. **Create Service Function**: Implement data fetching in `lib/admin/services.ts` or `lib/health/checks.ts`
3. **Update Mock Data**: Add mock data in `lib/admin/mock-data.ts` or `lib/health/mock-data.ts`
4. **Create Component**: Build UI component in `components/admin/` or `components/health/`
5. **Update Page**: Import and use component in dashboard page

#### File Structure:
```
├── app/dashboard/
│   ├── admin/
│   │   └── page.tsx              # Admin dashboard page
│   └── health/
│       └── page.tsx              # Health dashboard page
├── components/
│   ├── admin/                    # Admin components
│   │   ├── user-management.tsx
│   │   ├── database-status.tsx
│   │   ├── ai-provider-status.tsx
│   │   ├── rfp-analytics.tsx
│   │   └── system-metrics.tsx
│   └── health/                   # Health components
│       ├── database-checks.tsx
│       ├── application-health.tsx
│       ├── storage-status.tsx
│       └── version-info.tsx
├── lib/
│   ├── admin/                    # Admin utilities
│   │   ├── schemas.ts           # Zod schemas
│   │   ├── services.ts          # Service functions
│   │   └── mock-data.ts         # Mock data
│   └── health/                   # Health utilities
│       ├── schemas.ts           # Zod schemas
│       ├── checks.ts            # Health check functions
│       └── mock-data.ts         # Mock data
└── tests/e2e/                   # E2E tests
    ├── admin-dashboard.spec.ts
    └── health-dashboard.spec.ts
```

#### Running Tests:
```bash
# Install Playwright browsers
npm run playwright:install

# Run all E2E tests
npm run test:e2e

# Run tests with UI
npm run test:e2e:ui

# Run tests in headed mode
npm run test:e2e:headed
```

#### TODO Items:
- [ ] Replace mock data with actual database queries
- [ ] Implement real-time health checks for databases
- [ ] Add WebSocket support for live updates
- [ ] Implement role-based access control (RBAC)
- [ ] Add user edit/delete functionality
- [ ] Integrate with actual RFP system
- [ ] Add export functionality for analytics
- [ ] Implement alert system for unhealthy services
- [ ] Add historical metrics and charts
- [ ] Create API endpoints for health checks (`/api/health`)

## 📄 License

© 2025 Humbled Beginnings Unlimited LLC. All rights reserved.
