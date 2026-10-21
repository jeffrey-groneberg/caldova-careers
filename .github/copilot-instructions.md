# Caldova Careers Development Guidelines

This repository contains **Caldova Careers**, an Astro 7 careers board for a fictional AI-native pharmaceutical company. It is the sample app for a **GitHub Copilot CLI** workshop.

## Architecture overview

- Astro 7 uses `output: 'static'` for a mostly prerendered site.
- The only on-demand route is `src/pages/api/apply.ts`, which exports `prerender = false` and exists to write job applications.
- The `@astrojs/node` adapter is present only so `/api/apply` can run on the built Node server.
- Tailwind CSS v4 is wired through `@tailwindcss/vite` with global styles in `src/styles/global.css`.
- Job postings are Astro Content Collection Markdown files in `src/content/jobs/*.md`; they are not database rows.
- The only relational data is the anonymous `applications` table managed with Drizzle ORM and libSQL/SQLite.

## Data layer

Job postings live in the `jobs` content collection defined in `src/content.config.ts` with `import { z } from 'astro/zod'`. Each job file has frontmatter for `title`, `department`, `location`, `type`, `remote`, `postedDate`, and `summary`; the content entry `id` is the filename slug used in role URLs.

Applications live in `db/schema.ts` as the single `applications` table. The `jobId` column is a text logical reference to a content collection entry id and is validated at insert time, not enforced as a database foreign key. Keep application validation in `src/lib/applications.ts` and inject the database into helpers so tests can use `createTestDatabase()`.

> [!IMPORTANT]
> Do not add jobs to the database or create seed data. Jobs are content files; applications are the only database-backed feature.

## Astro conventions

Use `getCollection('jobs')` in pages, map entries to plain `Job` objects, and pass those arrays into pure helpers in `src/lib/jobs.ts`. Dynamic role pages live at `src/pages/roles/[slug].astro` and should prerender with `getStaticPaths()` from collection entry ids. Render Markdown bodies with `const { Content } = await render(entry)`.

## Code standards

- Use TypeScript with explicit parameter and return types on every exported function.
- Prefer small, pure, single-purpose helpers in `src/lib/` that operate on plain arrays and are easy to unit-test.
- Keep imports at the top of the file and use consistent 2-space indentation.
- Name functions and variables descriptively; avoid abbreviations.

## Styling and accessibility

Use the dark slate Caldova theme with Navy `#16234B`, Royal `#2E6CFC`, and Ice `#F4F7FC`. Keep reusable UI in `src/components/`, prefer native HTML first, add visible focus states, and use `data-testid` on interactive or workflow-critical elements.

## Scripts

- `npm run dev` — start the Astro dev server; `predev` runs `db:setup` first.
- `npm run build` — build the static site plus Node server entry; `prebuild` runs `db:setup` first.
- `npm run preview` — preview the build when needed.
- `npm run start` — run `node ./dist/server/entry.mjs` for the built Node server.
- `npm run db:generate` — generate Drizzle migrations.
- `npm run db:migrate` — run `tsx db/migrate.ts`.
- `npm run db:setup` — migrate only; there is no seed step.
- `npm run test:unit` — run Vitest.
- `npm run test:e2e` — run Playwright against the built Node server.
- `npm run test:e2e:install` — install Chromium for Playwright.
- `npm run lint` — run ESLint.
- `npm run typecheck` — run `astro check`; this is the only typecheck script.

## Repository structure

- `src/content/jobs/` — Markdown job postings.
- `src/content.config.ts` — the `jobs` collection schema.
- `src/types/job.ts` — the plain `Job` interface used by helpers and UI.
- `src/lib/jobs.ts` — pure helpers over `Job[]` arrays.
- `src/lib/applications.ts` — standalone Zod validation and application insert helper.
- `src/lib/db.ts` — database client creation.
- `src/components/` — `Header`, `RoleCard`, `Tag`, `EmptyState`, and `ApplyForm` components.
- `src/layouts/Layout.astro` — shared page shell.
- `src/pages/` — listing, detail, apply endpoint, thanks, about, and 404 routes.
- `db/` — Drizzle schema, migrations, migration runner, and test helpers.
- `e2e-tests/` — Playwright specs.

## Quality checks

Use `.github/skills/quality-checks` for routine linting, type checking, and unit tests. General requests to run tests and linters must not add E2E tests to this routine. E2E tests remain available separately for explicit E2E requests and CI; see `.github/instructions/playwright.instructions.md`. Prefer targeted checks while working, then run the relevant full command before handing off.

## Agent notes

Make precise changes that preserve the workshop's teaching goals. Keep helpers small and unit-testable, avoid adding application features outside the requested issue, and do not introduce scripts, tools, or data sources that are not already in `package.json`.

## Commit hygiene

Use conventional commit prefixes when practical and include this trailer in commits:

```text
Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>
```
