import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

// Derive the expected posting count from the job content collection so this
// assertion stays correct as roles are added or removed.
const jobsDir = fileURLToPath(new URL('../src/content/jobs', import.meta.url));
const expectedRoleCount = readdirSync(jobsDir).filter((f) => f.endsWith('.md')).length;

test.describe('Open roles listing', () => {
    test('shows the roles grid with all postings', async ({ page }) => {
        await page.goto('/');
        await expect(page.getByRole('heading', { name: 'Open roles' })).toBeVisible();

        const grid = page.getByTestId('roles-grid');
        await expect(grid).toBeVisible();
        await expect(page.getByTestId('role-card')).toHaveCount(expectedRoleCount);
    });

    test('links through to a role detail page', async ({ page }) => {
        await page.goto('/');
        const firstCard = page.getByTestId('role-card').first();
        const title = await firstCard.getByTestId('role-title').textContent();
        await firstCard.click();
        await expect(page.getByTestId('role-detail-title')).toHaveText(title!.trim());
        await expect(page.getByTestId('apply-form')).toBeVisible();
    });

    for (const { title, location } of [
        { title: 'Senior Frontend Engineer', location: 'Remote (US & Canada)' },
        { title: 'Financial Analyst', location: 'Woodinville, WA, USA' },
    ]) {
        test(`shows ${title} location on its card and detail page`, async ({ page }) => {
            await page.goto('/');
            const card = page.getByTestId('role-card').filter({
                has: page.getByRole('heading', { name: title, exact: true }),
            });

            await expect(card).toBeVisible();
            await expect(card.getByTestId('role-location')).toHaveText(location);
            await expect(card.getByTestId('role-location')).toBeVisible();
            await card.click();
            await expect(page.getByText(location, { exact: true })).toBeVisible();
        });
    }

    test('has no automatically detectable accessibility violations', async ({ page }) => {
        await page.goto('/');
        const results = await new AxeBuilder({ page })
            .withTags(['wcag2a', 'wcag2aa'])
            .analyze();
        expect(results.violations).toEqual([]);
    });
});

/**
 * Exercises client-side filtering against the built site, including independent clears,
 * incompatible combinations, keyboard focus, and preservation of the initial card order.
 */
