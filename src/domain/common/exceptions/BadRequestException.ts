import { HttpException } from "./HttpException";

export class BadRequestException extends HttpException {
  constructor(
    message: string,
    errorCode: number,
  ) {
    super(message, errorCode, 400);
  }
}