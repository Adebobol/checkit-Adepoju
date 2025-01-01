import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prismaSrc/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  // creating a user
  async createUser(data) {
    if (!data.email || !data.password || !data.name) {
      throw new Error('All fields are required');
    }
    const hashedPassword = await bcrypt.hash(data.password, 10);

    return this.prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: data.role,
      },
    });
  }

  // creating an admin
  async createAdmin(data) {
    if (!data.email || !data.password || !data.name) {
      throw new Error('All fields are required');
    }
    const hashedPassword = await bcrypt.hash(data.password, 10);

    return this.prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: 'ADMIN',
      },
    });
  }

  // creating an admin
  async getAdmin() {
    const admin = this.prisma.user.findFirst({ where: { role: 'ADMIN' } });
    return admin;
  }

  // get a user
  async user(email: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email: email },
      });

      if (!user) {
        throw new Error('User not found');
      }

      return user;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw new Error('Failed to fetch user');
    }
  }

  //get all users
  async users() {
    return this.prisma.user.findMany();
  }

  //updating a user
  async updateUser(updateData) {
    const { id, data } = updateData;

    if (Object.keys(data).length === 0) {
      throw new Error('No data found');
    }

    if (data.password || data.email) {
      throw new Error("You can't update your password and email");
    }

    const user = await this.prisma.user.findFirst({ where: { id: +id } });
    if (!user) {
      throw new Error("User doesn't exist.");
    }
    const updateUser = await this.prisma.user.update({
      where: { id: +id },
      data,
    });

    return updateUser;
  }

  async deleteUser(id: number) {
    try {
      // Await the result of the find operation
      const user = await this.prisma.user.findFirstOrThrow({
        where: { id: +id },
      });
      // Proceed to delete if user exists (findFirstOrThrow ensures this)
      await this.prisma.user.delete({
        where: { id: +id },
      });
      return { message: 'User deleted.' };
    } catch (error) {
      // Handle any errors that may occur (e.g., user not found or deletion failure)
      throw new Error('Error deleting user');
    }
  }
}
