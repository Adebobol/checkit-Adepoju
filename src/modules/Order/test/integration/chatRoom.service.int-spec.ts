import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { PrismaService } from 'src/modules/prismaSrc/prisma.service';
import { UserService } from 'src/modules/user/user.service';
import { ChatRoomService } from '../../chatRoom.service';
import { OrderService } from '../../order.service';

describe('ChatRoom Servive Int', () => {
  it.todo('Ensure all pass!!!!!!!!');

  let prisma: PrismaService;
  let userService: UserService;
  let chatRoomService: ChatRoomService;
  let orderService: OrderService;
  let adminId: number;
  let userId: number;
  let orderId: number;
  let chatRoomId: number;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    prisma = moduleRef.get(PrismaService);
    userService = moduleRef.get(UserService);
    orderService = moduleRef.get(OrderService);
    chatRoomService = moduleRef.get(ChatRoomService);
    await prisma.cleanDatabase();
  });

  describe('createChatRoom()', () => {
    it('should create user and admin', async () => {
      const user = await prisma.user.create({
        data: {
          name: 'test',
          email: 'test@email.com',
          password: '1234',
          role: 'USER',
        },
      });
      const admin = await prisma.user.create({
        data: {
          name: 'admin',
          email: 'admin@email.com',
          password: '1234',
          role: 'ADMIN',
        },
      });
      adminId = admin.id;
      userId = user.id;
    });
    const orderData = {
      description: 'Product description',
      specifications: 'Product specification',
      quantity: 7,
      metadata: {
        color: 'RED',
        size: 'F',
      },
      status: 'REVIEW',
      owner: {
        connect: { id: undefined },
      },
    };
    it('should create an order', async () => {
      const order = await orderService.createOrder(userId, orderData);
      chatRoomId = order.chatRoomId;
      orderId = order.id;
    });
  });

  describe('getChatRoom()', () => {
    it('should get a classroom', async () => {
      const chatRoom = await chatRoomService.getChatRoom(userId, chatRoomId);
    });
  });

  describe('sendMessage()', () => {
    it('should send message after chatroom opens', async () => {
      const messageData = {
        content: 'hi',
      };
      await chatRoomService.sendMessage(userId, chatRoomId, messageData);
    });
  });

  describe('getAllChatRoomMessages()', () => {
    it('should send all messages of a chatroom', async () => {
      await chatRoomService.getAllChatRoomMessages(userId, chatRoomId);
    });
  });

  describe('deletechatRoom()', () => {
    it('should get a chatroom', async () => {
      const chatRoom = await chatRoomService.deleteChatRoom(userId, chatRoomId);
    });
  });
});
