import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { RoomService } from './room.service';
import { UseGuards } from '@nestjs/common';
import { WsConnectGuard } from '../common/guards/wsconnect.guard';
import { Server, Socket } from 'socket.io';
import { CreateRoomDto } from './dto/create-room.dto';

@WebSocketGateway()
@UseGuards(WsConnectGuard)
export class RoomGateway {
  constructor(private readonly roomService: RoomService) {}

  @WebSocketServer() server: Server;

  @SubscribeMessage('ROOM:CREATE')
  createRoom(
    @MessageBody() createRoomDto: CreateRoomDto,
    @ConnectedSocket() socket: Socket,
  ) {
    return this.roomService.createRoom(this.server, socket, createRoomDto);
  }

  @SubscribeMessage('ROOM:JOIN')
  joinRoom(@ConnectedSocket() socket: Socket, @MessageBody() roomId: string) {
    return this.roomService.joinRoom(socket, roomId);
  }

  @SubscribeMessage('ROOM:ADD-TO-LIST')
  addRoomToChatList(
    @ConnectedSocket() socket: Socket,
    @MessageBody() roomId: string,
  ) {
    return this.roomService.addRoomToChatList(socket, roomId);
  }

  @SubscribeMessage('ROOM:LEFT')
  lefRoom(@ConnectedSocket() socket: Socket, @MessageBody() id: string) {
    return this.roomService.leftRoom(socket, id);
  }

  @SubscribeMessage('ROOM:DELETE')
  deleteRoom(@ConnectedSocket() socket: Socket, @MessageBody() roomId: string) {
    return this.roomService.deleteRoom(socket, roomId);
  }
}
