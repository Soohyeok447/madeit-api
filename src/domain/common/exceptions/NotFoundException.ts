import { HttpException } from "./HttpException";

export class NotFoundException extends HttpException {
  constructor(
    message: string,
    errorCode: number,
  ) {
    super(message, errorCode, 404);
  }
}