import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import * as helmet from 'helmet';
import { TimeoutInterceptor } from './adapter/common/interceptors/timeout.interceptor';
import { setupSwagger } from './infrastructure/utils/providers/swagger';

import { AppModule } from './ioc/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: console,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.use(cookieParser());
  setupSwagger(app);
  app.use(helmet());
  await app.listen(8901);
  app.useGlobalInterceptors(new TimeoutInterceptor());
}
bootstrap();
