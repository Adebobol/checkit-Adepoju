import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatRoomService } from '../chatRoom.service';

@WebSocketGateway({ cors: true }) // Enable CORS if your frontend connects from a different origin
export class OrderGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private isInitialized = false;

  afterInit(server: Server) {
    this.server = server;
    console.log('WebSocket Gateway Initialized');
    this.isInitialized = true;
    console.log('WebSocket Gateway Initialized');
  }

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  chatRoomCreated(user: string, chatRoomId: number) {
    this.server.emit('chatroom created', `${user} created a chat room.`);
  }

  sendMessage(chatRoomId: number, sender: string, message: string) {
    this.server.emit(
      'send message',
      `${sender}:${message} in chatroom_${chatRoomId}`,
    );
  }
}
