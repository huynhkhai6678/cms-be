import {
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from '../auth/auth.service';

@WebSocketGateway({ cors: true })
export class NotificationGateway {
  @WebSocketServer()
  server: Server;

  constructor(private authService: AuthService) {}

  async handleConnection(client: Socket) {
    const token = client.handshake.auth.token;

    const userId = await this.authService.verifySocketToken(token);
    if (!userId) {
      client.disconnect();
      return;
    }
    client.join(userId);
  }

  sendToAll(event: string, payload: any) {
    this.server.emit(event, payload);
  }
}
