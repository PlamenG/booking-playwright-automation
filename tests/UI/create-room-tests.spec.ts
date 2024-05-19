import { test, expect } from '../hooks/inject-pages';
import { RoomsApi } from '../../lib/API/room-api';

test.describe('Create room page without any rooms prior', () => {

  test.beforeEach(async ({request }) => {
    console.log(`Running ${test.info().title}`);
    const roomsApi = new RoomsApi(request);
    await roomsApi.deleteAllExistingRooms();
    await roomsApi.checkRoomsCount(0);
  });

  const expectedRooms: RoomUI[] = [
    { name: 'first', type: 'Single', accessible: false, price: 1, details: {none: 'No features added to the room'}},
    { name: 'second', type: 'Double', accessible: true, price: 130, details: {tv: 'tv', wifi: 'wifi'} },
    { name: 'fourth', type: 'Family', accessible: true, price: 700, details: {tv: 'tv', wifi: 'wifi', radio: 'radio', refreshments: 'refreshments', views: 'views'} },
    { name: 'fifth', type: 'Twin', accessible: true, price: 50.5, details: {tv: 'tv', wifi: 'wifi', radio: 'radio', refreshments: 'refreshments'} },
    { name: 'sixth', type: 'Suite', accessible: true, price: 911, details: {tv: 'tv', wifi: 'wifi', radio: 'radio', refreshments: 'refreshments', views: 'views', safe: 'safe'} },
  ]
  for(const expecterRoom of expectedRooms){
    test(`Crerate new room with details ${JSON.stringify(expecterRoom)}`, async ({roomAdminPage}) => {
        await roomAdminPage.navigate();
        await roomAdminPage.typeName(expecterRoom.name);
        await roomAdminPage.setRoomType(expecterRoom.type);
        await roomAdminPage.setRoomAccessible(expecterRoom.accessible);
        await roomAdminPage.typePrice(expecterRoom.price.toString());
        await roomAdminPage.setRoomDetails(expecterRoom.details);
        await roomAdminPage.clickCreateButton();
        const createdRoom = await roomAdminPage.getRoomProperties(expecterRoom.name);
        expect(createdRoom.name, "Room names is not correct!").toBe(expecterRoom.name);
        expect(createdRoom.type, "Room type is not correct!").toBe(expecterRoom.type);
        expect(createdRoom.accessible, "Room accessible is not correct!").toBe(expecterRoom.accessible);
        expect(createdRoom.price, "Room price is not correct!").toBe(expecterRoom.price);
        expect(createdRoom.details, "Room detailse are not correct!").toEqual(expecterRoom.details);
    })
  }
});

