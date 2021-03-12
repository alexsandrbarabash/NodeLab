import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { Token } from '../entities/token.entity';
import { MailerService } from '@nestjs-modules/mailer';
import { UserRegisterLoginDto } from '../dto/user-register-login.dto';
import * as bcrypt from 'bcrypt';
import { ForgetPasswordDto } from '../dto/forget-password.dto';

@Injectable()
export class BaseService extends AuthService {
  constructor(
    jwtService: JwtService,
    @InjectRepository(User)
    usersRepository: Repository<User>,
    @InjectRepository(Token)
    tokenRepository: Repository<Token>,
    private mailerService: MailerService,
  ) {
    super(jwtService, usersRepository, tokenRepository);
  }

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

  /**
   * Потрібно зробити відправку для перевірки чи існує такий емаїл і
   * функції для зміни пароля (тільки вітправка згенерованого функцією createPassword).
   * Приклад функції вище.
   * Я використовую бібліотеку NestJS - Mailer
   * https://nest-modules.github.io/mailer/
   * все підключено, в ядрі використовуються nodemailer його доки тоже можуть помогти.
   * Росилка прив'язана до мого старого акаунта укр нета може потом на gmail поміняєм.
   * Просто зараз зроби функції які кидають шаблони.
   * Якщо буде бажання можеш зробити якісь шаблони тіпа Ejs для відправка,
   * але це не обов'язково.
   * Удачі.
   * Єслі шо не понятно пиши сорі що скидую свою роботу.
   * Потім видали ці коменти.
   */

  async baseRegister(userRegisterLoginDto: UserRegisterLoginDto) {
    const tokens = await this.register(userRegisterLoginDto);
    // send email for register check
    return tokens;
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

  async verifiedEmail(id: number) {
    await this.usersRepository.update(id, { isVerifiedEmail: true });
    return 'Ok';
  }

  private createPassword(): string {
    let password = '';
    const possible = 'abcdefghijklmnopqrstuvwxyz';

    for (let i = 0; i < 5; i++) {
      password += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return password;
  }

  async forgetPassword({ email }: ForgetPasswordDto) {
    const password = this.createPassword();
    const passwordHash = await bcrypt.hash(password, 5);
    this.usersRepository.update(
      { email, isGoogleAuthorization: false },
      { password: passwordHash },
    );
    // send email to user change password
    return 'Ok';
  }
}
