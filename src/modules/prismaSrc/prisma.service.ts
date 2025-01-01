import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  // async cleanDatabase() {
  //   const models = Reflect.ownKeys(this).filter((key) => key[0] !== '_');
  //   return Promise.all(models.map((modelkey) => this[modelkey].deleteMany()));
  // }
  async cleanDatabase() {
    const models = Reflect.ownKeys(this).filter((key) => key[0] !== '_');
    const deletePromises = models
      .filter((modelkey) => typeof this[modelkey]?.deleteMany === 'function') // Ensure the model has deleteMany
      .map((modelkey) => this[modelkey].deleteMany()); // Call deleteMany on valid models

    return Promise.all(deletePromises); // Wait for all deletions to complete
  }
}
