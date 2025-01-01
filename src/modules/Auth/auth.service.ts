import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUserInfo(email: string, Password: string) {
    const user = await this.userService.user(email);

    const encrypt = await bcrypt.compare(Password, user.password);

    if (!user || !encrypt) {
      throw new Error('Credentials are not valid.');
    }

    return user;
  }

  async login(user) {
    const payload = { username: user.name, sub: user.id };
    return {
      token: this.jwtService.sign(payload),
    };
  }
}
