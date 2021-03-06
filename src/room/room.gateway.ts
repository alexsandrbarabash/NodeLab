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
import { AddAnotherUserDto } from './dto/add-another-user.dto';

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
    return this.roomService.joinRoom(this.server, socket, roomId);
  }

  @SubscribeMessage('ROOM:ADD-ANOTHER-USER')
  addAnotherUser(
    @ConnectedSocket() socket: Socket,
    @MessageBody() addAnotherUserDto: AddAnotherUserDto,
  ) {
    return this.roomService.addAnotherUser(
      this.server,
      socket,
      addAnotherUserDto,
    );
  }

  @SubscribeMessage('ROOM:ADD-TO-LIST')
  addRoomToChatList(
    @ConnectedSocket() socket: Socket,
    @MessageBody() roomId: string,
  ) {
    return this.roomService.addRoomToChatList(socket, roomId);
  }

  @SubscribeMessage('ROOM:DELETE')
  deleteRoom(@ConnectedSocket() socket: Socket, @MessageBody() roomId: string) {
    return this.roomService.deleteRoom(this.server, socket, roomId);
  }
}
