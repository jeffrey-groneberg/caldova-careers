# Caldova Careers

The careers site for **Caldova**, an AI-native pharmaceutical company. Browse open roles and submit an application with your name and email — no account required.

This is the sample application for the **GitHub Copilot CLI** workshop. It's a deliberately small, realistic app: job postings are Markdown content, and the only database-backed feature is the apply flow.

> [!NOTE]
> Caldova is a fictional company created for demonstration and training purposes. The roles, locations, and applications in this app are not real.

> [!WARNING]
> This project is a teaching sample for a GitHub Copilot CLI workshop. It is provided as-is for learning and demonstration purposes and is not intended, hardened, or supported for production use.

## Tech stack

- **[Astro](https://astro.build/)** — static output by default, with a single on-demand route for the apply endpoint (via the `@astrojs/node` adapter)
- **[Tailwind CSS v4](https://tailwindcss.com/)** — styling, themed with the Caldova brand palette
- **Astro Content Collections** — job postings are Markdown + frontmatter in `src/content/jobs/` (validated by a Zod schema)
- **[Drizzle ORM](https://orm.drizzle.team/) + libSQL (SQLite)** — the `applications` table only
- **[Vitest](https://vitest.dev/)** — unit tests for pure logic and an integration test for the apply insert
- **[Playwright](https://playwright.dev/)** — end-to-end tests (runs against the built Node server)

## Getting started

### GitHub Codespaces

Create a repository from this template, then select **Code > Codespaces > Create codespace on main**. The devcontainer uses Node.js 24 and includes the GitHub CLI. During setup it installs project dependencies and Playwright Chromium, then applies the local database migrations. Wait for setup to finish, run `npm run dev`, and open forwarded port `4321` in your browser.

### Local development

```bash
npm install
npm run dev
```

`predev` runs `db:setup` (applies the `applications` migration) before starting the dev server at <http://localhost:4321>.

## Data model

- **Job postings** are files, not database rows: one Markdown file per role in `src/content/jobs/`, with frontmatter (`title`, `department`, `location`, `type`, `remote`, `postedDate`, `summary`) and a Markdown body. The schema lives in `src/content.config.ts`.
- **Applications** are the only relational data: the `applications` table (`db/schema.ts`) stores each submission — a logical `jobId` reference, the applicant's `name` and `email`, and optional `note` / `links`. There is no authentication; the applicant supplies their details directly on the form.

## Project structure

- `src/content/jobs/` — job postings (Markdown + frontmatter)
- `src/content.config.ts` — content collection schema
- `src/lib/jobs.ts` — pure helpers over `Job[]` (sorting, formatting)
- `src/lib/applications.ts` — application validation schema + insert helper
- `src/lib/db.ts` — Drizzle/libSQL client for the `applications` table
- `src/pages/` — `index.astro` (listing), `roles/[slug].astro` (detail + apply form), `api/apply.ts` (on-demand endpoint), `thanks.astro`, `about.astro`, `404.astro`
- `src/components/` — reusable `.astro` components
- `db/` — Drizzle schema, migrations, and migrate/test helpers
- `e2e-tests/` — Playwright tests

## Scripts

- `npm run dev` — start the dev server (`predev` migrates the database)
- `npm run build` — build the site (`prebuild` migrates the database)
- `npm run start` — run the built Node server (`dist/server/entry.mjs`)
- `npm run test:unit` — Vitest unit + integration tests
- `npm run test:e2e` — Playwright e2e tests (builds + starts the server first)
- `npm run lint` — ESLint
- `npm run typecheck` — `astro check`
- `npm run db:generate` / `db:migrate` / `db:setup` — Drizzle schema/migration tasks

## Using this template

This repository is a GitHub template. When you create a new repository from it, a one-time **Bootstrap issues** workflow (`.github/workflows/bootstrap-issues.yml`) runs automatically on the first push to `main` and opens a set of starter issues describing suggested first features. Each issue is defined by a Markdown file in `.github/bootstrap-issues/` — the first heading becomes the issue title and the remaining content becomes the body — so you can edit, add, or remove files there to control which issues are created.

The workflow only runs on repositories created from the template (the `if: ${{ !github.event.repository.is_template }}` guard skips the template itself), and after creating the issues it removes itself and the `.github/bootstrap-issues/` folder in a cleanup commit so it never runs again.

The starter intentionally leaves location labels off role cards while retaining location data and detail-page labels for the workshop warm-up. The **Filter roles by department and location** issue (`workshop:filtering`) starts the longer feature exercise. Filtering, the TSDoc instruction addition, the `quality-checks` skill's results formatting, and `.github/agents/qa.agent.md` are left for learners to implement.

The only bundled skill is `.github/skills/quality-checks/SKILL.md`. The starter includes no custom agents or MCP server configuration: learners configure Playwright MCP in Copilot CLI and create the QA agent during the workshop. GitHub MCP is built into Copilot CLI and needs no repository server configuration.

The `quality-checks` skill runs lint, type checking, and unit tests only, even for a general request to run tests and linters. Playwright E2E tests remain available separately and run in CI; browser observation with Playwright MCP is a later workshop exercise.

## Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for how to set up your environment, run the checks, and submit a pull request. This project follows the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md).

## Support

Need help? See [SUPPORT.md](SUPPORT.md) for how to file issues and get assistance.

## Security

To report a security vulnerability, please follow the process in [SECURITY.md](SECURITY.md) — do not open a public issue.

## License

Licensed under the [MIT License](LICENSE).
