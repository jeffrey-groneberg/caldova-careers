/**
 * Database schema for Caldova Careers.
 *
 * Job postings live in an Astro content collection (Markdown + frontmatter),
 * NOT in the database. The only relational data is the `applications` table,
 * written when a candidate submits the apply form. There is no authentication;
 * the applicant simply supplies their name and email on the form.
 */
import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';

export const applications = sqliteTable('applications', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    // Logical reference to a job content-collection entry id (its file slug).
    // This is validated against the collection at insert time; it is not an
    // enforced foreign key because jobs are files, not table rows.
    jobId: text('job_id').notNull(),
    // Applicant contact details. Collected on the form (no auth/login).
    name: text('name').notNull(),
    email: text('email').notNull(),
    // Optional free-form fields the candidate can share.
    note: text('note'),
    links: text('links'),
    submittedAt: text('submitted_at')
        .notNull()
        .$defaultFn(() => new Date().toISOString()),
});

export type ApplicationRow = typeof applications.$inferSelect;
