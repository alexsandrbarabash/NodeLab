import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entities';
import { Token } from './entities/token.entities';
import { JwtModule } from '@nestjs/jwt';
import { config } from '../../config';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Token]),
    JwtModule.register({
      secret: config.secretKey,
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
