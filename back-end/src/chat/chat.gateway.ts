import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { SendMessageDto } from './dto/send-message.dto';
import { UseGuards } from '@nestjs/common';
import { WsConnectGuard } from '../common/guards/wsconnect.guard';
import { Server, Socket } from 'socket.io';
import { CreateRoomDto } from './dto/create-room.dto';

@WebSocketGateway()
@UseGuards(WsConnectGuard)
export class ChatGateway {
  constructor(private readonly chatService: ChatService) {}

  @WebSocketServer() server: Server;

  @SubscribeMessage('MESSAGE:SEND')
  saveMessage(@MessageBody() sendMessageDto: SendMessageDto) {
    return this.chatService.saveMessage(sendMessageDto);
  }

  @SubscribeMessage('ROOM:CREATE')
  createRoom(
    @MessageBody() createRoomDto: CreateRoomDto,
    @ConnectedSocket() socket: Socket,
  ) {
    return this.chatService.createRoom(this.server, socket, createRoomDto);
  }

  @SubscribeMessage('ROOM:JOIN')
  joinRoom(@ConnectedSocket() socket: Socket, @MessageBody() roomId: string) {
    return this.chatService.joinRoom(this.server, socket, roomId);
  }

  @SubscribeMessage('ROOM:ADD-TO-LIST')
  addRoomToChatList(@ConnectedSocket() socket: Socket, @MessageBody() roomId: string) {
    return this.chatService.addRoomToChatList(socket, roomId);
  }

  @SubscribeMessage('ROOM:LEFT')
  lefRoom(@MessageBody() sendMessageDto: SendMessageDto) {
    return this.chatService.saveMessage(sendMessageDto);
  }

  @SubscribeMessage('DELETE:ROOM')
  deletRoom(@ConnectedSocket() socket: Socket, roomId: string) {}

  // @SubscribeMessage('create-room')
  // createRoom(@MessageBody() sendMessageDto: SendMessageDto) {
  //   console.log('live');
  //   return this.chatService.saveMessage(sendMessageDto);
  // }
  // @SubscribeMessage('findAllChat')
  // findAll() {
  //   return this.chatService.findAll();
  // }
  //
  // @SubscribeMessage('findOneChat')
  // findOne(@MessageBody() id: number) {
  //   return this.chatService.findOne(id);
  // }
  //
  // @SubscribeMessage('removeChat')
  // remove(@MessageBody() id: number) {
  //   return this.chatService.remove(id);
  // }
}
