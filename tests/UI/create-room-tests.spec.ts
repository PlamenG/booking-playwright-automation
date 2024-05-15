import { test, expect } from '../hooks/inject-pages';

test.describe('HomePage Tests', () => {

  test.beforeEach(async ({ adminBookingPage, request }) => {
    const roomEnpoint = '/room'

    console.log(`Running ${test.info().title}`);
    
    const getRooms = await request.get(roomEnpoint)
    expect(getRooms.ok(), `Status code is: ${await getRooms.status()}`).toBeTruthy();
    
    const rooms: [Room] = await getRooms.json();
    for (let index = 0; index < rooms.length; index++) {
      const room = rooms[index];
      const deleteRoom = await request.post(`${roomEnpoint}/${room.roomid}`)      
      expect(deleteRoom.ok(), `Status code is: ${await deleteRoom.status()}`).toBeTruthy();
    }
    await adminBookingPage.navigate();
  });

  test("Crerate new room", async ({adminBookingPage}) => {
    await adminBookingPage.navigate()
    await adminBookingPage.typeName('first');
    await adminBookingPage.typePrice('11');
    await adminBookingPage.clickCreateButton();
  })
});
