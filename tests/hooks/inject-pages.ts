import { test as base } from '@playwright/test';
import RoomAdminPage from '../../lib/pages/room-admin-page';

type PageObjects = {
  roomAdminPage: RoomAdminPage;
};

export const test = base.extend<PageObjects>({
  roomAdminPage: async ({ page }, use) => {await use(await new RoomAdminPage(page))},
})
export { expect } from '@playwright/test';