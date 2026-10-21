# Paginate roles
<!-- labels: workshop:pagination -->

Long role lists are easier to scan when candidates can move through manageable pages. Add pagination for the roles list while keeping navigation accessible.

## Acceptance criteria

- [ ] The roles list renders a configurable number of roles per page.
- [ ] Pagination helpers in `src/lib/` operate on plain `Job[]` data.
- [ ] Previous and next controls have accessible names, disabled states, and stable `data-testid` attributes.
- [ ] Pagination works with empty and single-page lists.
- [ ] Unit tests cover pagination helpers and edge cases.
- [ ] Playwright tests cover moving between pages.
