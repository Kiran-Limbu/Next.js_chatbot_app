# Project instructions

## App overview

- This is a Next.js App Router chatbot with Better Auth, MongoDB, and Gemini-based responses.
- `/` redirects authenticated users to `/chat`; unauthenticated visitors see the public home workspace.
- `/chat` and `/chat/[id]` are protected chat pages.
- Sign-in supports email/password and Google sign-in; sign-up is available at `/signup`.

## Authentication and environment

- Server auth is configured in `src/lib/auth.ts` using Better Auth with the MongoDB adapter.
- The client auth helper in `src/lib/auth-client.ts` uses `SERVER_URL`.
- Required environment variables:
  - `DB_URL`
  - `GOOGLE_CLIENT_ID`
  - `GOOGLE_CLIENT_SECRET`
  - `SERVER_URL`
  - `BASE_URL`
  - `GEMINI_API_KEY`
- The chat frontend calls the API through `src/utils/client.ts` using `BASE_URL`.
- Better Auth API handler: `src/app/api/auth/[...id]/route.ts`.
- Gemini generation helper: `src/lib/gemini.ts`.

## Chat data and behavior

- `Conversation` stores `userId` and `title`.
- `Message` stores `conversationId`, `role` (`user` or `model`), and `content`.
- `POST /api/chat` creates a conversation and saves the first user and model messages.
- `POST /api/chat/[id]` adds messages to an existing conversation and verifies that the conversation belongs to the signed-in user.
- `ChatWorkspace` owns the visible message list and updates it as messages are added.
- `InputTextBar` adds the user's message optimistically, then appends the assistant message returned by the API; if a send fails, it removes the optimistic message and restores the draft.
- Preserve this API and UI contract when changing chat routes or client behavior.

## Routes

- `/` — public landing/home screen or redirect to `/chat`
- `/signin` — sign-in page
- `/signup` — sign-up page
- `/chat` — authenticated workspace and new conversation entry point
- `/chat/[id]` — authenticated conversation page

## Engineering conventions

- Keep changes minimal, production-focused, and consistent with the current UI/auth patterns.
- Prefer server-side session checks with `auth.api.getSession({ headers: await headers() })` for protected pages and API routes.
- Keep all conversation reads scoped to the signed-in user.
- Avoid unnecessary boilerplate, duplicate UI, and unused files.
- Validate with `npm run lint`, `npm run build`, and `npm run start` as appropriate.
- Configure all required environment variables in the deployment environment.

## Key files

- `src/lib/auth.ts`
- `src/lib/auth-client.ts`
- `src/lib/db.ts`
- `src/lib/gemini.ts`
- `src/app/api/auth/[...id]/route.ts`
- `src/app/api/chat/route.ts`
- `src/app/api/chat/[id]/route.ts`
- `src/app/page.tsx`
- `src/app/chat/page.tsx`
- `src/app/chat/[id]/page.tsx`
- `components/chat/ChatWorkspace.tsx`
- `components/userInputBar/InputTextBar.tsx`
- `src/app/layout.tsx`