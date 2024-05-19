import { APIRequestContext } from "playwright";
import { expect } from "playwright/test";

export class RoomsApi {
    private request: APIRequestContext;
    private path = '/room';
  
    constructor(request: APIRequestContext) {
      this.request = request;
    }
    
    async checkRoomsCount(count: number) {
        const checkRooms = await this.request.get(this.path);
        const roomOnBackend = (await checkRooms.json()).rooms as RoomAPI[];
        expect(checkRooms.ok(), `Status code is: ${await checkRooms.status()}`).toBeTruthy();
        expect(roomOnBackend.length, "Existing rooms were not cleaned in beforeEach!").toBe(count);
    }

    async createRooms(roomData: RoomAPI, count: number){
        for (let index = 1; index <= count; index++) {
            roomData.roomName = `auto${index}`
            const body = roomData;
            const createRoom = await this.request.post(`${this.path}/`, {
              data: body
            })
            expect(await createRoom.ok(), `Status code is: ${await createRoom.status()}`).toBeTruthy();
            const actualRoom = (await createRoom.json());
            expect(actualRoom.roomName, `Room not created! Response body is: \n ${JSON.stringify(actualRoom)}`).toEqual(roomData.roomName);
        }
        const roomsApi = new RoomsApi(this.request);
        await roomsApi.checkRoomsCount(count)
    }

    async deleteAllExistingRooms(){
        const getRooms = await this.request.get(this.path)
        expect(getRooms.ok(), `Status code is: ${await getRooms.status()}`).toBeTruthy();
        
        const rooms = (await getRooms.json()).rooms as RoomAPI[];
        rooms.forEach(async (room) => {
            const deleteRoom = await this.request.delete(`${this.path}/${room.roomid}`)      
            expect(deleteRoom.ok(), `Status code is: ${await deleteRoom.status()}`).toBeTruthy();
        })
        await this.checkRoomsCount(0)
    }

  }