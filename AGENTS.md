# Project rules

## Production setup
- This is a Next.js app using the App Router.
- Authentication is handled with Better Auth and MongoDB.
- Required environment variables:
  - `DB_URL`
  - `GOOGLE_CLIENT_ID`
  - `GOOGLE_CLIENT_SECRET`
  - `SERVER_URL`
- Keep changes minimal and production-focused.
- Do not add unnecessary boilerplate, extra docs, or unused code.

## Key files
- `src/lib/auth.ts`
- `src/lib/auth-client.ts`
- `src/app/api/auth/[...id]/route.ts`
- `src/app/layout.tsx`

## Deployment
- Build with `npm run build`.
- Start with `npm run start`.
- Always provide the required environment variables in the deployed environment.
