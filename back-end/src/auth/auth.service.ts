import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRegisterLoginDto } from './dto/user-register-login.dto';
import { User } from './entities/user.entities';
import { Token } from './entities/token.entities';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';

// export type AccessRefreshToken = {
//   accessToken: string;
//   refreshToken: string;
// };

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Token)
    private tokenRepository: Repository<Token>,
  ) {}

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

  refreshToken(refreshToken) {
    return 'refresh-token';
  }
}
