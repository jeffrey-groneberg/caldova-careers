# Document and apply coding standards

Caldova Careers should model maintainable code for workshop learners. Add lightweight standards for comments, exported functions, and component props, then apply them to the existing codebase.

## Acceptance criteria

- [ ] Comments explain intent or constraints, not mechanics that are obvious from the code.
- [ ] Exported functions in `db/` and `src/lib/` have useful TSDoc.
- [ ] `.astro` components with props document their `Props` shape.
- [ ] The README links to the coding standards.
- [ ] Existing code is updated where it falls short of the standards.
- [ ] `npm run lint` passes.
