import { test, expect } from '@playwright/test';
test('navbar contains UIF Tool link', async ({ page }) => {
  await page.goto('https://scend.co.za', { waitUntil: 'networkidle' });
  const link = page.locator('nav[aria-label="Primary"] a', { hasText: 'UIF Tool' });
  await expect(link).toHaveCount(1);
});