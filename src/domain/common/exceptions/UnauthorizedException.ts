import { HttpException } from "./HttpException";

export class UnauthorizedException extends HttpException {
  constructor(
    message: string,
    errorCode: number,
  ) {
    super(message, errorCode, 401);
  }
}