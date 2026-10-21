import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { getDatabase } from '../../lib/db';
import { applicationSchema, createApplication } from '../../lib/applications';

// This is the only on-demand (server-rendered) route in the project. It needs
// the Node adapter to run because it reads the request body and writes to the
// database; every other route stays prerendered.
export const prerender = false;

export const POST: APIRoute = async ({ request, redirect }) => {
    const form = await request.formData();

    const parsed = applicationSchema.safeParse({
        jobId: form.get('jobId')?.toString() ?? '',
        name: form.get('name')?.toString() ?? '',
        email: form.get('email')?.toString() ?? '',
        note: form.get('note')?.toString() || undefined,
        links: form.get('links')?.toString() || undefined,
    });

    if (!parsed.success) {
        return redirect('/?error=invalid', 303);
    }

    // Validate the logical reference: the jobId must match a real posting.
    const jobs = await getCollection('jobs');
    const jobExists = jobs.some((job) => job.id === parsed.data.jobId);
    if (!jobExists) {
        return redirect('/?error=unknown-role', 303);
    }

    await createApplication(getDatabase(), parsed.data);

    return redirect('/thanks', 303);
};
