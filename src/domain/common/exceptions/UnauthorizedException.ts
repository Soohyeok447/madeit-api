import { HttpException } from './HttpException';

export class UnauthorizedException extends HttpException {
  public constructor(message: string, errorCode: number) {
    super(message, errorCode, 401);
  }
}
