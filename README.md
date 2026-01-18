# Echo

AI-powered customer support platform with intelligent chatbots and voice AI.

## Features

- **AI Chat** - Conversational AI using Convex agents and Google AI SDK
- **Voice AI** - Vapi.ai integration (white-label - users bring their own API keys)
- **Embeddable Widget** - Customer support widget for any website
- **Knowledge Base RAG** - Retrieval-Augmented Generation for context-aware responses
- **Real-time Backend** - Powered by Convex
- **Authentication** - Clerk

## Project Structure

```
echo/
├── apps/
│   ├── web/        # Admin dashboard (Next.js)
│   ├── widget/     # Chat widget (Next.js)
│   └── embed/      # Widget script builder (Vite)
└── packages/
    ├── backend/    # Convex backend
    ├── ui/         # Shared UI components (shadcn/ui)
    ├── eslint-config/
    └── typescript-config/
```

## Prerequisites

- **Node.js** >= 20
- **pnpm** >= 10.4.1
- [Convex](https://convex.dev) account
- [Clerk](https://clerk.com) account
- [Google AI](https://ai.google.dev) API key
- [Sentry](https://sentry.io) account

## Getting Started

### 1. Clone and install

```bash
git clone https://github.com/SakshamTulani/echo.git
cd echo
pnpm install
```

### 2. Set up environment variables

**`apps/web/.env.local`:**

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_xxx
CLERK_SECRET_KEY=sk_xxx
NEXT_PUBLIC_CONVEX_URL=https://xxx.convex.cloud
SENTRY_AUTH_TOKEN=xxx
```

**`packages/backend/.env.local`:**

```env
CLERK_ISSUER_URL=https://xxx.clerk.accounts.dev
GOOGLE_GENERATIVE_AI_API_KEY=xxx
```

### 3. Start development

```bash
pnpm dev
```

This runs `turbo dev` which starts all apps and the Convex backend:

| App    | URL                   |
| ------ | --------------------- |
| web    | http://localhost:3000 |
| widget | http://localhost:3001 |
| embed  | http://localhost:3002 |

## Scripts

| Command       | Description                  |
| ------------- | ---------------------------- |
| `pnpm dev`    | Start all apps (turbo dev)   |
| `pnpm build`  | Build all apps (turbo build) |
| `pnpm lint`   | Lint all packages            |
| `pnpm format` | Format code with Prettier    |

### Run specific apps

```bash
pnpm --filter web dev
pnpm --filter @workspace/backend dev
```

## Adding UI Components

```bash
pnpm dlx shadcn@latest add button -c apps/web
```

```tsx
import { Button } from "@workspace/ui/components/button";
```
