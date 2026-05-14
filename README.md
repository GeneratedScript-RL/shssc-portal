# SHSSC Portal

SHSSC Portal is a Next.js 14 student council management system for announcements, events, polls, forums, submissions, transparency records, and admin operations.

## Stack

- Next.js 14 App Router with strict TypeScript
- Tailwind CSS with shadcn/ui
- Supabase for auth, database, storage, and realtime
- Zustand for client state
- React Hook Form and Zod for forms
- TipTap for rich text
- Resend for transactional email
- Vercel Analytics

## Quick Start

1. Clone the repository.
2. Install dependencies with `npm install`.
3. Copy `.env.example` to `.env.local`.
4. Fill in your local secrets and public runtime values.
5. Start the app with `npm run dev`.

The development server runs at `http://localhost:3000`.

## Environment

Use the tracked `.env.example` as the only setup template.

```bash
cp .env.example .env.local
```

Required variables:

```dotenv
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_SITE_URL=
SUPABASE_SERVICE_ROLE_KEY=
RESEND_API_KEY=
```

Security notes:

- Never commit `.env.local`, `.env.*.local`, or any real credentials.
- Keep `SUPABASE_SERVICE_ROLE_KEY` server-only. It must never appear in client code.
- Store production secrets in the Vercel and Supabase dashboards, not in Git.
- Keep CI secret-free unless a workflow truly needs private infrastructure access.

## Repository Layout

```text
shssc-portal/
|-- app/
|-- components/
|-- hooks/
|-- lib/
|-- public/
|-- stores/
|-- supabase/
|-- types/
|-- .github/workflows/ci.yml
|-- .env.example
|-- .gitignore
|-- middleware.ts
|-- package.json
|-- README.md
`-- vercel.json
```

Local-only files and folders are intentionally ignored, including `.env.local`, `.next/`, `node_modules/`, `supabase/.temp/`, and `.vercel/`.

## Deployment

Deploy on Vercel:

1. Import the repository into Vercel.
2. Add the environment variables from `.env.example` in the Vercel dashboard.
3. Configure matching secrets for Supabase Edge Functions in the Supabase project.
4. Keep service-role and email credentials scoped to server environments only.

## Contributing

1. Create a branch from `main`.
2. Make your changes.
3. Run `npm run lint`, `npm run typecheck`, and `npm run build`.
4. Open a pull request.
