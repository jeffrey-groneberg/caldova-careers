# Add a high-contrast mode toggle
<!-- labels: workshop:accessibility -->

Some candidates find the default dark slate theme difficult to read because of insufficient contrast between text and background. Add a high-contrast mode that users can toggle on and off, and remember their choice across visits.

## Acceptance criteria

- [ ] A visible, keyboard-accessible control lets users toggle high-contrast mode on and off.
- [ ] High-contrast mode meets WCAG 2.1 AA contrast ratios for text and interactive elements.
- [ ] The user's preference persists across page reloads and navigation.
- [ ] The toggle has a clear accessible name and stable `data-testid` attributes.
- [ ] Playwright tests verify the toggle switches modes and that the preference persists.
