import { Injectable, Inject } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import {
  BadRequestError,
  UnauthorizedError,
} from 'src/ErrorHandler/customError';
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
      throw new UnauthorizedError(
        'Unauthorized: Please log in to create an order.',
      );
    }
    console.log(loggedInUser.role);
    if (loggedInUser.role == 'ADMIN') {
      throw new BadRequestError("Admin can't create order.");
    }

    if (!orderData.description || !orderData.quantity) {
      throw new BadRequestError(
        "Invalid order data. 'Description' and 'Quantity' are required.",
      );
    }

    const Data: Prisma.OrderCreateInput = {
      description: orderData.description,
      specifications: orderData.specifications || '',
      quantity: orderData.quantity,
      metadata: orderData.metadata || {},
      status: 'REVIEW',
      owner: {
        connect: { id: userId },
      },
    };

    const order = await this.prisma.order.create({
      data: Data,
    });

    if (!order) {
      throw new Error('Could not create order.');
    }

    const chatRoom = await this.chatRoomService.createChatRoom(
      userId,
      order.id,
    );

    if (!chatRoom) {
      throw new Error('Chat room not created create order again.');
    }

    const updateOrder = await this.prisma.order.update({
      where: { id: order.id },
      data: { chatRoomId: chatRoom.id },
      include: { chatRoom: true },
    });

    // this.orderGateway.chatRoomCreated(loggedInUser.name, chatRoom.id);

    return updateOrder;
  }

  async getOrder(userId: number, orderId: number) {
    if (!orderId) {
      throw new Error('Order ID is required');
    }

    const order = await this.prisma.order.findFirst({
      where: { id: +orderId },
    });

    if (!order) {
      throw new Error('Order not found');
    }

    if (order.ownerId !== userId) {
      throw new Error("You can't access order.");
    }

    return order;
  }

  async getAllOrder(userId: number) {
    const isAdmin = await this.prisma.user.findFirst({
      where: { id: userId },
    });

    if (!isAdmin || isAdmin.role !== 'ADMIN') {
      throw new Error("You don't have access to this route");
    }

    return await this.prisma.order.findMany();
  }

  async orderCompleted(userId: number, orderId: number) {
    const admin = await this.prisma.user.findFirst({ where: { id: userId } });

    console.log(admin.role);

    if (!admin && admin.role !== 'ADMIN') {
      throw new Error('Only admin can gain access.');
    }

    const order = await this.prisma.order.findFirst({
      where: { id: +orderId },
    });

    if (!order) {
      throw new Error('No order found');
    }

    if (order.status !== 'REVIEW') {
      throw new Error("Can't mark order completed. Order still in Review.");
    }
    return await this.prisma.order.update({
      where: { id: +orderId },
      data: { status: 'COMPLETED' },
    });
  }

  async deleteOrder(userId: number, orderId: number) {
    console.log(typeof orderId);
    let order;
    let loggedInUser;
    try {
      loggedInUser = await this.prisma.user.findFirst({
        where: { id: userId },
      });
      order = await this.prisma.order.delete({ where: { id: +orderId } });
    } catch (error) {
      throw new Error('No order found or deleted');
    }

    if (order.ownerId !== userId && loggedInUser.role !== 'ADMIN') {
      throw new Error("You can't delete this order.");
    }

    return { message: 'Order deleted' };
  }
}
