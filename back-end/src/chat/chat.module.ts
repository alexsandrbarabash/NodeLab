import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { WsConnectGuard } from '../common/guards/wsconnect.guard';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WebsocketId } from '../common/entities/websocketId.entity';

@Module({
  imports: [TypeOrmModule.forFeature([WebsocketId])],
  providers: [ChatGateway, ChatService, WsConnectGuard],
})
export class ChatModule {}
