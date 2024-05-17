type RoomUI = {
    name: string;
    type: RoomTypeUi;
    accessible: boolean;
    price: number;
    details: Partial<RoomDetailsUI>;
  }