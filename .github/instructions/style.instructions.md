---
description: 'Styling conventions for Caldova Careers'
applyTo: '**/*.{astro,css}'
---

# Styling conventions

Caldova Careers uses Tailwind CSS v4 through `@tailwindcss/vite`. Global styles live in `src/styles/global.css` with `@import "tailwindcss";`; do not add a Tailwind config file unless the project explicitly needs one.

## Theme

Use a dark slate interface with Caldova brand accents: Navy `#16234B`, Royal `#2E6CFC`, and Ice `#F4F7FC`. Prefer slate surfaces, clear borders, and the Royal blue accent for calls to action, focus states, badges, and key metrics.

## Patterns

Keep layout primitives simple and responsive. Use semantic sections, cards for roles, consistent spacing, rounded corners, and subtle borders/shadows. Keep component styling close to the component unless a reusable global style is needed.

## Accessibility

Every interactive element needs a visible focus ring. On dark cards, small muted text must meet 4.5:1 contrast; use `text-slate-400` rather than `text-slate-500` on `bg-slate-800` cards. Do not communicate remote status, employment type, or validation errors by color alone.

## Responsive behavior

Design mobile-first. Role cards, filters, and application fields should stack cleanly on small screens and expand into columns only when there is enough space.
