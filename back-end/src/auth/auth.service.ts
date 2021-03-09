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

  private async createToken(user: User) {
    const tokens = this.generationTokens(user.id);
    const token = this.tokenRepository.create({
      token: tokens.refreshToken,
      user: user.id,
    });
    await this.tokenRepository.save(token);

    return tokens;
  }

  async register(userRegisterLoginDto: UserRegisterLoginDto) {
    // this.example();
    const candidate = await this.usersRepository.findOne({
      email: userRegisterLoginDto.email,
    });

    if (candidate) {
      throw new HttpException('Incorrect data', HttpStatus.NOT_ACCEPTABLE);
    }
    const passwordHash = await bcrypt.hash(userRegisterLoginDto.password, 5);
    const user = this.usersRepository.create({
      email: userRegisterLoginDto.email,
      password: passwordHash,
    });

    await this.usersRepository.save(user);

    return this.createToken(user);
  }

  async login(userRegisterLoginDto: UserRegisterLoginDto) {
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

  verifiedEmail(id) {
    return this.usersRepository.update(+id, { isVerifiedEmail: true });
  }

  async refreshToken(refreshToken) {
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
