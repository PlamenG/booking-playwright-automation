import { Page } from 'playwright';

export default class AdminBookingPage {
  constructor(private readonly page: Page) {}
  // New room locators
  private readonly newRoomWrapper = this.page.locator('.row.room-form');
  private readonly newRoomnameInput = this.newRoomWrapper.getByTestId('roomName');
  private readonly newRoomTypeDropdownSelect = this.newRoomWrapper.locator('#type')
  private readonly newRoomAccessibleDropdownSelect = this.newRoomWrapper.locator('#accessible')
  private readonly newRoomPriceInput = this.newRoomWrapper.locator('#roomPrice');
  private readonly newRoomCreateButton = this.newRoomWrapper.locator('#createRoom');
  private readonly newRoomWifiCheckbox = this.newRoomWrapper.locator('#wifiCheckbox');
  private readonly newRoomTvCheckbox = this.newRoomWrapper.locator('#tvCheckbox');
  private readonly newRoomRadioCheckbox = this.newRoomWrapper.locator('#radioCheckbox');
  private readonly newRoomRefreshmentsCheckbox = this.newRoomWrapper.locator('#refreshCheckbox');
  private readonly newRoomSafeCheckbox = this.newRoomWrapper.locator('#safeCheckbox');
  private readonly newRoomViewsCheckbox = this.newRoomWrapper.locator('#viewsCheckbox');
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

  async setRoomType(roomType: RoomTypeUi){
    // As default option is expected to be Single no action is made to select it
    if(roomType !== 'Single' && roomType !== null){
      await this.newRoomTypeDropdownSelect.click();
      await this.newRoomTypeDropdownSelect.selectOption(roomType);
    }
  }

  async setRoomAccessible(isAccesible:boolean){
    if(isAccesible === true){
      await this.newRoomAccessibleDropdownSelect.click();
      await this.newRoomAccessibleDropdownSelect.selectOption('true');
    }
  }

  async setRoomDetails(details: Partial<RoomDetailsUI>){
    for (const [value] of Object.entries(details)) {
      await this.checkDetailOption(value);      
    }
  }

  async getRoomProperties(roomName:string){
    const name = await this.roomName(roomName).textContent();
    let type: RoomTypeUi = (await this.roomType(roomName).textContent()) as RoomTypeUi;
    const accessible:boolean = 'true' === (await this.isRoomAccessible(roomName).textContent());
    const price = Number(await this.roomPrice(roomName).textContent());
    const details = await this.parseRoomDetails(roomName);
    
    const roomDetails:RoomUI = 
    {
      name: name ? name : '',
      type: type,
      accessible: accessible,
      price: price,
      details: details
    }
    return roomDetails;
  }

  private async parseRoomDetails(roomName:string){
    const idAttribute = (await this.roomDetails(roomName).getAttribute("id"))?.toLowerCase();
    const actualDetails = idAttribute?.replace('details', '');
    const details = actualDetails ? actualDetails.split(',') : [];
    let parsedDetails: Partial<RoomDetailsUI> = {};
    if(details.length === 0){
      parsedDetails.none = "No features added to the room";
      return parsedDetails
    }
    details.forEach(detail => {
      if (detail === 'wifi') { parsedDetails.wifi = 'wifi' }
      if (detail === 'tv') { parsedDetails.tv = 'tv' }
      if (detail === 'radio') { parsedDetails.radio = 'radio' }
      if (detail === 'refreshments') { parsedDetails.refreshments = 'refreshments' }
      if (detail === 'safe') { parsedDetails.safe = 'safe' }
      if (detail === 'views') { parsedDetails.views = 'views' }
    })
    return parsedDetails;
  }

  private async checkDetailOption(option:string){
    switch (option) {
      case 'wifi':
        await this.newRoomWifiCheckbox.check();
        break;
      case 'tv':
        await this.newRoomTvCheckbox.check();
        break;
      case 'radio':
        await this.newRoomRadioCheckbox.check();
        break;
      case 'refreshments':
        await this.newRoomRefreshmentsCheckbox.check();
        break;
      case 'safe':
        await this.newRoomSafeCheckbox.check();
        break;
      case 'views':
        await this.newRoomViewsCheckbox.check();
        break;
      default:
        break;
    }
  }
}