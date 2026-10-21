# Filter roles by department and location
<!-- labels: workshop:filtering -->

Candidates should be able to narrow roles by department and location. Agree on the selection and combination behavior during planning, then build filters that work independently and together.

## Acceptance criteria

- [ ] The home page includes accessible department and location filters using values from the existing job postings.
- [ ] Filtering uses helpers in `src/lib/` that operate on `Job[]` arrays.
- [ ] Candidates can filter by department, by location, or by both, following the behavior agreed during planning.
- [ ] Candidates can reset the filters to restore the full roles list.
- [ ] Empty states are clear when no roles match.
- [ ] Controls include stable `data-testid` attributes.
- [ ] Unit tests cover each filter, combined filtering, resets, and empty results.
- [ ] Playwright tests verify department and location filtering, combinations, resets, and empty results.
