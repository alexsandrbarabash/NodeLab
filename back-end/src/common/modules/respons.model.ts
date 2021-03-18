import { Request } from 'express';

export default interface ExpandedRequest extends Request {
  userId?: number;
}