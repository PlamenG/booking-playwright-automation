type RoomUI = {
    name: string;
    type: string;
    accessible: boolean;
    price: number;
    details: Partial<RoomDetailsUI>;
  }