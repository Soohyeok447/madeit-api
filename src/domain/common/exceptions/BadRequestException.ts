import { HttpException } from './HttpException';

export class BadRequestException extends HttpException {
  public constructor(message: string, errorCode: number) {
    super(message, errorCode, 400);
  }
}
