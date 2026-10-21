import { describe, it, expect, beforeEach } from 'vitest';
import { createTestDatabase } from '../../db/test-helpers';
import { applications } from '../../db/schema';
import { createApplication } from './applications';
import type { Database } from './db';

describe('createApplication (integration)', () => {
    let db: Database;

    beforeEach(async () => {
        db = await createTestDatabase();
    });

    it('persists an application row and returns its id', async () => {
        const id = await createApplication(db, {
            jobId: 'senior-frontend-engineer',
            name: 'Alex Doe',
            email: 'alex@example.com',
            note: 'Portfolio attached.',
            links: 'https://example.com',
        });
        expect(id).toBeGreaterThan(0);

        const rows = await db.select().from(applications);
        expect(rows).toHaveLength(1);
        expect(rows[0].jobId).toBe('senior-frontend-engineer');
        expect(rows[0].name).toBe('Alex Doe');
        expect(rows[0].email).toBe('alex@example.com');
        expect(rows[0].note).toBe('Portfolio attached.');
        expect(rows[0].submittedAt).toBeTruthy();
    });

    it('stores null for blank optional fields', async () => {
        await createApplication(db, {
            jobId: 'data-platform-engineer',
            name: 'Sam Lee',
            email: 'sam@example.com',
            note: '   ',
        });
        const rows = await db.select().from(applications);
        expect(rows[0].note).toBeNull();
        expect(rows[0].links).toBeNull();
    });

    it('throws when the payload is invalid', async () => {
        await expect(createApplication(db, { jobId: '' })).rejects.toThrow();
    });
});
