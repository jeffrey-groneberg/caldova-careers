# Search roles by title

Candidates need a fast way to narrow the open roles list when Caldova has many postings. Add a search box that filters role cards by title without requiring a page reload.

## Acceptance criteria

- [ ] The home page includes a labeled search input that filters roles by title case-insensitively.
- [ ] Clearing the search restores the full roles list.
- [ ] A helpful empty state appears when no roles match.
- [ ] Search controls and results are accessible and include stable `data-testid` attributes.
- [ ] Unit tests cover the filtering helper.
- [ ] Playwright tests cover searching and the empty state.
