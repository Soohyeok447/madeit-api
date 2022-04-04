import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { setTimeOut } from '../e2e-env';
import { AppModule } from '../../../src/ioc/AppModule';
import { DatabaseService } from '../../../src/ioc/CoreModule';
import { HttpExceptionFilter } from '../../../src/domain/common/filters/HttpExceptionFilter';
import { Connection } from 'mongoose';
import { SignUpRequestDto } from '../../../src/adapter/auth/sign-up/SignUpRequestDto';
import * as request from 'supertest';
import { ValidateUsernameRequestDto } from '../../../src/adapter/user/validate-username/ValidateUsernameRequestDto';

describe('validateUsername e2e test', () => {
  let app: INestApplication;
  let httpServer: any;
  let dbConnection: Connection;

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

    const res: request.Response = await request(httpServer)
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

  describe('POST v1/users/validate', () => {
    describe('try validate with username length is 1', () => {
      it('InvalidUsernameException should be thrown', async () => {
        const reqParam: ValidateUsernameRequestDto = {
          username: '1',
        };

        const res: request.Response = await request(httpServer)
          .post('/v1/users/validate')
          .set('Authorization', `Bearer ${accessToken}`)
          .set('Accept', 'application/json')
          .type('application/json')
          .send(reqParam);

        expect(res.statusCode).toBe(400);
      });
    });

    describe('try validate using 테스트테스트테스트', () => {
      it('InvalidUsernameException should be thrown', async () => {
        const reqParam: ValidateUsernameRequestDto = {
          username: '테스트테스트테스트',
        };

        const res: request.Response = await request(httpServer)
          .post('/v1/users/validate')
          .set('Authorization', `Bearer ${accessToken}`)
          .set('Accept', 'application/json')
          .type('application/json')
          .send(reqParam);

        expect(res.statusCode).toBe(400);
      });
    });

    describe('try validate using 一二三一二三一二三', () => {
      it('InvalidUsernameException should be thrown', async () => {
        const reqParam: ValidateUsernameRequestDto = {
          username: '一二三一二三一二三',
        };

        const res: request.Response = await request(httpServer)
          .post('/v1/users/validate')
          .set('Authorization', `Bearer ${accessToken}`)
          .set('Accept', 'application/json')
          .type('application/json')
          .send(reqParam);

        expect(res.statusCode).toBe(400);
      });
    });

    describe('try validate using ㅁㄴㅇㄹㅂㅈㄷㄱㅅ', () => {
      it('InvalidUsernameException should be thrown', async () => {
        const reqParam: ValidateUsernameRequestDto = {
          username: 'ㅁㄴㅇㄹㅂㅈㄷㄱㅅ',
        };

        const res: request.Response = await request(httpServer)
          .post('/v1/users/validate')
          .set('Authorization', `Bearer ${accessToken}`)
          .set('Accept', 'application/json')
          .type('application/json')
          .send(reqParam);

        expect(res.statusCode).toBe(400);
      });
    });

    describe('try validate using ㅂㅈㄷㄱㅁㄴㅇㄹ1', () => {
      it('InvalidUsernameException should be thrown', async () => {
        const reqParam: ValidateUsernameRequestDto = {
          username: 'ㅂㅈㄷㄱㅁㄴㅇㄹ1',
        };

        const res: request.Response = await request(httpServer)
          .post('/v1/users/validate')
          .set('Authorization', `Bearer ${accessToken}`)
          .set('Accept', 'application/json')
          .type('application/json')
          .send(reqParam);

        expect(res.statusCode).toBe(400);
      });
    });

    describe('try validate using qwerqwerqwerqwer1', () => {
      it('InvalidUsernameException should be thrown', async () => {
        const reqParam: ValidateUsernameRequestDto = {
          username: 'qwerqwerqwerqwer1',
        };

        const res: request.Response = await request(httpServer)
          .post('/v1/users/validate')
          .set('Authorization', `Bearer ${accessToken}`)
          .set('Accept', 'application/json')
          .type('application/json')
          .send(reqParam);

        expect(res.statusCode).toBe(400);
      });
    });

    describe('try validate with duplicated username', () => {
      it('ConflictUsernameException should be thrown', async () => {
        const reqValidateParam: ValidateUsernameRequestDto = {
          username: '중복이아녀요',
        };

        const res: request.Response = await request(httpServer)
          .post('/v1/users/validate')
          .set('Authorization', `Bearer ${accessToken}`)
          .set('Accept', 'application/json')
          .type('application/json')
          .send(reqValidateParam);

        expect(res.statusCode).toBe(200);
      });
    });

    describe('try validate using only number', () => {
      it('{} should be return', async () => {
        const reqValidateParam: ValidateUsernameRequestDto = {
          username: '1234567890',
        };

        const res: request.Response = await request(httpServer)
          .post('/v1/users/validate')
          .set('Authorization', `Bearer ${accessToken}`)
          .set('Accept', 'application/json')
          .type('application/json')
          .send(reqValidateParam);

        expect(res.statusCode).toBe(200);
      });
    });

    describe('try validate using only english', () => {
      it('{} should be return', async () => {
        const reqValidateParam: ValidateUsernameRequestDto = {
          username: 'qwerasdfzxcv',
        };

        const res: request.Response = await request(httpServer)
          .post('/v1/users/validate')
          .set('Authorization', `Bearer ${accessToken}`)
          .set('Accept', 'application/json')
          .type('application/json')
          .send(reqValidateParam);

        expect(res.statusCode).toBe(200);
      });
    });

    describe('try validate using english & korean', () => {
      it('{} should be return', async () => {
        const reqValidateParam: ValidateUsernameRequestDto = {
          username: '김수혁123asd',
        };

        const res: request.Response = await request(httpServer)
          .post('/v1/users/validate')
          .set('Authorization', `Bearer ${accessToken}`)
          .set('Accept', 'application/json')
          .type('application/json')
          .send(reqValidateParam);

        expect(res.statusCode).toBe(200);
      });
    });
  });
});

/***
2자 미만 username
8자 초과 username
유효한 username
 */
