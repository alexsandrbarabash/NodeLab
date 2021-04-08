import { Module } from '@nestjs/common';
import { ConnectGateway } from './connect.gateway';
import { ConnectService } from './connect.service';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WebsocketId } from '../common/entities/websocketId.entity';
import { Profile } from '../common/entities/profile.entity';
import { ProfileRoom } from '../common/entities/room-profile.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([WebsocketId, Profile, ProfileRoom]),
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.SECRET_KEY,
      }),
    }),
  ],
  providers: [ConnectGateway, ConnectService],
})
export class ConnectModule {}
