---
description: 'Playwright end-to-end testing conventions for Caldova Careers'
applyTo: '**/*.spec.ts'
---

# Playwright conventions

Playwright specs live in `e2e-tests/` and exercise user-visible flows against the built Node server.

## Runtime model

The suite uses `webServer.command: 'npm run build && npm run start'` because the apply flow writes through an on-demand endpoint. Do not switch e2e tests to `astro preview`. The port defaults to `4321` and can be overridden with `PLAYWRIGHT_PORT`; the config passes `DATABASE_URL: 'file:./.data/e2e.db'`, `HOST`, and `PORT` to the server.

## Locator strategy

Prefer role-based locators and accessible names. Use `data-testid` for repeated cards and workflow-critical controls when roles are not enough, such as `role-card`, `apply-submit`, `role-search`, and pagination controls.

## Assertions

Use web-first assertions such as `toBeVisible()`, `toHaveURL()`, `toHaveText()`, and `toHaveCount()`. Do not use `waitForTimeout()`; wait for observable UI state instead.

## Project scenarios

Cover the roles listing, role detail pages, and the apply flow. The core scenarios should verify that all role cards render, axe accessibility checks pass, and submitting an application navigates to `/thanks`.

## Test organization

Use `test.step()` for multi-stage flows so reports are readable. Keep specs focused on user outcomes rather than implementation details.

## Running tests

E2E tests are outside the routine `quality-checks` skill. Run `npm run test:e2e` separately when explicitly requested or in CI. Install Chromium with `npm run test:e2e:install` when the browser is missing.
