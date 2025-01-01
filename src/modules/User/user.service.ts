import { BadRequestException, Injectable } from '@nestjs/common';
import createHttpError from 'http-errors';
import { Prisma, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prismaSrc/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  // creating a user
  async createUser(data: { name: string; email: string; password: string }) {
    if (!data.email || !data.password || !data.name) {
      throw createHttpError(400, 'All fields are required');
    }

    const existingUser = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new Error('Email is already in use');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    return this.prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
      },
    });
  }

  async createAdmin(data: { name: string; email: string; password: string }) {
    if (!data.email || !data.password || !data.name) {
      throw createHttpError(400, 'All fields are required');
    }

    const existingAdmin = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingAdmin) {
      throw new Error('Admin with email already in use.');
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

  // get a user
  async user(email: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        throw new Error('User not found');
      }

      return user;
    } catch (error) {
      throw new Error(
        error.message || 'An unexpected error occurred while fetching the user',
      );
    }
  }

  //get all users
  async users() {
    return this.prisma.user.findMany();
  }

  //updating a user
  async updateUser(userId: number, data: { name: string }) {
    if (!data || Object.keys(data).length === 0) {
      throw new Error('No name data found to update.');
    }

    const user = await this.prisma.user.findUnique({ where: { id: +userId } });
    if (!user) {
      throw new Error("User doesn't exist.");
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data,
    });

    return updatedUser;
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
