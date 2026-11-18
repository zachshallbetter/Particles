# Contributing to Particles

Thanks for your interest. This is a solo-maintained project, so review is best-effort (see [SUPPORT.md](SUPPORT.md)).
Open an issue before a large change so the direction can be agreed first.

## Setup

Node.js with npm (the README's commands) or pnpm (the repository has a `pnpm-lock.yaml`).

```sh
npm install
npm run dev             # Vite dev server on http://localhost:4222 (port set in vite.config.ts)
```

## Build and test

```sh
npm run build           # tsc -b && vite build, output in dist/
npm run test:run        # vitest, one run
npm run test:coverage   # vitest with v8 coverage and the thresholds in vitest.config.ts
```

Tests are `*.test.ts(x)` files under `src/`, run in jsdom with the setup in `src/test/setup.ts`. See "Status and
limitations" in the [README](README.md) for what currently fails.

## Conventions

- TypeScript and React 19; the build is Vite (`vite.config.ts`). The Vite entry is `index.html` and `src/main.tsx`; the
  `app/` directory holds Next.js-style pages.
- Configuration for colours, waves and visual effects is in `config/`; controllers in `controllers/` and `src/controllers/`.
- Longer notes are in [`docs/`](docs/DEVELOPMENT.md) (architecture and coding guide).
- **Commits** are short messages, usually a conventional prefix with a sentence (`feat:`, `chore:`, `docs:`), for
  example `chore: preserve uncommitted WIP`.

## Pull requests

Keep one change per pull request and fill in the pull request template.
