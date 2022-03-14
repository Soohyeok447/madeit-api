import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { setTimeOut } from '../e2e-env';
import { AppModule } from '../../../src/ioc/AppModule';
import { DatabaseService } from 'src/ioc/DatabaseModule';
import { InitApp, initSignUp } from '../config';
import { signOut } from './request';

describe('signOut e2e test', () => {
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
  });

  afterAll(async () => {
    await dbConnection.collection('users').deleteMany({});

    await app.close();
  });

  describe('PATCH v1/auth/signout', () => {
    describe('before signup', () => {
      it('UnauthenticationException should be thrown', async () => {
        const res = await signOut(httpServer, 'asdfasdfasdf');

        expect(res.statusCode).toBe(401);
      });
    });
  });

  describe('POST v1/auth/signup', () => {
    it('UserNotFoundException should be thrown', async () => {
      const res = await initSignUp(httpServer);

      accessToken = res.body.accessToken;
    });
  });

  describe('PATCH v1/auth/signout after signup', () => {
    describe('after signup', () => {
      it('{} should be return', async () => {
        const res = await signOut(httpServer, accessToken);

        expect(res.statusCode).toBe(200);
      });
    });
  });

  describe('PATCH v1/auth/signout after signout', () => {
    describe('after signout', () => {
      it('UserAlreadySignOutException should be return', async () => {
        const res = await signOut(httpServer, accessToken);

        expect(res.statusCode).toBe(403);
        expect(res.body.errorCode).toEqual(1);
      });
    });
  });
});

/***
 * 로그인 안하고 로그아웃시도
 * 로그인 하고 로그아웃시도
 * 다시 로그아웃 시도
 */
