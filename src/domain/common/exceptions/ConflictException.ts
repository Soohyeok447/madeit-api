import { HttpException } from './HttpException';

export class ConflictException extends HttpException {
  public constructor(
    message: string,
    errorCode: number,
    context?: string,
    logMessage?: string,
  ) {
    super(message, errorCode, 409, context, logMessage);
  }
}
