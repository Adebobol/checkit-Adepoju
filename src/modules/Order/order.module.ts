import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { PrismaModule } from '../prismaSrc/prisma.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ChatRoomService } from './chatRoom.service';
import { UserModule } from '../user/user.module';
import { OrderGateway } from './gateway/order-gatway';

@Module({
  imports: [PrismaModule, UserModule],
  providers: [OrderService, ChatRoomService, OrderGateway],
  controllers: [OrderController],
  exports: [OrderService],
})
export class OrderModule {}
