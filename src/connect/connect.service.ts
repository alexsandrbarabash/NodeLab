import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PayloadAccessJwt } from '../common/modules/jwt.model';
import { WebsocketId } from '../common/entities/websocketId.entity';
import { Profile } from '../common/entities/profile.entity';
import { Socket } from 'socket.io';
import { ProfileRoom } from '../common/entities/room-profile.entity';

@Injectable()
export class ConnectService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(WebsocketId)
    private websocketIdRepository: Repository<WebsocketId>,
    @InjectRepository(Profile)
    private profileRepository: Repository<Profile>,
    @InjectRepository(ProfileRoom)
    private profileRoomRepository: Repository<ProfileRoom>,
  ) {}

  async authorization(soket: Socket, token: string) {
    try {
      if (!token) {
        return;
      }

      const { userId } = this.jwtService.verify<PayloadAccessJwt>(token);
      const isAuthorized = await this.websocketIdRepository.findOne({
        websocketId: soket.id,
      });

      if (!isAuthorized) {
        const websocket = this.websocketIdRepository.create({
          websocketId: soket.id,
          userId,
        });

        await this.websocketIdRepository.save(websocket);

        soket.join(`${userId}`);

        const { id } = await this.profileRepository.findOne({
          userId,
        });

        const myRooms = await this.profileRoomRepository.find({
          where: { profileId: id },
          select: ['roomId'],
        });

        myRooms.forEach((item) => {
          soket.join(item.roomId);
        });

        return { event: 'authorization', data: null };
      }
    } catch (e) {
      console.log(e);
    }
  }

  disconnect(websocketId: string) {
    try {
      this.websocketIdRepository.delete({ websocketId });
    } catch (e) {}
  }
}
