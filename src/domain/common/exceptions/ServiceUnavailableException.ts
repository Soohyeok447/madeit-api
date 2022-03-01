import { HttpException } from './HttpException';

export class ServiceUnavailableException extends HttpException {
  constructor(message: string, errorCode: number) {
    super(message, errorCode, 503);
  }
}
