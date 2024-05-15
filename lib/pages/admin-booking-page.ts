import { Page } from 'playwright';

export default class AdminBookingPage {
  constructor(private readonly page: Page) {}
  private readonly newRoomWrapper = this.page.locator('.row.room-form');
  private readonly nameInput = this.newRoomWrapper.getByTestId('roomName');
  private readonly priceInput = this.newRoomWrapper.locator('#roomPrice');
  private readonly createButton = this.newRoomWrapper.getByRole("button", {name: "Create"})

  async navigate(){
    await this.page.goto('/#/admin', { waitUntil: "load"})
  }

  async typeName(name:string){
    await this.nameInput.fill(name);
  }

  async typePrice(price: string){
    await this.priceInput.fill(price);
  }

  async clickCreateButton(){
    await this.createButton.click();
  }
}
