import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Response, NextFunction } from 'express';
import ExpandedRequest from '../modules/respons.model';
import { PayloadAccessJwt } from '../modules/jwt.model';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  use(req: ExpandedRequest, res: Response, next: NextFunction) {
    const authHeaders = req.headers.authorization;
    if (authHeaders && (authHeaders as string).split(' ')[1]) {
      const token = (authHeaders as string).split(' ')[1];

      try {
        const { id } = this.jwtService.verify<PayloadAccessJwt>(token);
        req.userId = id;
      } catch (e) {
        throw new HttpException('Request timeout', HttpStatus.REQUEST_TIMEOUT);
      }
    } else {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
    next();
  }
}
