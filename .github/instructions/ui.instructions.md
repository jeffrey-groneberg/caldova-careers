# Caldova Careers UI strategy

Use this guidance when creating or changing components, pages, and user flows in Caldova Careers.

## Design consistency

Keep the interface professional, calm, and career-focused. Use the dark slate Caldova theme with Royal blue accents for primary actions and important state. Prefer reusable components over one-off page markup.

## Reusability

Put shared UI in `src/components/`. Role cards, tags, empty states, headers, and form controls should accept data through props and avoid fetching data themselves.

## Accessibility

Use native HTML first: links for navigation, buttons for actions, labels for inputs, and headings that describe page structure. Ensure focus states are visible and validation messages are connected to the relevant fields.

## Testability

Add stable `data-testid` attributes to repeated or workflow-critical elements. Good examples include `role-card`, `role-detail`, `apply-form`, `apply-submit`, `role-search`, `role-sort`, `department-filter`, and `pagination-next`.

## Role examples

Role cards should communicate title, department, employment type, remote status, and summary without requiring hover. Location is already shown on role detail pages; adding it to cards is the workshop warm-up exercise. Apply forms should be simple and clear about which fields are required (name and email) versus optional.
