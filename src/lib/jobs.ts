/**
 * Pure, side-effect-free helpers for working with job postings.
 *
 * These operate on plain `Job[]` arrays (already loaded from the content
 * collection by the calling page) so they can be unit tested without the Astro
 * content runtime or a database.
 */
import type { Job } from '../types/job';

/**
 * Derives department options from the complete listing, independently of active filters.
 *
 * @param jobs - Plain job postings; the input is not mutated.
 * @returns Unique department labels sorted alphabetically using English collation.
 */
export function getDepartments(jobs: Job[]): string[] {
  return [...new Set(jobs.map((job) => job.department))].sort((a, b) => a.localeCompare(b, 'en'));
}

/**
 * Derives location options without grouping full labels or interpreting remote status.
 *
 * @param jobs - Plain job postings; the input is not mutated.
 * @returns Unique full location labels sorted alphabetically using English collation.
 */
export function getLocations(jobs: Job[]): string[] {
  return [...new Set(jobs.map((job) => job.location))].sort((a, b) => a.localeCompare(b, 'en'));
}

/**
 * Matches every active filter by exact, case-sensitive label equality.
 *
 * @param jobs - Plain job postings in the desired display order.
 * @param department - A full department label, or an empty string for all departments.
 * @param location - A full location label, or an empty string for all locations.
 * @returns A new array in input order, without mutating jobs. Unknown labels or
 * incompatible combinations return no matches; clearing both filters restores all jobs.
 */
export function filterJobs(jobs: Job[], department: string, location: string): Job[] {
  return jobs.filter((job) =>
    (department === '' || job.department === department)
    && (location === '' || job.location === location),
  );
}

/** Return jobs sorted by posted date, newest first (does not mutate input). */
export function sortByNewest(jobs: Job[]): Job[] {
    return [...jobs].sort(
        (a, b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime(),
    );
}

/**
 * Format an ISO-8601 date as a human-readable posted date,
 * e.g. "January 5, 2027". Falls back to the raw value if unparseable.
 */
export function formatPostedDate(iso: string): string {
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) {
        return iso;
    }
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'UTC',
    });
}
