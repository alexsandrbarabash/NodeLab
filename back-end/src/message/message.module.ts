import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageGateway } from './message.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Room } from '../common/entities/room.entity';
import { Profile } from '../common/entities/profile.entity';
import { Message } from './entities/message.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Room, Profile, Message])],
  providers: [MessageGateway, MessageService],
})
export class MessageModule {}
