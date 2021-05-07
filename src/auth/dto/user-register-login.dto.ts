import { IsString, IsEmail, Length } from 'class-validator';

export class UserRegisterLoginDto {
  @IsEmail()
  readonly email: string;

  @IsString()
  @Length(6)
  readonly password: string;
}
