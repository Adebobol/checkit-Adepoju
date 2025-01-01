import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';

@Controller()
export class OrderListener {
  @EventPattern('order_created')
  async handleOrderCreated(
    @Payload() data: { orderId: string; userId: string },
  ) {
    console.log('Order created event received:', data);

    // Example logic: Notify WebSocket gateway to create a chatroom
    const roomId = `order_${data.orderId}`;
    // Notify WebSocket clients here, e.g., emit a "chatroom_created" event
    console.log(`Chatroom created for room: ${roomId}`);
  }
}
