import { describe, it, expect } from 'vitest';
import { applicationSchema } from './applications';

describe('applicationSchema', () => {
    const base = { jobId: 'senior-frontend-engineer', name: 'Alex Doe', email: 'alex@example.com' };

    it('accepts a valid payload with the required fields', () => {
        const result = applicationSchema.safeParse(base);
        expect(result.success).toBe(true);
    });

    it('accepts an optional note and links', () => {
        const result = applicationSchema.safeParse({
            ...base,
            note: 'Excited about accessible UI work.',
            links: 'https://example.com/portfolio',
        });
        expect(result.success).toBe(true);
    });

    it('rejects a missing jobId', () => {
        const result = applicationSchema.safeParse({ name: 'Alex Doe', email: 'alex@example.com' });
        expect(result.success).toBe(false);
    });

    it('rejects an empty jobId', () => {
        const result = applicationSchema.safeParse({ ...base, jobId: '' });
        expect(result.success).toBe(false);
    });

    it('rejects a missing name', () => {
        const result = applicationSchema.safeParse({ jobId: 'a', email: 'alex@example.com' });
        expect(result.success).toBe(false);
    });

    it('rejects a missing or invalid email', () => {
        expect(applicationSchema.safeParse({ jobId: 'a', name: 'Alex Doe' }).success).toBe(false);
        expect(
            applicationSchema.safeParse({ jobId: 'a', name: 'Alex Doe', email: 'not-an-email' }).success,
        ).toBe(false);
    });

    it('rejects an overly long note', () => {
        const result = applicationSchema.safeParse({
            ...base,
            note: 'x'.repeat(2001),
        });
        expect(result.success).toBe(false);
    });
});
