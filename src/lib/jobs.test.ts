import { describe, it, expect } from 'vitest';
import { filterJobs, getDepartments, getLocations, sortByNewest, formatPostedDate } from './jobs';
import type { Job } from '../types/job';

function makeJob(slug: string, postedDate: string): Job {
    return {
        slug,
        title: `Role ${slug}`,
        department: 'Technology',
        location: 'Remote',
        type: 'Full-time',
        remote: true,
        postedDate,
        summary: 'A role.',
    };
}

describe('sortByNewest', () => {
    it('orders jobs by posted date, newest first', () => {
        const jobs = [
            makeJob('a', '2027-01-01'),
            makeJob('b', '2027-03-15'),
            makeJob('c', '2027-02-10'),
        ];
        expect(sortByNewest(jobs).map((j) => j.slug)).toEqual(['b', 'c', 'a']);
    });

    it('does not mutate the input array', () => {
        const jobs = [makeJob('a', '2027-01-01'), makeJob('b', '2027-03-15')];
        const original = jobs.map((j) => j.slug);
        sortByNewest(jobs);
        expect(jobs.map((j) => j.slug)).toEqual(original);
    });
});

describe('formatPostedDate', () => {
    it('formats an ISO date as a readable string', () => {
        expect(formatPostedDate('2027-01-05')).toBe('January 5, 2027');
    });

    it('returns the raw value when the date is unparseable', () => {
        expect(formatPostedDate('not-a-date')).toBe('not-a-date');
    });
});

/**
 * Ordered postings with overlapping departments and locations to distinguish AND
 * matching from either-filter matching, including a remote and an onsite Technology role.
 */
const filterFixtures: Job[] = [
  { ...makeJob('remote-engineer', '2027-03-15'), department: 'Technology', location: 'Remote (US & Canada)' },
  { ...makeJob('finance-woodinville', '2027-02-10'), department: 'Finance', location: 'Woodinville, WA, USA' },
  { ...makeJob('local-engineer', '2027-01-05'), department: 'Technology', location: 'Woodinville, WA, USA' },
  { ...makeJob('finance-helsinki', '2027-01-01'), department: 'Finance', location: 'Helsinki, Finland' },
];

describe('filterJobs', () => {
  it('filters by department alone in the original order', () => {
    expect(filterJobs(filterFixtures, 'Technology', '').map((job) => job.slug))
      .toEqual(['remote-engineer', 'local-engineer']);
  });

  it('filters by the complete location label alone', () => {
    expect(filterJobs(filterFixtures, '', 'Woodinville, WA, USA').map((job) => job.slug))
      .toEqual(['finance-woodinville', 'local-engineer']);
    expect(filterJobs(filterFixtures, '', 'Remote (US & Canada)').map((job) => job.slug))
      .toEqual(['remote-engineer']);
  });

  it('requires both selected filters to match', () => {
    expect(filterJobs(filterFixtures, 'Technology', 'Woodinville, WA, USA').map((job) => job.slug))
      .toEqual(['local-engineer']);
    expect(filterJobs(filterFixtures, 'Technology', 'Helsinki, Finland')).toEqual([]);
  });

  it('clears either filter independently and resets to the complete ordered list', () => {
    expect(filterJobs(filterFixtures, '', 'Woodinville, WA, USA'))
      .toEqual([filterFixtures[1], filterFixtures[2]]);
    expect(filterJobs(filterFixtures, 'Technology', ''))
      .toEqual([filterFixtures[0], filterFixtures[2]]);
    expect(filterJobs(filterFixtures, '', '')).toEqual(filterFixtures);
  });

  it.each([
    ['Unknown', ''],
    ['', 'Unknown'],
    ['technology', ''],
    ['', 'Remote'],
    [' Technology ', ''],
  ])('returns no results for a nonmatching department %j or location %j', (department, location) => {
    expect(filterJobs(filterFixtures, department, location)).toEqual([]);
  });

  it('handles empty input with or without selections', () => {
    expect(filterJobs([], '', '')).toEqual([]);
    expect(filterJobs([], 'Technology', 'Remote (US & Canada)')).toEqual([]);
  });

  it('does not mutate the source jobs or array', () => {
    const jobs = structuredClone(filterFixtures);
    const original = structuredClone(jobs);
    filterJobs(jobs, 'Technology', 'Woodinville, WA, USA');
    filterJobs(jobs, '', '');
    expect(jobs).toEqual(original);
  });
});

describe('filter options', () => {
  it('derives unique alphabetized departments without changing the input', () => {
    const original = structuredClone(filterFixtures);
    expect(getDepartments(filterFixtures)).toEqual(['Finance', 'Technology']);
    expect(filterFixtures).toEqual(original);
  });

  it('derives unique alphabetized full location labels', () => {
    expect(getLocations(filterFixtures)).toEqual([
      'Helsinki, Finland',
      'Remote (US & Canada)',
      'Woodinville, WA, USA',
    ]);
  });

  it('has no options for empty input', () => {
    expect(getDepartments([])).toEqual([]);
    expect(getLocations([])).toEqual([]);
  });
});
