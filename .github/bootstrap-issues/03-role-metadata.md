# Show role metadata on detail pages

Role frontmatter already includes useful fields that are underused on the detail page. Surface employment type and remote status prominently so candidates can evaluate fit faster.

## Acceptance criteria

- [ ] The role detail page prominently shows the employment `type` from existing frontmatter.
- [ ] Remote roles show a clear **Remote** badge using existing frontmatter.
- [ ] Non-remote roles render gracefully without implying remote availability.
- [ ] Styling matches the Caldova dark theme and meets accessibility requirements.
- [ ] Metadata elements include stable `data-testid` attributes.
- [ ] Playwright verifies the metadata renders on a role detail page.
