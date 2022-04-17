import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  Injectable,
} from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { Response } from 'express';
import { HttpException } from '../exceptions/HttpException';

@Injectable()
@Catch(HttpException)
export class MockHttpExceptionFilter implements ExceptionFilter {
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
