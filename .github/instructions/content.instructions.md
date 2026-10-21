---
description: 'Content collection and pure helper conventions for Caldova Careers'
applyTo: 'src/content.config.ts,src/lib/*.ts,src/types/*.ts'
---

# Content collection data-layer conventions

Job postings are content, not relational data. Keep role data in Astro Content Collection Markdown files and keep reusable business logic in pure helpers.

## Jobs collection

The `jobs` collection is defined in `src/content.config.ts` using `import { z } from 'astro/zod'` and a glob loader over `src/content/jobs/*.md`. Each Markdown file owns frontmatter for `title`, `department`, `location`, `type`, `remote`, `postedDate`, and `summary`. The entry `id` is the filename slug and should be used as the stable role id.

> [!IMPORTANT]
> Do not put job postings in the database. Do not add seed scripts or relational job tables.

## Pure helpers

Helpers in `src/lib/jobs.ts` should operate on plain `Job[]` arrays, not on `getCollection()` results. Pages call `getCollection('jobs')`, map each entry to `{ slug: entry.id, ...entry.data }`, then pass those arrays to helpers.

Keep helper parameters and return values explicit. Helpers such as `sortByNewest`, `formatPostedDate`, filters, pagination, and derived values should be deterministic and easy to unit-test without the Astro runtime.

## Types

Use `src/types/job.ts` as the shared plain TypeScript model for role helpers and components. Avoid importing Astro content collection types into lower-level helpers unless a page-level adapter needs them.

## Applications contrast

Applications are the only database-backed feature. Validation and inserts belong in `src/lib/applications.ts`, and schema/migrations belong under `db/`. See `drizzle.instructions.md` for database guidance.
