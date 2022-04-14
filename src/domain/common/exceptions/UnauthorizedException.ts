import { HttpException } from './HttpException';

export class UnauthorizedException extends HttpException {
  public constructor(
    message: string,
    errorCode: number,
    context?: string,
    logMessage?: string,
  ) {
    super(message, errorCode, 401, context, logMessage);
  }
}
