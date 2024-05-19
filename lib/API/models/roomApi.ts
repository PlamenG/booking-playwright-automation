type RoomAPI =
{
    roomid?: number,
    roomName: string,
    type: string,
    accessible: boolean,
    image?: string,
    description?: string,
    features: string[],
    roomPrice: number
}