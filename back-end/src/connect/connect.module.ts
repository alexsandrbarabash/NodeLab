import { Module } from '@nestjs/common';
import { ConnectGateway } from './connect.gateway';
import { ConnectService } from './connect.service';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WebsocketId } from '../common/entities/websocketId.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([WebsocketId]),
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.SECRET_KEY,
      }),
    }),
  ],
  providers: [ConnectGateway, ConnectService],
})
export class ConnectModule {}
