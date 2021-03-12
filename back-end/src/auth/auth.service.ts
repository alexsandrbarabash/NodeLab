import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { Token } from './entities/token.entity';

type RegisterObject = {
  email: string;
  password: string | null;
  isGoogleAuthorization?: boolean;
  isVerifiedEmail?: boolean;
};

@Injectable()
export class AuthService {
  constructor(
    protected readonly jwtService: JwtService,
    @InjectRepository(User)
    protected usersRepository: Repository<User>,
    @InjectRepository(Token)
    protected tokenRepository: Repository<Token>,
  ) {}

  private generationTokens(id: number) {
    const accessToken = this.jwtService.sign({ id });

    return { accessToken, refreshToken: uuidv4() };
  }

  protected async createToken(user: User) {
    const tokens = this.generationTokens(user.id);
    const token = this.tokenRepository.create({
      token: tokens.refreshToken,
      user: user.id,
    });
    await this.tokenRepository.save(token);

    return {
      ...tokens,
      refreshToken: this.jwtService.sign(
        {
          refreshToken: tokens.refreshToken,
          id: user.id,
        },
        {
          expiresIn: '365d',
        },
      ),
    };
  }

  async register(registerData: RegisterObject) {
    const candidate = await this.usersRepository.findOne({
      email: registerData.email,
    });

    if (candidate) {
      throw new HttpException('Incorrect data', HttpStatus.NOT_ACCEPTABLE);
    }
    const passwordHash = registerData.password
      ? await bcrypt.hash(registerData.password, 5)
      : null;
    const user = this.usersRepository.create({
      ...registerData,
      password: passwordHash,
    });

    await this.usersRepository.save(user);

    return this.createToken(user);
  }

  async refreshToken(token: string) {
    try {
      const {
        refreshToken,
        id,
      }: { refreshToken: string; id: number } = this.jwtService.verify(token);
      const currentToken = await this.tokenRepository.findOne({
        token: refreshToken,
      });

      if (!currentToken) {
        this.tokenRepository.delete({ user: id }); // delete all tokens this user if token isn't valid

        throw new HttpException('Not a valid token', HttpStatus.NOT_FOUND);
      }

      const tokens = this.generationTokens(currentToken.user);

      this.tokenRepository.save({
        ...currentToken,
        token: tokens.refreshToken,
      });

      return tokens;
    } catch (e) {
      throw new HttpException('Not a valid token', HttpStatus.NOT_FOUND);
    }
  }
}
