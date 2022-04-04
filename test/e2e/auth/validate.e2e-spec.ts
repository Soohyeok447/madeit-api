import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { setTimeOut } from '../e2e-env';
import { AppModule } from '../../../src/ioc/AppModule';
import { DatabaseService } from '../../../src/ioc/CoreModule';
import { InitApp } from '../config';
import * as request from 'supertest';
import { Connection } from 'mongoose';
import { ValidateRequestDto } from '../../../src/adapter/auth/validate/ValidateRequestDto';
import { SignUpRequestDto } from '../../../src/adapter/auth/sign-up/SignUpRequestDto';

describe('validate e2e test', () => {
  let app: INestApplication;
  let httpServer: any;
  let dbConnection: Connection;

  setTimeOut();

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = await InitApp(app, moduleRef);

    dbConnection = moduleRef
      .get<DatabaseService>(DatabaseService)
      .getConnection();
    httpServer = app.getHttpServer();
  });

  afterAll(async () => {
    await dbConnection.collection('users').deleteMany({});

    await app.close();
  });

  describe('POST v1/e2e/auth/validate', () => {
    describe('try validate using wrong provider', () => {
      it('InvalidProviderException should be trown', async () => {
        const validateRequest: ValidateRequestDto = {
          thirdPartyAccessToken: 'SUPPOSETHISISVALIDTOKEN',
        };

        const res: request.Response = await request(httpServer)
          .post(`/v1/e2e/auth/validate`)
          .set('Accept', 'application/json')
          .type('application/json')
          .send(validateRequest);

        expect(res.statusCode).toBe(400);
        expect(res.body.errorCode).toEqual(1);
      });
    });

    describe('try validate using wrong thirdPartyAccessToken', () => {
      it('InvalidKakaoTokenException should be trown', async () => {
        const validateRequest: ValidateRequestDto = {
          thirdPartyAccessToken: 'wrongToken',
        };

        const res: request.Response = await request(httpServer)
          .post(`/v1/e2e/auth/validate?provider=kakao`)
          .set('Accept', 'application/json')
          .type('application/json')
          .send(validateRequest);

        expect(res.statusCode).toBe(400);
        expect(res.body.errorCode).toEqual(3);
      });
    });

    describe('signup to test alreadyRegistered situation', () => {
      const signUpParam: SignUpRequestDto = {
        thirdPartyAccessToken: 'SUPPOSETHISISVALIDTOKEN',
        username: 'e2eTesting..',
        age: 3,
        goal: 'e2e 테스트를 완벽하게합시다',
        statusMessage: '화이팅중',
      };

      it('expect to the successful signup', async () => {
        const res: request.Response = await request(httpServer)
          .post(`/v1/e2e/auth/signup?provider=kakao`)
          .set('Accept', 'application/json')
          .type('application/json')
          .send(signUpParam);

        expect(res.statusCode).toBe(201);
      });
    });

    describe('try validate using valid reqeust', () => {
      it('{} should be return', async () => {
        const validateRequest: ValidateRequestDto = {
          thirdPartyAccessToken: 'SUPPOSETHISISVALIDTOKEN',
        };

        const res: request.Response = await request(httpServer)
          .post(`/v1/e2e/auth/validate?provider=kakao`)
          .set('Accept', 'application/json')
          .type('application/json')
          .send(validateRequest);

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({});
      });
    });
  });
});

/***
 * 잘못된 프로바이더 (kakao, google)
 * 잘못된 토큰 (kakao, google)
 * validate시도 (유저없음) 404가 맞음
 * 회원가입
 * validate 재시도 (유저 있음) 200 가맞음
 */
