import { Module } from '@nestjs/common';
import { RoomService } from './room.service';
import { RoomGateway } from './room.gateway';
import { WsConnectGuard } from '../common/guards/wsconnect.guard';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WebsocketId } from '../common/entities/websocketId.entity';
import { Room } from '../common/entities/room.entity';
import { Profile } from '../common/entities/profile.entity';
import { ProfileRoom } from '../common/entities/room-profile.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([WebsocketId, Room, Profile, ProfileRoom]),
  ],
  providers: [RoomGateway, RoomService, WsConnectGuard],
})
export class RoomModule {}