test.describe('Role filters', () => {
  test('offers all unique alphabetized posting values with accessible defaults', async ({ page }) => {
    await page.goto('/');
    const department = page.getByRole('combobox', { name: 'Department', exact: true });
    const location = page.getByRole('combobox', { name: 'Location', exact: true });
    const departments = [...new Set(await page.getByTestId('role-department').allTextContents())]
      .sort((a, b) => a.localeCompare(b, 'en'));
    const locations = [...new Set(await page.getByTestId('role-location').allTextContents())]
      .sort((a, b) => a.localeCompare(b, 'en'));

    await expect(department).toBeVisible();
    await expect(location).toBeVisible();
    await expect(department).toHaveValue('');
    await expect(location).toHaveValue('');
    await expect(department.locator('option')).toHaveText(['All departments', ...departments]);
    await expect(location.locator('option')).toHaveText(['All locations', ...locations]);
    await expect(page.getByRole('status')).toHaveText(`Showing ${expectedRoleCount} roles`);
  });

  test('filters independently by department and by full location while preserving order', async ({ page }) => {
    await page.goto('/');
    const department = page.getByTestId('department-filter');
    const location = page.getByTestId('location-filter');
    const visibleCards = page.getByTestId('role-card').filter({ visible: true });
    const originalTitles = await page.getByTestId('role-title').allTextContents();
    const technologyTitles = ['Senior Frontend Engineer', 'Data Platform Engineer'];

    await test.step('Department alone', async () => {
      await department.selectOption('Technology');
      await expect(location).toHaveValue('');
      await expect(visibleCards).toHaveCount(2);
      await expect(visibleCards.getByTestId('role-title'))
        .toHaveText(originalTitles.filter((title) => technologyTitles.includes(title.trim())));
      await expect(visibleCards.getByTestId('role-department')).toHaveText(['Technology', 'Technology']);
      await expect(page.getByTestId('roles-count')).toHaveText('Showing 2 roles');
    });

    await test.step('Location alone', async () => {
      await department.selectOption('');
      await location.selectOption('Woodinville, WA, USA');
      await expect(visibleCards).toHaveCount(3);
      await expect(visibleCards.getByTestId('role-location')).toHaveText([
        'Woodinville, WA, USA', 'Woodinville, WA, USA', 'Woodinville, WA, USA',
      ]);
      for (const title of ['Financial Analyst', 'Regulatory Compliance Specialist', 'Procurement Analyst']) {
        await expect(visibleCards.getByRole('heading', { name: title, exact: true })).toBeVisible();
      }
    });
  });

  test('combines filters with AND and can change or clear either selection independently', async ({ page }) => {
    await page.goto('/');
    const department = page.getByTestId('department-filter');
    const location = page.getByTestId('location-filter');
    const visibleCards = page.getByTestId('role-card').filter({ visible: true });

    await department.selectOption('Finance');
    await location.selectOption('Woodinville, WA, USA');
    await expect(visibleCards.getByTestId('role-title')).toHaveText(['Financial Analyst']);
    await expect(page.getByTestId('roles-count')).toHaveText('Showing 1 role');

    await location.selectOption('Helsinki, Finland');
    await expect(department).toHaveValue('Finance');
    await expect(visibleCards.getByTestId('role-title')).toHaveText(['Financial Reconciliation Specialist']);

    await location.selectOption('Woodinville, WA, USA');
    await department.selectOption('Compliance');
    await expect(location).toHaveValue('Woodinville, WA, USA');
    await expect(visibleCards.getByTestId('role-title')).toHaveText(['Regulatory Compliance Specialist']);

    await department.selectOption('');
    await expect(location).toHaveValue('Woodinville, WA, USA');
    await expect(visibleCards).toHaveCount(3);

    await department.selectOption('Finance');
    await location.selectOption('');
    await expect(department).toHaveValue('Finance');
    await expect(visibleCards).toHaveCount(2);
    await expect(visibleCards.getByTestId('role-department')).toHaveText(['Finance', 'Finance']);

    await page.getByTestId('reset-filters').click();
    await expect(department).toHaveValue('');
    await expect(location).toHaveValue('');
    await expect(visibleCards).toHaveCount(expectedRoleCount);
    await expect(page.getByTestId('empty-state')).toBeHidden();
  });

  test('keeps all options for empty combinations and resets to the complete ordered list', async ({ page }) => {
    await page.goto('/');
    const department = page.getByTestId('department-filter');
    const location = page.getByTestId('location-filter');
    const originalDepartments = await department.locator('option').allTextContents();
    const originalLocations = await location.locator('option').allTextContents();
    const originalTitles = await page.getByTestId('role-title').allTextContents();
    const visibleCards = page.getByTestId('role-card').filter({ visible: true });

    await department.selectOption('Technology');
    await location.selectOption('Woodinville, WA, USA');
    await expect(visibleCards).toHaveCount(0);
    await expect(page.getByTestId('roles-grid')).toBeHidden();
    await expect(page.getByTestId('empty-state-text'))
      .toHaveText('No roles match these filters. Try changing or resetting your filters.');
    await expect(page.getByRole('status')).toHaveText('Showing 0 roles');
    await expect(department.locator('option')).toHaveText(originalDepartments);
    await expect(location.locator('option')).toHaveText(originalLocations);
    expect(await department.locator('option:disabled').count()).toBe(0);
    expect(await location.locator('option:disabled').count()).toBe(0);
    const accessibility = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
    expect(accessibility.violations).toEqual([]);

    await page.getByRole('button', { name: 'Reset filters' }).click();
    await expect(department).toHaveValue('');
    await expect(location).toHaveValue('');
    await expect(visibleCards).toHaveCount(expectedRoleCount);
    await expect(visibleCards.getByTestId('role-title')).toHaveText(originalTitles);
    await expect(page.getByTestId('empty-state')).toBeHidden();
    await expect(page.getByRole('status')).toHaveText(`Showing ${expectedRoleCount} roles`);

    await department.selectOption('Technology');
    await page.reload();
    await expect(department).toHaveValue('');
    await expect(location).toHaveValue('');
    await expect(visibleCards).toHaveCount(expectedRoleCount);
    await expect(page).toHaveURL('/');
  });

  test('supports keyboard filtering and reset on a narrow screen without focusing hidden cards', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    const department = page.getByRole('combobox', { name: 'Department', exact: true });
    const location = page.getByRole('combobox', { name: 'Location', exact: true });
    const reset = page.getByRole('button', { name: 'Reset filters' });

    await department.focus();
    await page.keyboard.press('End');
    await expect(department).toHaveValue('Technology');
    await expect(department).toBeFocused();
    await expect(page.getByTestId('roles-count')).toHaveText('Showing 2 roles');
    const focusShadow = await department.evaluate((element) => getComputedStyle(element).boxShadow);
    expect(focusShadow).not.toBe('none');
    await page.keyboard.press('Tab');
    await expect(location).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(reset).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(page.getByTestId('role-card').filter({ visible: true }).first()).toBeFocused();

    await reset.focus();
    await page.keyboard.press('Enter');
    await expect(reset).toBeFocused();
    await expect(department).toHaveValue('');
    await expect(page.getByTestId('role-card').filter({ visible: true })).toHaveCount(expectedRoleCount);
    const bounds = await page.locator('#department-filter, #location-filter').evaluateAll((elements) =>
      elements.map((element) => {
        const { top, bottom } = element.getBoundingClientRect();
        return { top, bottom };
      }),
    );
    expect(bounds[1].top).toBeGreaterThan(bounds[0].bottom);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  });
});

/**
 * Verifies progressive enhancement leaves role navigation usable when the browser
 * cannot initialize the filtering controls.
 */
test.describe('Listing without JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  test('retains all roles and usable detail links without inert filter controls', async ({ page }) => {
    await page.goto('/');
    const cards = page.getByTestId('role-card').filter({ visible: true });
    await expect(cards).toHaveCount(expectedRoleCount);
    await expect(page.getByTestId('department-filter')).toBeHidden();
    await expect(page.getByTestId('location-filter')).toBeHidden();
    await expect(page.getByTestId('reset-filters')).toBeHidden();
    const title = await cards.first().getByTestId('role-title').textContent();
    await cards.first().click();
    await expect(page.getByTestId('role-detail-title')).toHaveText(title!.trim());
  });
});
