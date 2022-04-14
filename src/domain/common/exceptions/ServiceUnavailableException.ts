import { HttpException } from './HttpException';

export class ServiceUnavailableException extends HttpException {
  public constructor(
    message: string,
    errorCode: number,
    context?: string,
    logMessage?: string,
  ) {
    super(message, errorCode, 503, context, logMessage);
  }
}
