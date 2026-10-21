import { defineConfig } from 'drizzle-kit';

// The only relational data in this project is the anonymous `applications`
// table. Jobs are Markdown files in a content collection, not database rows.
const url = process.env.DATABASE_URL ?? 'file:./.data/careers.db';

export default defineConfig({
    dialect: 'sqlite',
    driver: 'durable-sqlite',
    schema: './db/schema.ts',
    out: './db/migrations',
    dbCredentials: { url },
});
