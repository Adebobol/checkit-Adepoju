import {
  Body,
  Controller,
  Post,
  Request,
  Param,
  Get,
  UseGuards,
  Delete,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { AuthGuard } from '@nestjs/passport';
import { EventPattern, Payload } from '@nestjs/microservices';
import { ChatRoomService } from './chatRoom.service';
import { ParamsTokenFactory } from '@nestjs/core/pipes';

@Controller()
export class OrderController {
  constructor(
    private orderService: OrderService,
    private readonly chatRoomService: ChatRoomService,
  ) {}

  // create order route
  @UseGuards(AuthGuard('jwt'))
  @Post('order/create')
  async createOrder(@Request() req: any, @Body() orderData) {
    return await this.orderService.createOrder(req.user.id, orderData);
  }

  // get order route
  @UseGuards(AuthGuard('jwt'))
  @Get('order/:id')
  async getOrder(@Request() req: any, @Param('id') id: number) {
    return await this.orderService.getOrder(req.user.id, id);
  }

  // get all order route
  @UseGuards(AuthGuard('jwt'))
  @Get('order')
  async getAllOrder(@Request() req: any) {
    return await this.orderService.getAllOrder(req.user.id);
  }

  // delete an order route
  @UseGuards(AuthGuard('jwt'))
  @Delete('order/:id')
  async deleteOrder(@Request() req: any, @Param('id') id: number) {
    return await this.orderService.deleteOrder(req.user.id, id);
  }

  // mark an order completed route
  @UseGuards(AuthGuard('jwt'))
  @Post('order/completed/:id')
  async orderCompleted(@Request() req: any, @Param('id') id: number) {
    return await this.orderService.orderCompleted(req.user.id, id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('chatroom')
  async createChatroom(@Request() req: any, @Body() orderBody: any) {
    const { orderId } = orderBody;
    return await this.chatRoomService.createChatRoom(req.user.id, orderId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('chatroom/:id')
  async getChatroom(@Request() req: any, @Param('id') id: number) {
    return await this.chatRoomService.getChatRoom(req.user.id, id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('chatroom')
  async deleteChatroom(@Request() req: any, @Body() orderBody: any) {
    const { orderId } = orderBody;
    return await this.chatRoomService.deleteChatRoom(req.user.id, orderId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('message/:id')
  async sendMessage(
    @Request() req: any,
    @Param('id') id: number,
    @Body() messageData,
  ) {
    return await this.chatRoomService.sendMessage(req.user.id, id, messageData);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('message/close/:id')
  async closeMessage(
    @Request() req: any,
    @Param('id') id: number,
    @Body() messageData,
  ) {
    return await this.chatRoomService.closeChatRoom(
      req.user.id,
      id,
      messageData,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('chatroom/messages/:id')
  async getAllChatroomMessages(@Request() req: any, @Param('id') id: number) {
    return await this.chatRoomService.getAllChatRoomMessages(req.user.id, id);
  }
}
