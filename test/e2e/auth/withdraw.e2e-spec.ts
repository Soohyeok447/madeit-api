import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { setTimeOut } from '../e2e-env';
import { AppModule } from '../../../src/ioc/AppModule';
import { DatabaseService } from 'src/ioc/DatabaseModule';
import { InitApp } from '../config';
import * as request from 'supertest';
import { SignUpRequestDto } from '../../../src/adapter/auth/sign-up/SignUpRequestDto';

describe('witdraw e2e test', () => {
  let app: INestApplication;
  let httpServer: any;
  let dbConnection;

  let accessToken: string;

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

    accessToken = res.body.accessToken;
  });

  afterAll(async () => {
    await dbConnection.collection('users').deleteMany({});

    await app.close();
  });

  describe('PATCH v1/auth/withdraw', () => {
    describe('try withdraw', () => {
      it('expect succeed to withdraw', async () => {
        const res = await request(httpServer)
          .patch('/v1/auth/withdraw')
          .set('Authorization', `Bearer ${accessToken}`);

        expect(res.statusCode).toBe(200);
      });
    });

    describe('try withdraw after already withdraw', () => {
      it('UserNotFoundException should be thrown', async () => {
        const res = await request(httpServer)
          .patch('/v1/auth/withdraw')
          .set('Authorization', `Bearer ${accessToken}`);

        expect(res.statusCode).toBe(404);
        expect(res.body.errorCode).toEqual(70);
      });
    });
  });
});

/***
 * 회원탈퇴
 * 회원탈퇴 재시도 안되야함
 */
