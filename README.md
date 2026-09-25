# Lumina Chatbot App

Production-ready Next.js chatbot app with Better Auth and MongoDB.

## Stack
- Next.js 16
- React 19
- Better Auth
- MongoDB
- Tailwind CSS

## Required environment variables
Create a `.env.local` file in the project root:

```env
DB_URL=mongodb://localhost:27017/your-database
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
SERVER_URL=http://localhost:3000
```

Use the live production values when deploying.

## Install dependencies

```bash
npm install
```

## Run locally

```bash
npm run dev
```

Open http://localhost:3000

## Production build

```bash
npm run build
npm run start
```

## Important app files
- `src/lib/auth.ts` — authentication configuration
- `src/lib/auth-client.ts` — frontend auth client setup
- `src/app/api/auth/[...id]/route.ts` — auth route handler
- `src/app/layout.tsx` — app shell and layout

## Deployment note
This app is meant to run as a standard Next.js production build with the required environment variables configured in the hosting environment.
