import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
} from '@nestjs/websockets';
import { MessageService } from './message.service';
import { UseGuards } from '@nestjs/common';
import { WsConnectGuard } from '../common/guards/wsconnect.guard';
import { CreateMessageDto } from './dto/create-message.dto';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
@UseGuards(WsConnectGuard)
export class MessageGateway {
  constructor(private readonly messageService: MessageService) {}

  @WebSocketServer() server: Server;

  @SubscribeMessage('MESSAGE:CREATE')
  create(
    @ConnectedSocket() socket: Socket,
    @MessageBody() createMessageDto: CreateMessageDto,
  ) {
    return this.messageService.create(this.server, createMessageDto);
  }
}
