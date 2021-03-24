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

  private async sendMail(
    mailReceiver: string,
    subject: string,
    text: string,
    html: string,
  ) {
    try {
      const res = await this.mailerService.sendMail({
        to: mailReceiver,
        from: 'sbarabash2001@ukr.net',
        subject: subject,
        text: text,
        html: html,
      });

      console.log(res);
    } catch (error) {
      console.warn(error);
    }
  }

  async baseRegister(userRegisterLoginDto: UserRegisterLoginDto) {
    const tokens = await this.register(userRegisterLoginDto);

    const mailReceiver = userRegisterLoginDto.email;
    const subject = 'Mail check.';
    const text = 'We sent this mail to check if your email address exists.';
    const html = `
      <h2>HEY!</h2>
      <br/>      
      <i>${text}</i>
    `;

    await this.sendMail(mailReceiver, subject, text, html);
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
    await this.usersRepository.update(
      { email, isGoogleAuthorization: false },
      { password: passwordHash },
    );

    const mailReceiver = email;
    const subject = 'Forgot password';
    const text = "We've sent this mail because you forgot your password.";
    const html = `
      <h2>HEY!</h2>
      <br/>
      <i>${text}</i>
      <br/>
      <i>Your new account data:</i>
      <ul>
        <li>login: ${email}'</li>
        <li>password: ${password}</li>
      </ul>
    `;

    await this.sendMail(mailReceiver, subject, text, html);
    return 'Ok';
  }
}
