import { Page } from 'playwright';

export default class AdminBookingPage {
  constructor(private readonly page: Page) {}

  async navigate(){
    await this.page.goto('/admin', { waitUntil: "load"})
  }
}
