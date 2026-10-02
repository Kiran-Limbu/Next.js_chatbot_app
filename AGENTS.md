# Project instructions

## App overview

- This is a Next.js App Router chatbot using Better Auth and MongoDB.
- `/` redirects authenticated users to `/chat`; unauthenticated visitors see the public home workspace.
- `/chat` and `/chat/[id]` are authenticated chat pages. The conversation page loads the user's conversation and messages server-side.
- Sign-in supports email/password and Google; sign-up is available at `/signup`.

## Authentication and environment

- Server auth is configured in `src/lib/auth.ts` with Better Auth's MongoDB adapter.
- The client auth helper in `src/lib/auth-client.ts` uses `SERVER_URL`.
- `DB_URL`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, and `SERVER_URL` are used by the current auth/database setup. Chat API requests use `BASE_URL` through `src/utils/client.ts`.
- The Gemini client in `src/lib/gemini.ts` reads `GEMINI_API_KEY`, but chat routes currently return a temporary response and do not call Gemini.
- Better Auth's API handler is `src/app/api/auth/[...id]/route.ts`.

## Chat data and behavior

- `Conversation` stores `userId` and `title`.
- `Message` stores `conversationId`, `role` (`user` or `model`), and `content`. A conversation has multiple messages linked by its MongoDB `_id`.
- `POST /api/chat` creates a conversation and its initial user and assistant messages. `POST /api/chat/[id]` adds messages to an existing conversation and verifies ownership.
- `ChatWorkspace` owns the visible message list. `InputTextBar` adds the user's message optimistically, then appends the assistant response returned by the API; failed sends remove the optimistic message and restore the draft.
- Preserve these response and UI update contracts when changing either chat API or its client.

## Routes

- `/` — public home workspace or redirect to `/chat`
- `/signin` — sign-in page
- `/signup` — sign-up page
- `/chat` — authenticated workspace and new conversation entry point
- `/chat/[id]` — authenticated conversation view

## Engineering conventions

- Keep changes minimal and production-focused; follow existing UI and auth patterns.
- Prefer server-side session checks with `auth.api.getSession({ headers: await headers() })` for protected pages and APIs.
- Keep conversation reads scoped to the signed-in user and do not expose another user's messages.
- Avoid unnecessary boilerplate, duplicate UI, and unused files.
- Use `npm run lint`, `npm run build`, and `npm run start` for validation and production execution as appropriate.
- Configure all required environment variables in the deployment environment.