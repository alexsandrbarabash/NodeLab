import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../common/entities/user.entity';
import { Token } from './entities/token.entity';
import { JwtModule } from '@nestjs/jwt';
import { MailerModule } from '@nestjs-modules/mailer';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';
import { GoogleService } from './google/google.service';
import { BaseService } from './base/base.service';
import { ConfigModule } from '@nestjs/config';
import { AuthMiddleware } from './middleware/auth.middleware';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([User, Token]),
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.SECRET_KEY,
      }),
    }),
    MailerModule.forRootAsync({
      useFactory: () => ({
        transport: {
          host: 'smtp.ukr.net',
          port: 465,
          secure: true,
          auth: {
            user: process.env.USER_EMAIL,
            pass: process.env.PASS_EMAIl,
          },
        },
        defaults: {
          from: '"nest-modules" <modules@nestjs.com>', // sbarabash2001@ukr.net
        },
        template: {
          dir: process.cwd() + '/templates/',
          adapter: new PugAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, GoogleService, BaseService, AuthMiddleware],
})
export class AuthModule {}
