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
    const roomOnBackend = (await checkRooms.json()).rooms as [Room];
    expect(checkRooms.ok(), `Status code is: ${await checkRooms.status()}`).toBeTruthy();
    expect(roomOnBackend.length).toBe(0)
    await adminBookingPage.navigate();
  });

  test("Crerate new room", async ({adminBookingPage}) => {
    const roomName = 'first';
    await adminBookingPage.navigate()
    await adminBookingPage.typeName(roomName);
    await adminBookingPage.typePrice('11');
    await adminBookingPage.clickCreateButton();

    const createdRoom = await adminBookingPage.getRoomDetails(roomName)
    expect(createdRoom.type).toBe('Single');
    expect(createdRoom.accessible).toBe(false);
    expect(createdRoom.price).toBe(11);
    expect(createdRoom.details).toBe('No features added to the room');
  })
});
