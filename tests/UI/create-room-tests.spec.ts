import { test, expect } from '../hooks/inject-pages';

test.describe('HomePage Tests', () => {

  test.beforeEach(async ({ adminBookingPage, request }) => {
    const roomEnpoint = '/room'

    console.log(`Running ${test.info().title}`);
    
    const getRooms = await request.get(roomEnpoint)
    expect(getRooms.ok(), `Status code is: ${await getRooms.status()}`).toBeTruthy();
    
    const rooms = (await getRooms.json()).rooms as Room[];
    rooms.forEach(async (room) => {
      const deleteRoom = await request.delete(`${roomEnpoint}/${room.roomid}`)      
      expect(deleteRoom.ok(), `Status code is: ${await deleteRoom.status()}`).toBeTruthy();
    })
    
    const checkRooms = await request.get(roomEnpoint);
    const roomOnBackend = (await checkRooms.json()).rooms as Room[];
    expect(checkRooms.ok(), `Status code is: ${await checkRooms.status()}`).toBeTruthy();
    expect(roomOnBackend.length, "Existing rooms were not cleaned in beforeEach!").toBe(0)
    await adminBookingPage.navigate();
  });

  const expectedRooms: RoomUI[] = [
    { name: 'first', type: 'Single', accessible: false, price: 1, details: {none: 'No features added to the room'}},
    { name: 'second', type: 'Double', accessible: true, price: 999, details: {tv: 'tv', wifi: 'wifi'} },
    { name: 'third', type: 'Family', accessible: true, price: 999, details: {tv: 'tv', wifi: 'wifi', radio: 'radio', refreshments: 'refreshments', views: 'views', safe: 'safe'} },
  ]
  for(const expecterRoom of expectedRooms){
    test(`Crerate new room with details ${JSON.stringify(expecterRoom)}`, async ({adminBookingPage}) => {
      await adminBookingPage.navigate()
      await adminBookingPage.typeName(expecterRoom.name); 
      await adminBookingPage.setRoomType(expecterRoom.type);
      await adminBookingPage.setRoomAccessible(expecterRoom.accessible);
      await adminBookingPage.typePrice(expecterRoom.price.toString());
      await adminBookingPage.setRoomDetails(expecterRoom.details);
      await adminBookingPage.clickCreateButton();
  
      const createdRoom = await adminBookingPage.getRoomProperties(expecterRoom.name)
      expect(createdRoom.name, "Room names is not correct!").toBe(expecterRoom.name);
      expect(createdRoom.type, "Room type is not correct!").toBe(expecterRoom.type);
      expect(createdRoom.accessible, "Room accessible is not correct!").toBe(expecterRoom.accessible);
      expect(createdRoom.price, "Room price is not correct!").toBe(expecterRoom.price);
      expect(createdRoom.details, "Room detailse are not correct!").toEqual(expecterRoom.details);
    })
  }
});
