---
description: 'Vitest unit testing conventions for Caldova Careers'
applyTo: '**/*.test.ts'
---

# Unit testing conventions

Use Vitest for fast tests around pure logic and the small applications data layer. Unit tests should not start Astro or Playwright.

## High-value test layers

1. Test pure job helpers directly with `Job[]` fixtures. Cover sorting, date formatting, filters, pagination, and the Exercise 2 departments helper.
2. Test the applications layer by validating `applicationSchema` directly and testing `createApplication()` against `createTestDatabase()`.

## Pure helper tests

Build small inline `Job[]` fixtures that describe the behavior under test. Do not load content collection files from helper tests unless the test is specifically about page integration. Assert stable ordering and edge cases such as empty arrays, duplicate departments, unknown filters, and invalid dates.

## Applications tests

Test `applicationSchema` without a database for validation failures and normalized input. Test `createApplication(db, input)` with an injected migrated in-memory libSQL database from `db/test-helpers.ts`.

## Boundaries

Do not start Astro, hit `/api/apply`, or run the built Node server from unit tests. Those behaviors belong in Playwright specs.
