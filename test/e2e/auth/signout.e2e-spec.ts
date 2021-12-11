import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../../src/infrastructure/ioc/app.module';
import * as request from 'supertest';
import { getConnection } from 'typeorm';

describe('signout e2e test', () => {
  let app: INestApplication;

  let accessToken: string;
  let refreshToken: string;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
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

  it('/auth/signin (POST) should return JSON included accessToken and refreshToken', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/signin')
      .send({ email: 'email@email.com', password: 'password1' });

    accessToken = res.body.accessToken;
    refreshToken = res.body.refreshToken;

    expect(res.statusCode).toBe(200);
    expect(res.body.accessToken).toBeDefined();
    expect(res.body.refreshToken).toBeDefined();
  });

  it('/auth/signOut (POST) should return response.status success', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/signout')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(res.statusCode).toBe(204);
  });
});

/***
회원가입 성공 ㅇ
로그인 성공 (토큰반환) ㅇ
로그아웃 성공 (user DB refreshToken null로 변경)
 */
