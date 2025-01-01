import { Injectable, Inject } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prismaSrc/prisma.service';
import { ChatRoomService } from './chatRoom.service';
import { OrderGateway } from './gateway/order-gatway';

@Injectable()
export class OrderService {
  constructor(
    private prisma: PrismaService,
    private chatRoomService: ChatRoomService,
    private orderGateway: OrderGateway,
  ) {}

  async createOrder(userId: number, orderData) {
    const loggedInUser = await this.prisma.user.findFirst({
      where: { id: userId },
    });

    if (!loggedInUser) {
      throw new Error("Can't create order. Login");
    }

    const Data: Prisma.OrderCreateInput = {
      description: orderData.description,
      specifications: orderData.specifications,
      quantity: orderData.quantity,
      metadata: orderData.metadata,
      status: 'REVIEW',
      owner: {
        connect: { id: userId },
      },
    };

    const order = await this.prisma.order.create({
      data: Data,
    });

    if (!order) {
      throw new Error('Order not created');
    }

    const chatRoom = await this.chatRoomService.createChatRoom(
      userId,
      order.id,
    );

    if (!chatRoom) {
      throw new Error('Chat room not created');
    }

    const updateOrder = await this.prisma.order.update({
      where: { id: order.id },
      data: { chatRoomId: chatRoom.id },
    });

    // this.orderGateway.chatRoomCreated(loggedInUser.name, chatRoom.id);

    return updateOrder;
  }

  async getOrder(userId: number, orderId: number) {
    if (!orderId) {
      throw new Error('Order ID is required');
    }

    const order = this.prisma.order.findFirst({ where: { id: +orderId } });

    if ((await order).ownerId !== userId) {
      throw new Error("You can't access order.");
    }

    return order;
  }

  async getAllOrder(userId: number) {
    const isAdmin = await this.prisma.user.findFirst({ where: { id: userId } });

    if (!isAdmin && isAdmin.role !== 'ADMIN') {
      throw new Error("You don't have access to this route");
    }

    return await this.prisma.order.findMany();
  }

  async orderCompleted(userId: number, orderId: number) {
    const admin = this.prisma.user.findFirst({ where: { id: userId } });

    const order = await this.prisma.order.findFirst({
      where: { id: +orderId },
    });

    if (!admin && (await admin).role !== 'ADMIN') {
      throw new Error("Can't mark order completed.");
    }

    if (!order) {
      throw new Error('No order found');
    }

    if (order.status !== 'REVIEW') {
      throw new Error("Can't mark order completed.");
    }
    return await this.prisma.order.update({
      where: { id: +orderId },
      data: { status: 'COMPLETED' },
    });
  }

  async deleteOrder(userId: number, orderId: number) {
    const order = await this.prisma.order.delete({ where: { id: +orderId } });

    if (!order) {
      throw new Error('No order found');
    }

    if ((await order).ownerId !== userId) {
      throw new Error("You can't access order.");
    }

    // return { message: 'Order deleted' };
    return null;
  }
}
