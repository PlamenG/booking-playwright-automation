import { Page } from 'playwright';

type RoomUI = {
  type: string | null;
  accessible: boolean;
  price: number;
  details: string | null;
}

export default class AdminBookingPage {
  constructor(private readonly page: Page) {}
  // New room locators
  private readonly newRoomWrapper = this.page.locator('.row.room-form');
  private readonly nameInput = this.newRoomWrapper.getByTestId('roomName');
  private readonly priceInput = this.newRoomWrapper.locator('#roomPrice');
  private readonly createButton = this.newRoomWrapper.getByRole("button", {name: "Create"})
  // Existing room locators
  private readonly existingRoomWrapper = (roomName:string) => this.page.getByTestId('roomlisting').filter({has: this.page.locator(`#roomName${roomName}`)});
  private readonly roomType = (roomName:string) =>  this.existingRoomWrapper(roomName).locator('#typeSingle');
  private readonly isRoomAccessible = (roomName:string) =>  this.existingRoomWrapper(roomName).locator('p[id*="accessible"]');
  private readonly roomPrice = (roomName:string) =>  this.existingRoomWrapper(roomName).locator('p[id*="roomPrice"]');
  private readonly roomDetails = (roomName:string) =>  this.existingRoomWrapper(roomName).locator('p[id*="details"]');
  private readonly deleteRoomButton = (roomName:string) =>  this.existingRoomWrapper(roomName).locator('span.roomDelete');

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

  async getRoomDetails(roomName:string){
    const room = await this.existingRoomWrapper(roomName).textContent();
    const type = await this.roomType(roomName).textContent();
    const accessible:boolean = 'true' === (await this.isRoomAccessible(roomName).textContent());
    const price = Number(await this.roomPrice(roomName).textContent());
    const details = await this.roomDetails(roomName).textContent();
    
    const roomDetails:RoomUI = 
    {
      type: type,
      accessible: accessible,
      price: price,
      details: details
    }
    return roomDetails;
  }
}
