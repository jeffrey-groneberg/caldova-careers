---
description: 'Astro page and component conventions for Caldova Careers'
applyTo: '**/*.astro'
---

# Astro conventions for Caldova Careers

Caldova Careers is mostly prerendered Astro 7. Keep pages static unless a route truly needs server execution.

## Rendering model

- `astro.config.mjs` sets `output: 'static'` with `@astrojs/node` only for the on-demand apply endpoint.
- `.astro` pages should be prerendered by default.
- The only server route is `src/pages/api/apply.ts`, which exports `prerender = false`.
- Dynamic role pages under `src/pages/roles/[slug].astro` should explicitly use `export const prerender = true` and `getStaticPaths()`.

## Jobs content collection

Read roles with `getCollection('jobs')`. Map entries into the plain `Job` shape before passing them to helpers or components:

```ts
const jobs = entries.map((entry) => ({ slug: entry.id, ...entry.data }));
```

When a page needs the Markdown body, render the selected entry:

```ts
const { Content } = await render(entry);
```

Use role and department terminology throughout, and do not add database-backed job rows.

## Dynamic role pages

`src/pages/roles/[slug].astro` should enumerate collection entry ids in `getStaticPaths()` and pass the selected entry through `props`. Prefer collection entry ids for URLs because they are stable slugs derived from filenames.

## Components and props

Keep reusable UI in `src/components/`. Define and document `Props` when a component accepts structured data, and avoid page-specific data fetching inside presentational components. Components such as `RoleCard` should accept mapped `Job` objects rather than raw collection entries.

## 404 page

Keep `src/pages/404.astro` branded for Caldova Careers. It should help visitors return to open roles and match the dark slate theme.

## Testability

Add `data-testid` to workflow-critical interactive elements and repeated cards, such as `role-card`, `role-search`, `role-sort`, `department-filter`, and `apply-submit`. Prefer accessible names that align with visible labels.

## Type checking

Use `npm run typecheck` for `.astro` type checking. It runs `astro check`; there are no extra typecheck variants or sync workarounds in this app.
