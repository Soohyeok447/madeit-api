import { HttpException } from "./HttpException";

export class ForbiddenException extends HttpException {
  constructor(
    message: string,
    errorCode: number,
  ) {
    super(message, errorCode, 403);
  }
}