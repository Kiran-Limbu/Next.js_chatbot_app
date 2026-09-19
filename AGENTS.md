<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Current UI Notes

- The app shell includes a sticky Lumina navbar with branding and a Log in action.
- The home page uses the generated shadcn sidebar primitives with responsive New chat, Recent chats, Log in, and Settings actions.
- Shared navigation controls use shadcn button variants and lucide-react icons.
- The shadcn sidebar is generated in `components/ui/sidebar.tsx`; the root layout provides its required `TooltipProvider`.
