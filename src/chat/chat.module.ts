import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Room } from '../common/entities/room.entity';
import { Message } from '../common/entities/message.entity';
import { ProfileRoom } from '../common/entities/room-profile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Room, Message, ProfileRoom])],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
