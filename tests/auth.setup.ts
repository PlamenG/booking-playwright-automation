import { test as setup, expect } from '@playwright/test';

const authFile = '.auth/admin-booking.json';

setup('authenticate', async ({ request }) => {
  // Send authentication request. Replace with your own.
  await request.post('https://automationintesting.online/auth/login', {
    form: {
      // Best practice is to setup this data as env var and access it trough the operating system - ex. process.env.ADMIN_USER
      // For the sake of the task to work out of the box without additional configuration the credentials are as plain text
      'user': 'admin',
      'password': 'password'
    }
  });
  await request.storageState({ path: authFile });
});