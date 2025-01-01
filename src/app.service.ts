import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private configService: ConfigService) {}

  getHello() {
    return 'Hello World!';
  }
  getPort(): string {
    return this.configService.get<string>('PORT');
  }

  getJwtSecret(): string {
    return this.configService.get<string>('JWT_SECRET');
  }

  getExpiresIn(): string {
    return this.configService.get<string>('EXPIRES_IN');
  }
}
