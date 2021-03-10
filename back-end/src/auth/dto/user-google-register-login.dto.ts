import { IsString } from 'class-validator';

export class UserGoogleRegisterLoginDto {
  @IsString()
  readonly token: string;
}
