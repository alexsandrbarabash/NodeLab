import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { WsConnectGuard } from '../common/guards/wsconnect.guard';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WebsocketId } from '../common/entities/websocketId.entity';
import { Room } from '../common/entities/room.entity';
import { Message } from './entities/message.entity';
import { Profile } from '../common/entities/profile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([WebsocketId, Room, Message, Profile])],
  providers: [ChatGateway, ChatService, WsConnectGuard],
})
export class ChatModule {}
