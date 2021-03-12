import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { Token } from '../entities/token.entity';
import { config } from '../../../config';
import { OAuth2Client } from 'google-auth-library';

@Injectable()
export class GoogleService extends AuthService {
  constructor(
    jwtService: JwtService,
    @InjectRepository(User)
    usersRepository: Repository<User>,
    @InjectRepository(Token)
    tokenRepository: Repository<Token>,
  ) {
    super(jwtService, usersRepository, tokenRepository);
  }

  private async checkToken(token: string) {
    try {
      const CLIENT_ID = config.CLIENT_ID;
      const client = new OAuth2Client(CLIENT_ID);
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID,
      });
      return ticket.getPayload().email;
    } catch (e) {
      throw new HttpException('Incorrect data', HttpStatus.NOT_ACCEPTABLE);
    }
  }

  async googleRegister(token: string) {
    const email = await this.checkToken(token);
    return this.register({
      email,
      password: null,
      isGoogleAuthorization: true,
      isVerifiedEmail: true,
    });
  }

  async googleLogin(token: string) {
    const email = await this.checkToken(token);
    const user = await this.usersRepository.findOne({
      email,
    });

    if (!user) {
      throw new HttpException('Incorrect data', HttpStatus.NOT_ACCEPTABLE);
    }
    return this.createToken(user);
  }
}
