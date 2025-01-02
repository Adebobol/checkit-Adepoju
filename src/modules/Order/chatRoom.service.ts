import { Injectable, Inject } from '@nestjs/common';
import { PrismaService } from '../prismaSrc/prisma.service';
import { UserService } from '../user/user.service';
import { OrderGateway } from './gateway/order-gatway';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';

@Injectable()
export class ChatRoomService {
  constructor(
    private readonly prisma: PrismaService,
    private gateway: OrderGateway,
  ) {}

  async createChatRoom(userId: number, orderId: number) {
    // Find the logged-in user
    const loggedInUser = await this.prisma.user.findFirst({
      where: { id: userId },
    });

    if (!loggedInUser) {
      throw new Error('User not logged in or does not exist.');
    }

    // Find the admin
    const admin = await this.prisma.user.findFirst({
      where: { role: 'ADMIN' },
    });

    if (!admin) {
      throw new Error('Admin user not found. Ensure the system has an admin.');
    }

    const chatRoom = await this.prisma.chatRoom.create({
      data: {
        orderId,
        participantId: userId,
        adminId: admin.id,
      },
    });

    if (!chatRoom) {
      throw new Error('Failed to create chat room.');
    }

    // if (this.gateway && this.gateway.chatRoomCreated) {
    //   this.gateway.chatRoomCreated(loggedInUser.name, chatRoom.id);
    // }

    return chatRoom;
  }

  async getChatRoom(userId: number, chatRoomId: number) {
    const loggedInUser = await this.prisma.user.findFirst({
      where: { id: userId },
    });

    if (!loggedInUser) {
      throw new Error("User isn't logged In ");
    }

    const chatRoom = await this.prisma.chatRoom.findFirst({
      where: { id: +chatRoomId },
    });

    if (!chatRoom) {
      throw new Error('Chat room not found');
    }

    if (
      loggedInUser.role !== 'ADMIN' &&
      loggedInUser.id !== chatRoom.participantId
    ) {
      throw new Error('Only participants can access chatroom');
    }

    return chatRoom;
  }

  async deleteChatRoom(userId: number, chatRoomId: number) {
    const chatRoom = await this.prisma.chatRoom.delete({
      where: { id: +chatRoomId },
    });

    if (!chatRoom) {
      throw new Error('Chatroom already deleted.');
    }
    return chatRoom;
  }

  async sendMessage(userId: number, chatRoomId: number, messageData) {
    const sender = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    const chatRoom = await this.prisma.chatRoom.findUnique({
      where: { id: +chatRoomId },
    });

    if (!chatRoom) {
      throw new Error("You can't send message. Chatroom doesn't exist.");
    }

    const order = await this.prisma.order.findFirst({
      where: { id: chatRoom.orderId },
    });

    if (!order) {
      throw new Error('Order does not exist.');
    }

    // Ensure user can only send messages in their own chat room
    if (order.ownerId !== userId && sender.role !== 'ADMIN') {
      throw new Error('You are not authorized to message in this chat room');
    }

    if (chatRoom.isClosed) {
      throw new Error("Chatroom closed can't send message.");
    }

    const { content } = messageData;

    if (!content) {
      throw new Error('Message content empty');
    }

    const message = await this.prisma.message.create({
      data: {
        content,
        userId: userId,
        chatRoomId: +chatRoomId,
      },
    });

    // this.gateway.sendMessage(chatRoom.id, sender.name, message.content);

    return message;
  }

  async getAllChatRoomMessages(userId: number, id: number) {
    const loggedInUser = await this.prisma.user.findFirst({
      where: { id: userId },
    });

    const chatRoom = await this.prisma.chatRoom.findUnique({
      where: {
        id: +id,
      },
      include: {
        messages: true,
      },
    });

    if (!chatRoom) {
      throw new Error("Chatroom doesn't exist.");
    }

    if (
      loggedInUser.id !== chatRoom.participantId &&
      loggedInUser.role !== 'ADMIN'
    ) {
      throw new Error('Only participants can access chatroom');
    }

    return chatRoom.messages;
  }

  async closeChatRoom(userId: number, chatRoomId: number, summary: string) {
    const loggedInUser = await this.prisma.user.findFirst({
      where: { id: userId },
    });

    let chatRoom = await this.prisma.chatRoom.findFirst({
      where: { id: +chatRoomId },
    });

    if (!chatRoom) {
      throw new Error('Chat room not found');
    }

    if (!loggedInUser || loggedInUser.role !== 'ADMIN') {
      throw new Error('Only admins can close chat rooms');
    }

    if (chatRoom.isClosed) {
      throw new Error('Chat room already closed');
    }

    chatRoom = await this.prisma.chatRoom.update({
      where: { id: +chatRoomId },
      data: {
        isClosed: true,
        summary: summary,
      },
    });

    const order = await this.prisma.order.update({
      where: { id: chatRoom.orderId },
      data: {
        status: 'PROCESSING',
      },
    });
    console.log(order);
    return chatRoom;
  }
}
