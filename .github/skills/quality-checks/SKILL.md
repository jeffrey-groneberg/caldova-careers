---
name: quality-checks
description: Runs the routine quality checks for this project — ESLint, the Astro type check, and Vitest unit tests. Use this skill for requests to run tests and linters or validate code changes. Playwright E2E tests and browser setup are outside this skill.
---

# Quality checks

Use this skill when you need to validate changes in Caldova Careers. For a general request such as "run tests and linters", run only the three commands below. Do not run E2E tests, install browsers, build the app, or start a server as part of this routine.

## Quick reference

| Check | Command | Notes |
| ----- | ------- | ----- |
| Lint | `npm run lint` | ESLint over the project. |
| Typecheck | `npm run typecheck` | Runs `astro check`; this is the single typecheck command. |
| Unit tests | `npm run test:unit` | Vitest tests for pure helpers and the applications layer. |

## Database notes

The only database table is `applications`. Database tests use `createTestDatabase()` for migrated in-memory databases; this routine does not need a local database setup or seed step. Jobs are Markdown content files.
