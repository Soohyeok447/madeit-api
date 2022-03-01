import { HttpException } from './HttpException';

export class ConflictException extends HttpException {
  constructor(message: string, errorCode: number) {
    super(message, errorCode, 409);
  }
}
