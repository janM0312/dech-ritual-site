# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Single-page marketing site for "dech.ritual" (Czech breathwork instructor Lucie Vaňková). Built with
[Lovable](https://lovable.dev) — commits pushed to `main` sync back into the Lovable editor, so keep
`main` in a working state and avoid rewriting published history (force-push, rebase/amend/squash of
pushed commits) per `AGENTS.md`.

## Commands

Package manager is **Bun** (`bun.lock`, `bunfig.toml`) — use `bun`, not npm/pnpm/yarn.

```sh
bun install         # install deps
bun run dev         # vite dev server
bun run build       # production build (server build by default)
bun run preview     # preview a build
bun run lint        # eslint .
bun run format      # prettier --write .
```

There is no test suite/runner configured in this repo.

`bunfig.toml` enforces a 24h supply-chain guard (`minimumReleaseAge`) on new dependency versions;
only a fixed allowlist of `@lovable.dev/*` packages bypasses it. Adding another bypass requires
confirming with the user first.

## Architecture

- **Framework**: TanStack Start (React 19) + TanStack Router, using **file-based routing** — see
  `src/routes/README.md` for the routing conventions (no `src/pages/`, no Next/Remix-style layout
  files; `src/routes/__root.tsx` is the only root shell). `src/routeTree.gen.ts` is generated —
  never hand-edit it.
- **Vite config** (`vite.config.ts`) wraps `@lovable.dev/vite-tanstack-config`, which already wires
  up TanStack Start/devtools, React, Tailwind v4, `vite-tsconfig-paths`, Nitro, and sandbox
  detection — do not re-add any of those plugins manually (see the comment at the top of the file).
  It branches on two env vars:
  - `STATIC_BUILD=true` switches to a fully prerendered static build (output in `dist/client`,
    no server) instead of the default SSR/Nitro server build.
  - `BASE_PATH` sets the Vite `base` for the static build, used to deploy under a GitHub Pages
    subpath (`/<repo>/`).
- **Deployment**: `.github/workflows/deploy-pages.yml` builds with `STATIC_BUILD=true` and
  `BASE_PATH="/${{ github.event.repository.name }}/"`, copies `index.html` to `404.html` (SPA
  fallback), and publishes `dist/client` to GitHub Pages.
- **Server entry** (`src/server.ts`, wired via `tanstackStart.server.entry` in `vite.config.ts`):
  wraps TanStack Start's generated server entry to normalize error responses. It specifically
  detects h3's pattern of swallowing in-handler throws into a generic
  `{"unhandled":true,"message":"HTTPError"}` 500 JSON response (which a plain try/catch can't
  intercept) and replaces those with a static error HTML page (`src/lib/error-page.ts`).
  `src/lib/error-capture.ts` hooks `console.error` and global error/rejection listeners so the
  original error (with stack/cause chain) can be recovered and logged when this happens.
- **Start config** (`src/start.ts`): defines request middleware — an error-normalizing middleware
  (mirrors the server.ts behavior for the dev/SSR path) and an explicitly re-added CSRF middleware
  for server functions (defining `start.ts` at all opts out of TanStack Start's automatic CSRF
  protection, so it must be re-declared here).
- **Content model** (`src/content/`): page copy lives in Czech-language `.md` files
  (`o-mne.md`, `přínosy.md`, `služby.md`, `reference.md`, `dotazy.md`), each parsed by a small
  custom deterministic parser (`parse.ts`) into `{ title, meta, body, items[] }` — `#` is the doc
  title, `##` starts an item, and `key: value` lines become `meta` entries (on the doc or on the
  current item). Files are inlined at build time via Vite `?raw` imports in `content/index.ts`, so
  editing a `.md` file and rebuilding is sufficient to change site copy — no code changes needed
  for content edits.
- **Single page component**: `src/routes/index.tsx` renders the entire site (header, hero, about,
  benefits, services, reservations, community, testimonials, FAQ, footer) by mapping over the
  parsed content docs above. It also mounts the third-party **Zenamu** booking widget by injecting
  its script tag and setting `calendar-id`/`data-config` attributes on a ref'd div — see the
  `useEffect` in `Index()`.
- **UI components** (`src/components/ui/`): shadcn/ui primitives (`components.json`: style
  "new-york", Tailwind v4 CSS variables, `@/*` path alias to `src/*`). Generate/update via the
  shadcn CLI rather than hand-authoring new primitives from scratch.
- **Error reporting** (`src/lib/lovable-error-reporting.ts`): forwards React error-boundary
  failures to Lovable's editor preview telemetry (`window.__lovableEvents` /
  `window.__lovableReportRuntimeError`), which are otherwise invisible in production React. This is
  only active inside the Lovable editor preview, not real production traffic.

## Conventions

- Prettier: 100 char width, double quotes, semicolons, trailing commas everywhere
  (`.prettierrc`). ESLint delegates formatting conflicts to Prettier (`eslint-plugin-prettier`).
- `@typescript-eslint/no-unused-vars` is off and `noUnusedLocals`/`noUnusedParameters` are off in
  `tsconfig.json` — unused vars are not flagged in this repo.
- Don't import the `server-only` package (Next.js convention) — ESLint blocks it; use a `*.server.ts`
  filename or `@tanstack/react-start/server-only` instead.
