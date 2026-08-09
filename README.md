# AI Fitness Coach — Frontend

React (Vite) + Tailwind CSS frontend built against the backend's documented
API contract: JWT auth with refresh, role-based routing (user/admin), AI
chatbot over Socket.IO, RAG document ingestion, image upload + moderation
status, progress tracking, admin dashboard, analytics, and logs.

## Setup

```bash
npm install
cp .env.example .env   # point at your running backend
npm run dev
```

Requires the backend running (see its own README) at the URL in `.env`.

## What this was built against

I only had the backend's `README.md`, `package.json`, and `.env.example` —
not the actual controller/route/model source. The README's endpoint table
and Socket.IO section were treated as the source of truth; everything else
is a clearly-flagged assumption. **Before running against your real
backend, check these:**

1. **Response envelope** — `src/api/client.js` assumes
   `{ success, data, message }` (matching `utils/apiResponse.js` /
   `apiError.js` naming). If your actual shape differs, change `unwrap()`
   in that one file — every other API module builds on top of it.

2. **Undocumented endpoints** — the README's table doesn't cover chat
   history/listing, "my" progress photos, or a document list for the RAG
   admin view. Each is marked `// ASSUMED` in `src/api/*.api.js` with the
   inferred path — update those once the real routes are confirmed.

3. **Refresh token storage** — the README's own "next steps" section notes
   refresh tokens currently come back in the response body rather than an
   httpOnly cookie, so that's what this client does too (`localStorage`).
   If you move to httpOnly cookies server-side, delete the
   `refreshToken` handling in `src/api/client.js` and switch axios to
   `withCredentials: true`.

4. **Chat streaming** — implemented exactly as documented: emit
   `chat:send` with an ack, receive full replies via `chat:message`. If
   the backend actually streams token-by-token, add a `chat:token`
   listener in `src/pages/Chat.jsx` to append deltas instead of whole
   messages.

5. **`/admin/dashboard/overview`** and **`/progress/summary`** shapes
   aren't documented — both pages read defensively (numeric fields render
   as stat tiles; a missing `last14Days` array just shows an empty streak)
   rather than assuming specific fields.

## Structure

```
src/
  api/          one file per backend module, thin wrappers over axios
  lib/socket.js Socket.IO client, JWT handshake per README
  context/      AuthContext — login/register/logout, token + user state
  components/   ui/ primitives, layout/ (sidebar shell), route guards
  pages/        one page per user-facing feature, pages/admin/ for the console
```

## Design

Chalk-paper background, graphite ink, deep turf green as brand, kinetic
orange for CTAs/effort. Condensed display type (Bebas Neue) for headings,
IBM Plex Sans for body, IBM Plex Mono for data/log tables. The tally-mark
`StreakTicks` component is the signature element — a training-log streak
count, styled like marks on a gym chalkboard.
