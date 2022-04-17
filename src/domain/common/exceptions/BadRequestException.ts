import { HttpException } from './HttpException';

export class BadRequestException extends HttpException {
  public constructor(
    message: string,
    errorCode: number,
    context?: string,
    logMessage?: string,
  ) {
    super(message, errorCode, 400, context, logMessage);
  }
}
