import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Token } from './entities/token.entity';
import { JwtModule } from '@nestjs/jwt';
import { config } from '../../config';
import { MailerModule } from '@nestjs-modules/mailer';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';
import { GoogleService } from './google/google.service';
import { BaseService } from './base/base.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Token]),
    JwtModule.register({
      secret: config.secretKey,
    }),
    MailerModule.forRootAsync({
      useFactory: () => ({
        transport: {
          host: 'smtp.ukr.net',
          port: 465,
          secure: true,
          auth: {
            user: config.USER_EMAIL,
            pass: config.PASS_EMAIl,
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
  providers: [AuthService, GoogleService, BaseService],
})
export class AuthModule {}
