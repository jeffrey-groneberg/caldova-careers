---
description: 'Drizzle and libSQL conventions for the applications table'
applyTo: 'db/**/*.ts,src/lib/*.ts'
---

# Drizzle conventions for Caldova Careers

The database stores anonymous applications only. Job postings are content collection files and must not be modeled as database tables.

## Schema boundaries

- `db/schema.ts` defines the single `applications` table.
- `jobId` is a text logical reference to a `jobs` content entry id; validate it before insert rather than adding a foreign key.
- `name` and `email` are the required applicant contact fields (no auth/login).
- `note` and `links` are nullable optional applicant-provided fields.
- `submittedAt` records when the application was created.

## Database files

- `db/migrate.ts` applies generated migrations.
- `db/migrations/` contains generated Drizzle migrations and metadata; commit generated migrations with schema changes.
- `db/test-helpers.ts` exposes `createTestDatabase()` for migrated in-memory libSQL tests.
- `src/lib/db.ts` creates runtime database clients with `createDatabase(url)` and `getDatabase()`.
- `src/lib/applications.ts` owns the standalone Zod `applicationSchema` and injectable `createApplication(db, input)` insert helper.

## Migration workflow

1. Edit `db/schema.ts`.
2. Run `npm run db:generate`.
3. Run `npm run db:setup` to apply migrations only.
4. Commit the schema and generated migration files together.

There is no seed step. Do not add sample-data transforms, deterministic generated role data, or job-posting database rows.

## Testing

Unit and integration tests should inject a database from `createTestDatabase()` into `createApplication()`. Never start Astro just to test the database helper.

## Type checking

The data layer is checked by `npm run typecheck`, which runs `astro check`. There is no separate typecheck command.
