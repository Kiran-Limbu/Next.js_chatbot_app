# Project rules

## App overview
- This is a Next.js App Router project for a chatbot application.
- The home page at `/` checks for an existing session:
  - authenticated user → redirect to `/chat`
  - unauthenticated user → render the public home workspace
- The chat page at `/chat` requires an active session; otherwise it redirects to `/`.
- Authentication is handled by Better Auth with email/password and Google social login.

## Authentication setup
- Database auth config lives in `src/lib/auth.ts`.
- MongoDB adapter is used with `mongodbAdapter` and `MongoClient`.
- Required environment variables:
  - `DB_URL`
  - `GOOGLE_CLIENT_ID`
  - `GOOGLE_CLIENT_SECRET`
  - `SERVER_URL`
- The Better Auth API route is registered in `src/app/api/auth/[...id]/route.ts`.
- The client-side auth helper is in `src/lib/auth-client.ts` and uses `SERVER_URL` as the base URL.

## Routes and pages
- `/` → landing / home page
- `/signin` → email + Google sign-in page
- `/signup` → email + Google sign-up page
- `/chat` → authenticated chat workspace

## Production conventions
- Keep changes minimal and production-focused.
- Prefer server-side session checks with `auth.api.getSession({ headers: await headers() })`.
- Use `/chat` as the post-login callback URL.
- Do not add unnecessary boilerplate, extra docs, duplicate UI, or unused files.
- Keep navigation and auth flows consistent with the current app design.

## Key files
- `src/lib/auth.ts`
- `src/lib/auth-client.ts`
- `src/app/api/auth/[...id]/route.ts`
- `src/app/page.tsx`
- `src/app/chat/page.tsx`
- `src/app/signin/page.tsx`
- `src/app/signup/page.tsx`
- `src/app/layout.tsx`

## Deployment
- Build with `npm run build`.
- Start with `npm run start`.
- Always provide the required environment variables in the deployed environment.
