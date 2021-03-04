import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  register(userRegisterLoginDto: any) {
    return 'register';
  }

  login(userRegisterLoginDto: any) {
    return 'login';
  }

  refreshToken() {
    return 'refresh-token';
  }
}
