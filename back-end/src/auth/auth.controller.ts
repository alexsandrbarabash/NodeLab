import {
  Controller,
  Get,
  Post,
  Body,
  Res,
  Req,
  Put,
  Param,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserRegisterLoginDto } from './dto/user-register-login.dto';
import { Response, Request } from 'express';

type AccessToken = { accessToken: string };

@Controller('auth')
export class AuthController {
  constructor(private readonly AuthService: AuthService) {}

  private setCookie(res: Response, refreshToken: string) {
    res.cookie('refresh', refreshToken, {
      maxAge: 90000000000,
      httpOnly: true,
    });
  }

  @Post('register')
  async register(
    @Body() userRegisterLoginDto: UserRegisterLoginDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<AccessToken> {
    const { refreshToken, accessToken } = await this.AuthService.register(
      userRegisterLoginDto,
    );
    this.setCookie(response, refreshToken);
    return { accessToken };
  }

  @Post('login')
  async login(
    @Body() userRegisterLoginDto: UserRegisterLoginDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<AccessToken> {
    const { refreshToken, accessToken } = await this.AuthService.login(
      userRegisterLoginDto,
    );
    this.setCookie(response, refreshToken);
    return { accessToken };
  }

  @Get('refresh-tokens')
  async refreshToken(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<AccessToken> {
    const { refreshToken, accessToken } = await this.AuthService.refreshToken(
      request.cookies['refresh'],
    );

    this.setCookie(response, refreshToken);
    return { accessToken };
  }
  // возможно поміняти на body
  @Put('verified-email/:id')
  verifiedEmail(@Param('id') id: number) {
    return this.AuthService.verifiedEmail(id);
  }
}
