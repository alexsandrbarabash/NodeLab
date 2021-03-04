import { Controller, Get, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserRegisterLoginDto } from './dto/user-register-login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly AuthService: AuthService) {}

  @Post('register')
  register(@Body() userRegisterLoginDto: UserRegisterLoginDto): string {
    return this.AuthService.register(userRegisterLoginDto);
  }

  @Post('login')
  login(@Body() userRegisterLoginDto: UserRegisterLoginDto): string {
    return this.AuthService.login(userRegisterLoginDto);
  }

  @Get('refresh-token')
  refreshToken(): string {
    return this.AuthService.refreshToken();
  }
}
