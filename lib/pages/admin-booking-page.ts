import { Page } from 'playwright';

export default class AdminBookingPage {
  constructor(private readonly page: Page) {}
  // New room locators
  private readonly newRoomWrapper = this.page.locator('.row.room-form');
  private readonly newRoomnameInput = this.newRoomWrapper.getByTestId('roomName');
  private readonly newRoomTypeDropdownSelect = this.newRoomWrapper.locator('#type')
  private readonly newRoomPriceInput = this.newRoomWrapper.locator('#roomPrice');
  private readonly newRoomCreateButton = this.newRoomWrapper.getByRole("button", {name: "Create"})
  // Existing room locators
  private readonly existingRoomWrapper = (roomName:string) => this.page.getByTestId('roomlisting').filter({has: this.page.locator(`#roomName${roomName}`)});
  private readonly roomName = (roomName:string) => this.page.locator(`#roomName${roomName}`);
  private readonly roomType = (roomName:string) =>  this.existingRoomWrapper(roomName).locator('p[id*="type"]');
  private readonly isRoomAccessible = (roomName:string) =>  this.existingRoomWrapper(roomName).locator('p[id*="accessible"]');
  private readonly roomPrice = (roomName:string) =>  this.existingRoomWrapper(roomName).locator('p[id*="roomPrice"]');
  private readonly roomDetails = (roomName:string) =>  this.existingRoomWrapper(roomName).locator('p[id*="details"]');
  private readonly deleteRoomButton = (roomName:string) =>  this.existingRoomWrapper(roomName).locator('span.roomDelete');

  async navigate(){
    await this.page.goto('/#/admin', { waitUntil: "load"})
  }

  async typeName(name:string | ''){
    await this.newRoomnameInput.fill(name);
  }

  async typePrice(price: string){
    await this.newRoomPriceInput.fill(price);
  }

  async clickCreateButton(){
    await this.newRoomCreateButton.click();
  }

  async setRoomType(roomType: string){
    if(roomType != 'Single'){
      await this.newRoomTypeDropdownSelect.click();
      await this.newRoomTypeDropdownSelect.selectOption(roomType);
    }
  }

  async getRoomDetails(roomName:string){
    const name = await this.roomName(roomName).textContent();
    const type = await this.roomType(roomName).textContent();
    const accessible:boolean = 'true' === (await this.isRoomAccessible(roomName).textContent());
    const price = Number(await this.roomPrice(roomName).textContent());
    const details = await this.roomDetails(roomName).textContent();
    
    const roomDetails:RoomUI = 
    {
      name: name ? name : '',
      type: type ? type : '',
      accessible: accessible,
      price: price,
      details: details
    }
    return roomDetails;
  }
}
