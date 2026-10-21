# Add department pages

Candidates often browse by function. Add a prerendered page for each department that lists roles from that department using the existing role card.

## Acceptance criteria

- [ ] A dynamic department route uses `getStaticPaths()` and `prerender = true`.
- [ ] Each department page lists only roles for that department and reuses the role card component.
- [ ] Department names on role cards or metadata link to the matching department page.
- [ ] A pure helper returns roles for a department from a `Job[]` array.
- [ ] Unit tests cover the department helper.
- [ ] Playwright tests verify a department link and department page.
