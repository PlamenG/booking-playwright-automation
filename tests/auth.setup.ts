import { test as setup, expect } from '@playwright/test';

const authFile = '.auth/admin-booking.json';

setup('authenticate', async ({ page, request }) => {
  await page.goto('/#/admin', { waitUntil: "load"});
  await page.locator('[data-target="#collapseBanner"] button').click();
  // Best practice is to setup this data as env var and access it trough the operating system - ex. process.env.ADMIN_USER
  // For the sake of the task to work out of the box without additional configuration the credentials are as plain text
  await page.getByTestId('username').fill('admin')
  await page.getByTestId('password').fill('password');
  await page.getByTestId('submit').click();
  await expect(await page.locator('.rowHeader p', {hasText: 'Room details'})).toBeVisible();
  await page.context().storageState({ path: authFile });
});