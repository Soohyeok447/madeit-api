import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import * as helmet from 'helmet';
import { TimeoutInterceptor } from './adapter/common/interceptors/TimeoutInterceptor.interceptor';
import { ValidationPipe } from './adapter/common/pipes/ValidationPipe';
import { HttpExceptionFilter } from './domain/common/filters/HttpExceptionFilter';
import { LoggerProvider } from './domain/providers/LoggerProvider';
import { getCorsOptions } from './infrastructure/environment';
import { LoggerProviderImpl } from './infrastructure/providers/LoggerProviderImpl';
import { setSwagger } from './infrastructure/utils/setSwagger';

import { AppModule } from './ioc/AppModule';

async function bootstrap(): Promise<void> {
  const app: INestApplication = await NestFactory.create(AppModule);
  const logger: LoggerProvider = new LoggerProviderImpl();

  app.useGlobalPipes(
    // new ValidationPipe({
    //   whitelist: true,
    //   forbidNonWhitelisted: true,
    //   transform: true,
    // }),
    new ValidationPipe(logger),
  );
  app.useGlobalFilters(new HttpExceptionFilter(logger));
  app.use(cookieParser());
  setSwagger(app);
  app.use(helmet());
  app.enableCors(getCorsOptions());
  await app.listen(8901);
  app.useGlobalInterceptors(new TimeoutInterceptor());
}
bootstrap();
