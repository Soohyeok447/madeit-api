import { HttpException } from './HttpException';

export class NotFoundException extends HttpException {
  public constructor(
    message: string,
    errorCode: number,
    context?: string,
    logMessage?: string,
  ) {
    super(message, errorCode, 404, context, logMessage);
  }
}
