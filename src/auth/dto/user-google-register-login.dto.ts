import { IsString, IsNotEmpty } from 'class-validator';

export class UserGoogleRegisterLoginDto {
  @IsString()
  @IsNotEmpty()
  readonly token: string;
}
