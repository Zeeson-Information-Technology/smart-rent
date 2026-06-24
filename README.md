# SmartRent

SmartRent is a smart landlord and tenant dispute documentation and property management platform. It provides property, tenancy, issue, evidence, messaging, dispute, notification, and dashboard workflows for dissertation evaluation and SaaS-style product demonstration.

## Tech Stack

- Next.js 15 App Router
- TypeScript
- Tailwind CSS
- MongoDB Atlas
- Mongoose
- NextAuth.js Credentials Provider
- bcryptjs
- Cloudinary
- React Hook Form patterns with Zod validation
- Vitest and React Testing Library
- Vercel deployment target

## Core Features

- Public marketing website with responsive pages for Home, Features, About, Contact, Privacy, Terms, and Security.
- Credentials authentication with landlord, tenant, and admin roles.
- Protected dashboard shell with role-aware sidebar and topbar.
- Properties CRUD for landlords/admins with ownership enforcement.
- Tenancies CRUD with tenant email linking and `/my-tenancy` tenant view.
- Issue management with automatic smart priority assignment.
- Cloudinary evidence upload for images and PDFs.
- Database-backed messaging and issue-linked conversations.
- Dispute documentation and status tracking.
- In-app notifications for platform events.
- Role-based dashboard analytics from MongoDB data.

## Project Structure

```txt
src/
  app/                 App Router pages, route groups, and route handlers
  components/          Shared UI, dashboard, marketing, and layout components
  config/              Environment validation helpers
  constants/           Shared enums and constants
  database/            Mongoose model architecture
  features/            Feature-based modules
  lib/                 Infrastructure utilities and service adapters
  services/            Shared service boundaries
  types/               Shared TypeScript contracts
scripts/
  seed.ts              Development demo-data seed script
docs/
  testing-checklist.md
  screenshot-checklist.md
```

## Environment Variables

Create `.env.local` from `.env.example` and provide:

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=replace-with-a-strong-secret-at-least-32-characters
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/smartrent
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

Do not expose server secrets with `NEXT_PUBLIC_` prefixes.

## Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`.

## Quality Commands

```bash
npm run typecheck
npm run lint
npm run test
npm run build
```

## Seed Demo Data

The seed script is development-only and refuses to run in production unless `ALLOW_PRODUCTION_SEED=true` is explicitly set.

```bash
npm run seed
```

The script creates realistic demo data:

- landlord, tenant, and admin users
- two properties
- one tenancy
- three issues
- two evidence placeholder records
- two conversations with messages
- one dispute
- three notifications

## Demo Credentials

| Role | Email | Password |
| --- | --- | --- |
| Landlord | `landlord@smartrent.demo` | `Password123!` |
| Tenant | `tenant@smartrent.demo` | `Password123!` |
| Admin | `admin@smartrent.demo` | `Password123!` |

## QA Evidence

Use these files for final testing and dissertation Chapter 4 evidence:

- [QA and research testing guide](docs/qa-research-testing-guide.md)
- [Testing checklist](docs/testing-checklist.md)
- [Screenshot checklist](docs/screenshot-checklist.md)

## Security Notes

- Protected application routes require a valid NextAuth session.
- API routes validate the server-side session and role before returning private data.
- Landlords are restricted to records linked to their own properties.
- Tenants are restricted to assigned tenancy, issue, dispute, message, and notification data.
- Cloudinary uploads are validated server-side for supported file type and file size.
- MongoDB, NextAuth, and Cloudinary credentials must remain server-side only.

## Deployment Notes

For Vercel deployment:

1. Add all required environment variables in the Vercel project settings.
2. Ensure MongoDB Atlas network access allows Vercel runtime connections.
3. Use a strong `NEXTAUTH_SECRET`.
4. Configure `NEXTAUTH_URL` to the deployed production URL.
5. Do not run the seed script against production data unless intentionally preparing a controlled demo environment.
