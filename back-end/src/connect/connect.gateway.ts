import {
  WebSocketGateway,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WsResponse,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { ConnectService } from './connect.service';

/**
 * This gateway use for connect and disconnect logic websocket server
 *
 * */

@WebSocketGateway()
export class ConnectGateway implements OnGatewayDisconnect {
  constructor(private connectService: ConnectService) {}

  @SubscribeMessage('authorization')
  authorization(
    @MessageBody() token: string,
    @ConnectedSocket() socket: Socket,
  ): Promise<WsResponse<null>> {
    return this.connectService.authorization(socket, token);
  }

  public handleDisconnect({ id }: Socket): void {
    this.connectService.disconnect(id);
  }
}
