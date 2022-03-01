import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Response } from 'express';
import { HttpException } from '../exceptions/HttpException';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const statusCode: number = exception.getStatusCode();
    const message: string = exception.getMessage();
    const errorCode: void | number = exception.getErrorCode();

    response.status(statusCode).json({
      message,
      errorCode,
    });
  }
}
