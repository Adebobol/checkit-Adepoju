import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { connectToDatabase } from './config/database';
import { CustomExceptionFilter } from './filters/prisma-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // logger: false,
  });

  // custom filter
  app.useGlobalFilters(new CustomExceptionFilter());
  //
  await app.listen(process.env.PORT);
  connectToDatabase();
}
bootstrap();
