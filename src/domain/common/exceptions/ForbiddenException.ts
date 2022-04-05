import { HttpException } from './HttpException';

export class ForbiddenException extends HttpException {
  public constructor(message: string, errorCode: number) {
    super(message, errorCode, 403);
  }
}
