import { Controller, Get, Post, Body, Res, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserRegisterLoginDto } from './dto/user-register-login.dto';
import { Response, Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly AuthService: AuthService) {}

  @Post('register')
  async register(
    @Body() userRegisterLoginDto: UserRegisterLoginDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<string> {
    const tokens = await this.AuthService.login(userRegisterLoginDto);
    response.cookie('refresh', tokens.refreshToken);
    return tokens.accessToken;
  }

  @Post('login')
  async login(
    @Body() userRegisterLoginDto: UserRegisterLoginDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<string> {
    const tokens = await this.AuthService.login(userRegisterLoginDto);
    response.cookie('refresh', tokens.refreshToken);
    return tokens.accessToken;
  }

  @Get('refresh-token')
  refreshToken(@Req() request: Request): string {
    return this.AuthService.refreshToken(request.cookies['refresh']);
  }
}
