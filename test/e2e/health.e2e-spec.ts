import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../src/infrastructure/ioc/app.module';
import * as request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/infrastructure/entities/user.entity';

describe('health e2e test', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forFeature([User]),
        AppModule,
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/health (GET) should return "I am healthy"', async () => {
    const res = await request(app.getHttpServer())
      .get('/health')

      expect(res.statusCode).toBe(200);
      expect(res.text).toEqual('I am healthy');
  });
})
