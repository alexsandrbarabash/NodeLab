import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRegisterLoginDto } from './dto/user-register-login.dto';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entities';
import { Token } from './entities/token.entities';
import { MailerService } from '@nestjs-modules/mailer';
import { OAuth2Client } from 'google-auth-library';
import {config} from "../../config";

type RegisterObject = {
  email: string;
  password: string | null;
  isGoogleAuthorization?: boolean;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Token)
    private tokenRepository: Repository<Token>,
    private readonly mailerService: MailerService,
  ) {}

  // email
  private example(): void {
    this.mailerService
      .sendMail({
        to: 'sbarabas176@gmail.com', // list of receivers
        from: 'sbarabash2001@ukr.net', // sender address
        subject: 'Testing Nest MailerModule ✔', // Subject line
        text: 'welcome', // plaintext body
        html: '<b>welcome</b>', // HTML body content
      })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  private generationTokens(id: number) {
    const accessToken = this.jwtService.sign({ id });

    return { accessToken, refreshToken: uuidv4() };
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

  private async createToken(user: User) {
    const tokens = this.generationTokens(user.id);
    const token = this.tokenRepository.create({
      token: tokens.refreshToken,
      user: user.id,
    });
    await this.tokenRepository.save(token);

    return tokens;
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

  baseRegister(userRegisterLoginDto: UserRegisterLoginDto) {
    return this.register(userRegisterLoginDto);
  }

  async googleRegister(token: string) {
    const email = await this.checkToken(token);
    return this.register({
      email,
      password: null,
      isGoogleAuthorization: true,
    });
  }

  async baseLogin(userRegisterLoginDto: UserRegisterLoginDto) {
    const user = await this.usersRepository.findOne({
      email: userRegisterLoginDto.email,
    });

    if (!user) {
      throw new HttpException('Incorrect data', HttpStatus.NOT_ACCEPTABLE);
    }

    const isMatch = await bcrypt.compare(
      userRegisterLoginDto.password,
      user.password,
    );

    if (!isMatch) {
      throw new HttpException('Incorrect data', HttpStatus.NOT_ACCEPTABLE);
    }

    return this.createToken(user);
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

  verifiedEmail(id: number) {
    return this.usersRepository.update(id, { isVerifiedEmail: true });
  }

  async refreshToken(refreshToken: string) {
    const currentToken = await this.tokenRepository.findOne({
      token: refreshToken,
    });

    if (!currentToken) {
      throw new HttpException('Not a valid token', HttpStatus.NOT_FOUND);
    }

    const tokens = this.generationTokens(currentToken.user);

    this.tokenRepository.save({
      ...currentToken,
      token: tokens.refreshToken,
    });

    return tokens;
  }
}
