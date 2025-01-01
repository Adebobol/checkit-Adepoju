import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
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
  @Put('/:id')
  async updateUser(
    @Param('id') id: number,
    @Body() data: { name: string; email: string; password: string },
  ) {
    const updateData = { id, data };
    return this.userService.updateUser(updateData);
  }

  @Delete('/:id')
  async deleteUser(@Param('id') id: number) {
    return this.userService.deleteUser(id);
  }
}
