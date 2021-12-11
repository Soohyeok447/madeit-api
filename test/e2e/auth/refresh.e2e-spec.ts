import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../../src/infrastructure/ioc/app.module';
import * as request from 'supertest';
import { getConnection } from 'typeorm';

describe('refresh e2e test', () => {
  let app: INestApplication;

  let accessToken: string;
  let refreshToken: string;


  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [
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
    await getConnection().dropDatabase();

    await app.close();
  });


  it('/auth/refresh (POST) should throw unauthorization exception', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/refresh')
      .set('Authorization', `Bearer wrongToken`)

    expect(res.statusCode).toBe(401);
  });

  it('/auth/refresh (POST) should return accessToken', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/refresh')
      .set('Authorization', `Bearer ${refreshToken}`)

    expect(res.statusCode).toBe(201);
    expect(res.body.accessToken).toBeDefined();
  });
})

/***
회원가입 성공 ㅇ
로그인 성공 (토큰반환) ㅇ
리프레쉬 실패(유효하지 않은 토큰) ㅇ
리프레쉬 받기(토큰 반환) ㅇ
 */