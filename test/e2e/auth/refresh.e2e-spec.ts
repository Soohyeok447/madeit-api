import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { setTimeOut } from '../e2e-env';
import { AppModule } from '../../../src/ioc/AppModule';
import { DatabaseService } from 'src/ioc/DatabaseModule';
import { refresh, signOut } from '../request.index';
import { HttpExceptionFilter } from '../../../src/domain/common/filters/HttpExceptionFilter';
import { SignUpRequestDto } from '../../../src/adapter/auth/sign-up/SignUpRequestDto';
import * as request from 'supertest';

describe('refresh e2e test', () => {
  let app: INestApplication;
  let httpServer: any;
  let dbConnection;

  let refreshToken: string;
  let accessToken: string;

  setTimeOut();

  beforeAll(async () => {
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

    app.useGlobalFilters(new HttpExceptionFilter());

    await app.init();
    dbConnection = moduleRef
      .get<DatabaseService>(DatabaseService)
      .getConnection();
    httpServer = app.getHttpServer();

    const signUpParam: SignUpRequestDto = {
      thirdPartyAccessToken: 'asdfasdfasdfasdf',
      username: '테스트입니다',
      age: 1,
      goal: 'e2e테스트중',
      statusMessage: '모든게 잘 될거야',
    };

    const res = await request(httpServer)
      .post(`/v1/e2e/auth/signup?provider=kakao`)
      .set('Accept', 'application/json')
      .type('application/json')
      .send(signUpParam);

    refreshToken = res.body.refreshToken;
    accessToken = res.body.accessToken;
  });

  afterAll(async () => {
    await dbConnection.collection('users').deleteMany({});

    await app.close();
  });

  describe('POST v1/auth/refresh', () => {
    describe('try reissue accessToken with wrong refreshToken', () => {
      it('should throw unauthorization exception', async () => {
        const res = await refresh(httpServer, 'wrongToken');

        expect(res.statusCode).toBe(401);
      });
    });
    describe('try reissue accessToken with correct refreshToken', () => {
      it('should return accessToken', async () => {
        const res = await refresh(httpServer, refreshToken);

        expect(res.statusCode).toBe(201);
        expect(res.body.accessToken).toBeDefined();
      });
    });
  });

  describe('PATCH v1/auth/signout', () => {
    describe('try signout', () => {
      it('expect to success signout', async () => {
        const res = await signOut(httpServer, accessToken);

        expect(res.statusCode).toBe(200);
      });
    });
  });

  describe('POST v1/auth/refresh after signout', () => {
    describe('try reissue accessToken after signout', () => {
      it('should return accessToken', async () => {
        const res = await refresh(httpServer, refreshToken);

        expect(res.statusCode).toBe(403);
        expect(res.body.errorCode).toEqual(1);
      });
    });
  });
});

/***
리프레쉬 실패(유효하지 않은 토큰) ㅇ
리프레쉬 받기(토큰 반환) ㅇ
로그아웃하고 리프레시 시도
 */
