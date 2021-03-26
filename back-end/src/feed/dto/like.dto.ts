import { IsNumber } from 'class-validator';

export class LikeDto {
  @IsNumber()
  readonly profileId: number;
}