test.describe('Adding a new room to existing rooms', () => {
  const roomsToGenerate = 10;
  let basicSeededRoom: RoomAPI = {
    accessible: true,
    features: [ 'Tv', 'Safe'],
    roomName: 'auto',
    roomPrice: 111,
    type: 'Double'
  }
  test.beforeEach(async ({request }) => {
    console.log(`Running ${test.info().title}`);
    const roomsApi = new RoomsApi(request);
    await roomsApi.deleteAllExistingRooms();
    await roomsApi.deleteAllExistingRooms();
    await roomsApi.createRooms(basicSeededRoom, roomsToGenerate)
  })

  const expectedRooms: RoomUI[] = [
    { name: 'first', type: 'Single', accessible: false, price: 1, details: {none: 'No features added to the room'}},
    { name: 'second', type: 'Double', accessible: true, price: 99, details: {wifi: 'wifi'} },
    { name: 'fourth', type: 'Family', accessible: true, price: 555, details: {tv: 'tv', wifi: 'wifi', views: 'views', radio: 'radio', refreshments: 'refreshments'} },
    { name: 'fifth', type: 'Twin', accessible: true, price: 50.5, details: {wifi: 'wifi', radio: 'radio', refreshments: 'refreshments'} },
    { name: 'sixth', type: 'Suite', accessible: true, price: 999, details: {tv: 'tv', wifi: 'wifi', radio: 'radio', refreshments: 'refreshments', views: 'views', safe: 'safe'} },
 
  ]
  for(const expecterRoom of expectedRooms){
    test(`Add room with details ${JSON.stringify(expecterRoom)}`, async ({roomAdminPage}) => {
      await roomAdminPage.navigate();
      await roomAdminPage.typeName(expecterRoom.name);
      await roomAdminPage.setRoomType(expecterRoom.type);
      await roomAdminPage.setRoomAccessible(expecterRoom.accessible);
      await roomAdminPage.typePrice(expecterRoom.price.toString());
      await roomAdminPage.setRoomDetails(expecterRoom.details);
      await roomAdminPage.clickCreateButton();

      const createdRoom = await roomAdminPage.getRoomProperties(expecterRoom.name);
      expect(createdRoom.name, "Room names is not correct!").toBe(expecterRoom.name);
      expect(createdRoom.type, "Room type is not correct!").toBe(expecterRoom.type);
      expect(createdRoom.accessible, "Room accessible is not correct!").toBe(expecterRoom.accessible);
      expect(createdRoom.price, "Room price is not correct!").toBe(expecterRoom.price);
      expect(createdRoom.details, "Room detailse are not correct!").toEqual(expecterRoom.details);

      for (let index = 1; index <= roomsToGenerate; index++) {
        const expectedRoomName = `auto${index}`;
        const existingRoomProperties = await roomAdminPage.getRoomProperties(expectedRoomName);
        expect(existingRoomProperties.name, "Room names is not correct!").toBe(expectedRoomName);
        expect(existingRoomProperties.type, "Room type is not correct!").toBe(basicSeededRoom.type as RoomTypeUi);
        expect(existingRoomProperties.accessible, "Room accessible is not correct!").toBe(basicSeededRoom.accessible);
        expect(existingRoomProperties.price, "Room price is not correct!").toBe(basicSeededRoom.roomPrice);
        
        let createdRoomDetails: string[] = [];
        basicSeededRoom.features.forEach(feature => createdRoomDetails.push(feature.toLowerCase()));
        const expectedRoomDetails = await roomAdminPage.extractRoomDetails(createdRoomDetails)
        expect(existingRoomProperties.details, "Room detailse are not correct!").toEqual(expectedRoomDetails);
      }
    })
  }
})

test.describe('Delete an existing room from preconfigured list', () => {
  const roomsToGenerate = 15;
  let basicSeededRoom: RoomAPI = {
    accessible: true,
    features: [ 'Tv', 'Safe'],
    roomName: 'auto',
    roomPrice: 111,
    type: 'Double'
  }
  test.beforeEach(async ({request }) => {
    console.log(`Running ${test.info().title}`);
    const roomsApi = new RoomsApi(request);
    await roomsApi.deleteAllExistingRooms();
    await roomsApi.deleteAllExistingRooms();
    await roomsApi.createRooms(basicSeededRoom, roomsToGenerate)
  })

  const rooms= [
    'auto1',
    'auto7',
    'auto15',
  ]
  for(const deletedRoomName of rooms){
    test(`Delete room with name ${deletedRoomName}`, async ({roomAdminPage}) => {
      await roomAdminPage.navigate();
      await roomAdminPage.deleteRoom(deletedRoomName);
      for (let index = 1; index <= roomsToGenerate; index++) {
        const expectedRoomName = `auto${index}`;
        if (deletedRoomName !== expectedRoomName){
          const existingRoomProperties = await roomAdminPage.getRoomProperties(expectedRoomName);
          expect(existingRoomProperties.name, "Room names is not correct!").toBe(expectedRoomName);
          expect(existingRoomProperties.type, "Room type is not correct!").toBe(basicSeededRoom.type as RoomTypeUi);
          expect(existingRoomProperties.accessible, "Room accessible is not correct!").toBe(basicSeededRoom.accessible);
          expect(existingRoomProperties.price, "Room price is not correct!").toBe(basicSeededRoom.roomPrice);
          
          let currentRoomDetails: string[] = [];
          basicSeededRoom.features.forEach(feature => currentRoomDetails.push(feature.toLowerCase()));
          const expectedRoomDetails = await roomAdminPage.extractRoomDetails(currentRoomDetails)
          expect(existingRoomProperties.details, "Room detailse are not correct!").toEqual(expectedRoomDetails);
        };
      }
      await roomAdminPage.expectRoomToBeNotExisting(deletedRoomName);
    })
  }
})

