import { test, expect } from '@playwright/test';

test.describe('Apply flow', () => {
    test('submits an application and shows a confirmation', async ({ page }) => {
        await page.goto('/');
        await page.getByTestId('role-card').first().click();

        await expect(page.getByTestId('apply-form')).toBeVisible();
        await page.getByTestId('apply-name').fill('Alex Doe');
        await page.getByTestId('apply-email').fill('alex@example.com');
        await page.getByTestId('apply-note').fill('Excited to help build accessible tools.');
        await page.getByTestId('apply-links').fill('https://example.com/portfolio');
        await page.getByTestId('apply-submit').click();

        await expect(page).toHaveURL(/\/thanks\/?$/);
        await expect(page.getByTestId('thanks')).toBeVisible();
        await expect(
            page.getByRole('heading', { name: 'Thanks for applying!' }),
        ).toBeVisible();
    });

    test('submits with only the required fields filled', async ({ page }) => {
        await page.goto('/');
        await page.getByTestId('role-card').first().click();
        await page.getByTestId('apply-name').fill('Sam Lee');
        await page.getByTestId('apply-email').fill('sam@example.com');
        await page.getByTestId('apply-submit').click();
        await expect(page).toHaveURL(/\/thanks\/?$/);
    });
});
