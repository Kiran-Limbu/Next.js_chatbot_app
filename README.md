# Lumina Chatbot App

Lumina is a Next.js chatbot application with Better Auth, MongoDB storage, and a Gemini-powered assistant flow.

## Stack

- Next.js 16 App Router
- React 19
- Better Auth
- MongoDB + Mongoose
- Gemini API integration
- Tailwind CSS

## Environment

Create a `.env.local` file in the project root:

```env
DB_URL=mongodb://localhost:27017/your-database
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
SERVER_URL=http://localhost:3000
BASE_URL=http://localhost:3000
GEMINI_API_KEY=your-gemini-api-key
```

- `DB_URL` connects MongoDB.
- `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` enable Google sign-in.
- `SERVER_URL` is used by the Better Auth client.
- `BASE_URL` is used by the frontend API wrapper for chat requests.
- `GEMINI_API_KEY` is required for the Gemini integration in the chat API.

## Install and run

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Routes

| Route | Purpose |
| --- | --- |
| `/` | Public home workspace; signed-in users are redirected to `/chat` |
| `/signin` | Email/password and Google sign-in |
| `/signup` | Email/password and Google sign-up |
| `/chat` | Authenticated chat workspace and new conversation start |
| `/chat/[id]` | Authenticated conversation detail page |

## Chat behavior

- `POST /api/chat` creates a conversation and stores the initial user and assistant messages.
- `POST /api/chat/[id]` adds a message to an existing conversation and verifies ownership.
- Messages are stored in MongoDB and linked by `conversationId`.
- The client adds the user message optimistically and shows the assistant response when the API returns it.

## Production build

```bash
npm run build
npm run start
```

## Key files

- `src/lib/auth.ts` — Better Auth and MongoDB adapter setup
- `src/lib/auth-client.ts` — client-side auth helper
- `src/lib/db.ts` — MongoDB connection
- `src/lib/gemini.ts` — Gemini generation client
- `src/models/conversation.model.ts` — conversation schema
- `src/models/message.model.ts` — message schema
- `src/app/api/auth/[...id]/route.ts` — Better Auth API handler
- `src/app/api/chat/route.ts` — create new conversation and first message
- `src/app/api/chat/[id]/route.ts` — add message to existing conversation
- `components/chat/ChatWorkspace.tsx` — chat UI and message state
- `components/userInputBar/InputTextBar.tsx` — send-message input and optimistic updates
- `src/app/layout.tsx` — app shell and layout

## Deployment note

Deploy this as a standard Next.js production app and set all required environment variables in the host environment before starting the app.
