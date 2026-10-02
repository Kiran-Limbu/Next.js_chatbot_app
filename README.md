# Lumina Chatbot App

Lumina is a Next.js chatbot workspace with Better Auth, MongoDB persistence, and a live-updating chat interface.

## Stack

- Next.js 16 App Router
- React 19
- Better Auth with email/password and Google sign-in
- MongoDB with Mongoose for conversations and messages
- Tailwind CSS

## Environment

Create `.env.local` in the project root:

```env
DB_URL=mongodb://localhost:27017/your-database
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
SERVER_URL=http://localhost:3000
BASE_URL=http://localhost:3000
```

`SERVER_URL` configures the Better Auth client. `BASE_URL` is the Axios API base URL used by chat requests; for local development, set it to the running app origin. Configure production values in the hosting environment. `GEMINI_API_KEY` is needed only when connecting the Gemini module to chat generation; chat currently returns a temporary hard-coded assistant response.

## Install and run

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Routes

| Route | Purpose |
| --- | --- |
| `/` | Public home workspace; signed-in users are redirected to `/chat` |
| `/signin` | Email/password and Google sign-in |
| `/signup` | Email/password and Google sign-up |
| `/chat` | Authenticated workspace and new conversation entry point |
| `/chat/[id]` | An authenticated conversation and its messages |

Chat messages are saved through `/api/chat` for a new conversation and `/api/chat/[id]` for an existing one. The user's message appears immediately in the interface; the assistant message appears when the API responds. Conversations and messages are stored separately and linked by `conversationId`.

## Production build

```bash
npm run build
npm run start
```

## Key files

- `src/lib/auth.ts` and `src/lib/auth-client.ts` — server and client auth configuration
- `src/lib/db.ts` — Mongoose database connection
- `src/models/conversation.model.ts` and `src/models/message.model.ts` — persisted chat models
- `src/app/api/auth/[...id]/route.ts` — Better Auth API handler
- `src/app/api/chat/route.ts` and `src/app/api/chat/[id]/route.ts` — chat APIs
- `components/chat/ChatWorkspace.tsx` and `components/userInputBar/InputTextBar.tsx` — chat UI and live message state
- `src/app/layout.tsx` — app shell and layout
