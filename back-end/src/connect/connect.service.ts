import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PayloadAccessJwt } from '../common/modules/jwt.model';
import { WebsocketId } from '../common/entities/websocketId.entity';
import { Profile } from '../common/entities/profile.entity';
import { Socket } from 'socket.io';

@Injectable()
export class ConnectService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(WebsocketId)
    private websocketIdRepository: Repository<WebsocketId>,
    @InjectRepository(Profile)
    private profileRepository: Repository<Profile>,
  ) {}

  async authorization(soket: Socket, token: string) {
    try {
      if (token) {
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
          console.log('log3');
          const userProfile = await this.profileRepository.findOne(
            {
              user: userId,
            },
            { relations: ['profilesRooms'] },
          );
          userProfile.profilesRooms.forEach(({ id }) => {
            soket.join(id);
          });

          return { event: 'authorization', data: null };
        }
      }
    } catch (e) {
      console.log('lox2');
      console.log(e);
    }
  }

  disconnect(websocketId: string) {
    try {
      this.websocketIdRepository.delete({ websocketId });
    } catch (e) {}
  }
}
