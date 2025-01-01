import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Request,
  Put,
  UseGuards,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create')
  async createUser(
    @Body() data: { name: string; email: string; password: string },
  ) {
    return await this.userService.createUser(data);
  }

  @Post('create/admin')
  async createAdmin(
    @Body() data: { name: string; email: string; password: string },
  ) {
    return await this.userService.createAdmin(data);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async user(@Body() data) {
    const { email, ...rest } = data;
    return this.userService.user(email);
  }

  @Get('all')
  async users() {
    return this.userService.users();
  }

  //updating a user
  @UseGuards(AuthGuard('jwt'))
  @Put()
  async updateUser(@Request() req: any, @Body() data: { name: string }) {
    return this.userService.updateUser(req.user.id, data);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete()
  async deleteUser(@Request() req: any) {
    return this.userService.deleteUser(req.user.id);
  }
}
