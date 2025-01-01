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

  // Emit order created event
  sendOrderCreatedMessage(order: any) {
    if (!this.server) {
      console.error('WebSocket server is not initialized');
      setTimeout(() => {
        this.sendOrderCreatedMessage(order); // Retry after 1 second
      }, 1000);
      return;
    }
    console.log('Emitting orderCreated message:', order);
    this.server.emit('orderCreated', order); // Broadcast to all connected clients
  }

  sendMessage(chatRoomId: number, sender: string, message: string) {
    this.server.emit('sent message', `${sender}:${message}`);
  }
}
