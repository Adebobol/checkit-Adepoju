import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { PrismaService } from 'src/modules/prismaSrc/prisma.service';
import { OrderService } from '../../order.service';

describe('Order service Int', () => {
  let prisma: PrismaService;
  let orderService: OrderService;
  let userId: number;
  let orderId: number;
  let adminId: number;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    prisma = moduleRef.get(PrismaService);
    orderService = moduleRef.get(OrderService);
    await prisma.cleanDatabase();
  });

  describe('createOrder()', () => {
    it('should create user and admin', async () => {
      const user = await prisma.user.create({
        data: {
          name: 'test',
          email: 'test@email.com',
          password: '1234',
          role: 'USER',
        },
      });
      userId = user.id;
      const admin = await prisma.user.create({
        data: {
          name: 'admin',
          email: 'admin@email.com',
          password: '1234',
          role: 'ADMIN',
        },
      });
      adminId = admin.id;
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
    it('should create order', async () => {
      orderData.owner.connect.id = userId;
      const order = await orderService.createOrder(userId, orderData);
      orderId = order.id;
      expect(order.description).toBe(orderData.description);
      expect(order.specifications).toBe(orderData.specifications);
      expect(order.quantity).toBe(orderData.quantity);
      expect(order.metadata).toStrictEqual(orderData.metadata);
      expect(order.status).toBe(orderData.status);
    });
  });

  describe('getOrder()', () => {
    it('should get an order', async () => {
      const order = await orderService.getOrder(userId, orderId);
      expect(order.id).toBe(orderId);
      expect(order.ownerId).toBe(userId);
      expect(order.description).toBeDefined();
      expect(order.status).toBe('REVIEW');
    });
  });

  describe('getAllOrder()', () => {
    it('should get all orders', async () => {
      const orders = await orderService.getAllOrder(adminId);
    });
  });

  describe('orderCompleted()', () => {
    it('should marka an order completed', async () => {
      const order = await orderService.orderCompleted(userId, orderId);
      expect(order.id).toBe(orderId);
      expect(order.ownerId).toBe(userId);
      expect(order.description).toBeDefined();
      // expect(order.status).toBe('COMPLETED');
    });
  });

  describe('deleteOrder()', () => {
    it('should delete an order', async () => {
      const order = await orderService.deleteOrder(adminId, orderId);
    });
  });

  it.todo('it should pass');
});
