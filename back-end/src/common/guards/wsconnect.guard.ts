import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WebsocketId } from '../entities/websocketId.entity';
import { Repository } from 'typeorm';

@Injectable()
export class WsConnectGuard implements CanActivate {
  constructor(
    @InjectRepository(WebsocketId)
    private websocketIdRepository: Repository<WebsocketId>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const wsId = await this.websocketIdRepository.findOne({
      websocketId: context.switchToWs().getClient().id,
    });

    if (wsId) {
      return true;
    } else {
      return false;
    }
  }
}
