import { test as base } from '@playwright/test';
import AdminBookingPage from '../../lib/pages/admin-booking-page';

type PageObjects = {
  adminBookingPage: AdminBookingPage;
};

export const test = base.extend<PageObjects>({
  adminBookingPage: async ({ page }, use) => {await use(await new AdminBookingPage(page))},
})
export { expect } from '@playwright/test';