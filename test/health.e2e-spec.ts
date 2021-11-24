import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app/app.module';
import { UserRepository } from '../src/app/modules/users/users.repository';
import * as request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';

describe('registration e2e test', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forFeature([UserRepository]),
        AppModule,
      ],
      providers: [
        {
          provide: UserRepository,
          useValue: UserRepository,
        }
      ]
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
