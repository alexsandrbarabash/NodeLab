import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRegisterLoginDto } from './dto/user-register-login.dto';
import { User } from './entities/user.entities';
import { Token } from './entities/token.entities';
import { v4 as uuidv4 } from 'uuid';

export type accessRefreshToken = {
  accessToken: string;
  refreshToken: string;
};

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Token)
    private tokenRepository: Repository<Token>,
  ) {}

  // private generationTokens(id: number, refreshToken: string) {
  //
  // }

  async register(userRegisterLoginDto: UserRegisterLoginDto) {
    const user = this.usersRepository.create(userRegisterLoginDto);
    await this.usersRepository.save(user);
    const token = this.tokenRepository.create({
      token: uuidv4(),
      user: user.id,
    });
    await this.tokenRepository.save(token);

    return {
      accessToken: '',
      refreshToken: '',
    };
  }

  async login(userRegisterLoginDto: UserRegisterLoginDto) {
    const result = await this.usersRepository.find(userRegisterLoginDto);
    console.log(result);
    return result;
  }

  refreshToken() {
    return 'refresh-token';
  }
}
