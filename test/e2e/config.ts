import { INestApplication, ValidationPipe } from '@nestjs/common';
import { TestingModule } from '@nestjs/testing';
import { HttpExceptionFilter } from '../../src/domain/common/filters/HttpExceptionFilter';

export async function InitApp(
  app: INestApplication,
  moduleRef: TestingModule,
): Promise<INestApplication> {
  app = moduleRef.createNestApplication();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalFilters(new HttpExceptionFilter());

  await app.init();

  return app;
}
