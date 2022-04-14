import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  Injectable,
} from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { Response, Request } from 'express';
import { LoggerProvider } from '../../providers/LoggerProvider';
import { HttpException } from '../exceptions/HttpException';

@Injectable()
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  public constructor(private readonly logger: LoggerProvider) {}

  public catch(exception: HttpException, host: ArgumentsHost): void {
    const ctx: HttpArgumentsHost = host.switchToHttp();
    const response: Response<
      any,
      Record<string, any>
    > = ctx.getResponse<Response>();
    const request: Request<
      any,
      Record<string, any>
    > = ctx.getRequest<Request>();
    const statusCode: number = exception.getStatusCode();
    const message: string = exception.getMessage();
    const errorCode: void | number = exception.getErrorCode();
    const context: void | string = exception.getContext();
    const logMessage: void | string = exception.getLogMessage();

    this.logger.error(
      `<${context}>\nrequest.headers : ${JSON.stringify(
        request.headers,
      )} \nrequest.body : ${JSON.stringify(
        request.body,
      )} \nrequest.authInfo : ${JSON.stringify(
        request.authInfo,
      )} \nreqeust.route : ${JSON.stringify(
        request.route,
      )} \nrequest.ip : ${JSON.stringify(
        request.ip,
      )} \nrequest.hostname : ${JSON.stringify(
        request.hostname,
      )}\nrequest.method : ${JSON.stringify(
        request.method,
      )} \nreqeust.user : ${JSON.stringify(
        request.user,
      )} \nlogMessage : ${logMessage}\nstatusCode : ${statusCode}\nerrorCode : ${errorCode}`,
    );

    console.log('request.headers');
    console.log(request.headers);
    console.log('request.body');
    console.log(request.body);
    console.log('request.authInfo');
    console.log(request.authInfo);
    console.log('request.route');
    console.log(request.route);
    console.log('request.ip');
    console.log(request.ip);
    console.log('request.hostname');
    console.log(request.hostname);
    console.log('request.file');
    console.log(request.file);
    console.log('request.files');
    console.log(request.files);
    console.log('request.method');
    console.log(request.method);
    console.log('request.user');
    console.log(request.user);

    //그러면 exception에 각각 다는게 아니라 exception filter에 로거를 달아야함

    response.status(statusCode).json({
      message,
      errorCode,
    });
  }
}
