# German Online Academy

A monorepo for the German Online Academy platform, built with Next.js, Node.js/Express, PostgreSQL, and Prisma.

## Prerequisites
- Node.js (v24.x)
- npm (v11.x)
- PostgreSQL

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Copy `.env` files:
```bash
cp .env.example .env
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
```

3. Start development servers:
```bash
npm run dev
```

The web app will run on port 3000, and the API will run on port 4000.
