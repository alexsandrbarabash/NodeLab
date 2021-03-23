import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PayloadAccessJwt } from '../common/modules/jwt.model';
import { WebsocketId } from '../common/entities/websocketId.entity';

@Injectable()
export class ConnectService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(WebsocketId)
    private websocketIdRepository: Repository<WebsocketId>,
  ) {}

  async authorization(token: string, websocketId: string) {
    try {
      if (token) {
        const { id } = this.jwtService.verify<PayloadAccessJwt>(token);
        const isAuthorized = await this.websocketIdRepository.findOne({
          websocketId,
        });
        if (!isAuthorized) {
          const websocket = this.websocketIdRepository.create({
            websocketId,
            user: id,
          });

          await this.websocketIdRepository.save(websocket);
          return { event: 'authorization', data: null };
        }
      }
    } catch (e) {}
  }

  disconnect(websocketId: string) {
    try {
      this.websocketIdRepository.delete({ websocketId });
    } catch (e) {}
  }
}
