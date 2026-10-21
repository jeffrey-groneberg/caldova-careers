import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Job postings are Markdown files with frontmatter, loaded from
// `src/content/jobs/`. The entry `id` (derived from the filename) is the
// stable slug used in URLs and as the logical `jobId` on applications.
const jobs = defineCollection({
    loader: glob({ pattern: '**/*.md', base: './src/content/jobs' }),
    schema: z.object({
        title: z.string(),
        department: z.string(),
        location: z.string(),
        // Employment type shown as a facet and on the detail page.
        type: z.enum(['Full-time', 'Part-time', 'Contract']),
        remote: z.boolean().default(false),
        postedDate: z.string(),
        summary: z.string(),
    }),
});

export const collections = { jobs };
