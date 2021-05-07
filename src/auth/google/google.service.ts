import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../common/entities/user.entity';
import { Repository } from 'typeorm';
import { Token } from '../entities/token.entity';
import { OAuth2Client } from 'google-auth-library';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleService extends AuthService {
  constructor(
    jwtService: JwtService,
    @InjectRepository(User)
    usersRepository: Repository<User>,
    @InjectRepository(Token)
    tokenRepository: Repository<Token>,
    private configService: ConfigService,
  ) {
    super(jwtService, usersRepository, tokenRepository);
  }

  private async checkToken(token: string) {
    try {
      const clientId = this.configService.get('CLIENT_ID');
      const client = new OAuth2Client(clientId);
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: clientId,
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
