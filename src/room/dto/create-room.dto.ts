import { TypeRoom } from '../room.service';

export class CreateRoomDto {
  readonly title: string;
  readonly typeRoom: TypeRoom.CHAT;
}