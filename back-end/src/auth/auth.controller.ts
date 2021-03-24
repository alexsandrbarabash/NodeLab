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
import { UserGoogleRegisterLoginDto } from './dto/user-google-register-login.dto';
import { GoogleService } from './google/google.service';
import { BaseService } from './base/base.service';
import { ForgetPasswordDto } from './dto/forget-password.dto';

type AccessToken = { accessToken: string };

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly googleService: GoogleService,
    private readonly baseService: BaseService,
  ) {}

  private setCookie(res: Response, refreshToken: string) {
    res.cookie('refresh', refreshToken, {
      maxAge: 90000000000,
      httpOnly: true,
    });
  }

  @Post('base-register')
  async basicRegister(
    @Body() userRegisterLoginDto: UserRegisterLoginDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<AccessToken> {
    const { refreshToken, accessToken } = await this.baseService.baseRegister(
      userRegisterLoginDto,
    );
    this.setCookie(response, refreshToken);
    return { accessToken };
  }

  @Post('google-register')
  async googleRegister(
    @Body() userGoogleRegisterLoginDto: UserGoogleRegisterLoginDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<AccessToken> {
    const {
      refreshToken,
      accessToken,
    } = await this.googleService.googleRegister(
      userGoogleRegisterLoginDto.token,
    );
    this.setCookie(response, refreshToken);
    return { accessToken };
  }

  @Post('base-login')
  async baseLogin(
    @Body() userRegisterLoginDto: UserRegisterLoginDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<AccessToken> {
    const { refreshToken, accessToken } = await this.baseService.baseLogin(
      userRegisterLoginDto,
    );
    this.setCookie(response, refreshToken);
    return { accessToken };
  }

  @Post('google-login')
  async googleLogin(
    @Body() userGoogleRegisterLoginDto: UserGoogleRegisterLoginDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<AccessToken> {
    const { refreshToken, accessToken } = await this.googleService.googleLogin(
      userGoogleRegisterLoginDto.token,
    );
    this.setCookie(response, refreshToken);
    return { accessToken };
  }

  @Get('refresh-tokens')
  async refreshToken(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<AccessToken> {
    const { refreshToken, accessToken } = await this.authService.refreshTokens(
      request.cookies['refresh'],
    );

    this.setCookie(response, refreshToken);

    return { accessToken };
  }

  @Put('verified-email/:id')
  verifiedEmail(@Param('id') id: number) {
    return this.baseService.verifiedEmail(id);
  }

  @Put('forget-password')
  forgetPassword(@Body() forgetPasswordDto: ForgetPasswordDto) {
    return this.baseService.forgetPassword(forgetPasswordDto);
  }
}
