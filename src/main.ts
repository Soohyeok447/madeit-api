import { INestApplication, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import * as helmet from 'helmet';
import { TimeoutInterceptor } from './adapter/common/interceptors/TimeoutInterceptor.interceptor';
import { HttpExceptionFilter } from './domain/common/filters/HttpExceptionFilter';
import { LoggerProviderImpl } from './infrastructure/providers/LoggerProviderImpl';
import { setSwagger } from './infrastructure/utils/setSwagger';

import { AppModule } from './ioc/AppModule';

async function bootstrap(): Promise<void> {
  const app: INestApplication = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter(new LoggerProviderImpl()));
  app.use(cookieParser());
  setSwagger(app);
  app.use(helmet());
  app.enableCors();
  await app.listen(8901);
  app.useGlobalInterceptors(new TimeoutInterceptor());
}
bootstrap();
