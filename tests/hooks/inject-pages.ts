import { test as base } from '@playwright/test';
import AdminBookingPage from '../../lib/pages/home-page';
import NetworkPage from '../../lib/pages/network-page';

type PageObjects = {
  adminBookingPage: AdminBookingPage;
};

export const test = base.extend<PageObjects>({
  adminBookingPage: async ({ page }, use) => {await use(await new AdminBookingPage(page))},
})
export { expect } from '@playwright/test';