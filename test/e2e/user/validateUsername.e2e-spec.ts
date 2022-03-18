import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { setTimeOut } from '../e2e-env';
import { AppModule } from '../../../src/ioc/AppModule';
import { DatabaseService } from 'src/ioc/DatabaseModule';
import { validateUsername } from '../request.index';
import { HttpExceptionFilter } from '../../../src/domain/common/filters/HttpExceptionFilter';
import { initSignUp } from '../config';

describe('validateUsername e2e test', () => {
  let app: INestApplication;
  let httpServer: any;
  let dbConnection;

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

    const res = await initSignUp(httpServer);

    accessToken = res.body.accessToken;
  });

  afterAll(async () => {
    await dbConnection.collection('users').deleteMany({});

    await app.close();
  });

  describe('POST v1/users/validate', () => {
    describe('try validate with username length is 1', () => {
      it('InvalidUsernameException should be thrown', async () => {
        const reqParam = {
          username: '1',
        };

        const res = await validateUsername(httpServer, accessToken, reqParam);

        expect(res.statusCode).toBe(400);
      });
    });

    describe('try validate using 테스트테스트테스트', () => {
      it('InvalidUsernameException should be thrown', async () => {
        const reqParam = {
          username: '테스트테스트테스트',
        };

        const res = await validateUsername(httpServer, accessToken, reqParam);

        expect(res.statusCode).toBe(400);
      });
    });

    describe('try validate using 一二三一二三一二三', () => {
      it('InvalidUsernameException should be thrown', async () => {
        const reqParam = {
          username: '一二三一二三一二三',
        };

        const res = await validateUsername(httpServer, accessToken, reqParam);

        expect(res.statusCode).toBe(400);
      });
    });

    describe('try validate using ㅁㄴㅇㄹㅂㅈㄷㄱㅅ', () => {
      it('InvalidUsernameException should be thrown', async () => {
        const reqParam = {
          username: 'ㅁㄴㅇㄹㅂㅈㄷㄱㅅ',
        };

        const res = await validateUsername(httpServer, accessToken, reqParam);

        expect(res.statusCode).toBe(400);
      });
    });

    describe('try validate using ㅂㅈㄷㄱㅁㄴㅇㄹ1', () => {
      it('InvalidUsernameException should be thrown', async () => {
        const reqParam = {
          username: 'ㅂㅈㄷㄱㅁㄴㅇㄹ1',
        };

        const res = await validateUsername(httpServer, accessToken, reqParam);

        expect(res.statusCode).toBe(400);
      });
    });

    describe('try validate using qwerqwerqwerqwer1', () => {
      it('InvalidUsernameException should be thrown', async () => {
        const reqParam = {
          username: 'qwerqwerqwerqwer1',
        };

        const res = await validateUsername(httpServer, accessToken, reqParam);

        expect(res.statusCode).toBe(400);
      });
    });

    describe('try validate with duplicated username', () => {
      it('ConflictUsernameException should be thrown', async () => {
        const reqValidateParam = {
          username: '중복이아녀요',
        };

        const res = await validateUsername(
          httpServer,
          accessToken,
          reqValidateParam,
        );

        expect(res.statusCode).toBe(200);
      });
    });

    describe('try validate using only number', () => {
      it('{} should be return', async () => {
        const reqValidateParam = {
          username: '1234567890',
        };

        const res = await validateUsername(
          httpServer,
          accessToken,
          reqValidateParam,
        );

        expect(res.statusCode).toBe(200);
      });
    });

    describe('try validate using only english', () => {
      it('{} should be return', async () => {
        const reqValidateParam = {
          username: 'qwerasdfzxcv',
        };

        const res = await validateUsername(
          httpServer,
          accessToken,
          reqValidateParam,
        );

        expect(res.statusCode).toBe(200);
      });
    });

    describe('try validate using english & korean', () => {
      it('{} should be return', async () => {
        const reqValidateParam = {
          username: '김수혁123asd',
        };

        const res = await validateUsername(
          httpServer,
          accessToken,
          reqValidateParam,
        );

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
