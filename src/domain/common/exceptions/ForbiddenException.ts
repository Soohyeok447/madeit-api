import { HttpException } from './HttpException';

export class ForbiddenException extends HttpException {
  public constructor(
    message: string,
    errorCode: number,
    context?: string,
    logMessage?: string,
  ) {
    super(message, errorCode, 403, context, logMessage);
  }
}
