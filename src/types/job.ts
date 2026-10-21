/**
 * Centralized type definitions for job-posting data.
 *
 * `Job` is the plain shape mapped from a `jobs` content-collection entry and
 * consumed by pages, components, and the pure helpers in `src/lib/jobs.ts`.
 */

/** Employment type for a posting. */
export type EmploymentType = 'Full-time' | 'Part-time' | 'Contract';

/** A single open role, mapped from a content-collection entry. */
export interface Job {
    /** Stable slug (content-collection entry id), used in URLs and as jobId. */
    slug: string;
    title: string;
    department: string;
    location: string;
    type: EmploymentType;
    remote: boolean;
    /** ISO-8601 date the role was posted. */
    postedDate: string;
    summary: string;
}
