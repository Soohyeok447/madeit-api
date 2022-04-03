import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { Response } from 'express';
import { HttpException } from '../exceptions/HttpException';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  public catch(exception: HttpException, host: ArgumentsHost): void {
    const ctx: HttpArgumentsHost = host.switchToHttp();
    const response: Response<
      any,
      Record<string, any>
    > = ctx.getResponse<Response>();
    const statusCode: number = exception.getStatusCode();
    const message: string = exception.getMessage();
    const errorCode: void | number = exception.getErrorCode();

    response.status(statusCode).json({
      message,
      errorCode,
    });
  }
}
