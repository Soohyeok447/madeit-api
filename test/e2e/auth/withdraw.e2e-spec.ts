import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { setTimeOut } from '../e2e-env';
import { AppModule } from '../../../src/ioc/AppModule';
import { DatabaseService } from 'src/ioc/DatabaseModule';
import { InitApp, initSignUp } from '../config';
import { withdraw } from './request';

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

    const res = await initSignUp(httpServer);

    accessToken = res.body.accessToken;  
  });

  afterAll(async () => {
    await dbConnection.collection('users').deleteMany({});

    await app.close();
  });

  describe('PATCH v1/auth/withdraw', () => {
    describe('try withdraw', () => {
      it('expect succeed to withdraw', async () => {
        const res = await withdraw(httpServer, accessToken);

        expect(res.statusCode).toBe(200);
      });
    });

    describe('try withdraw after already withdraw', () => {
      it('UserNotFoundException should be thrown', async () => {
        const res = await withdraw(httpServer, accessToken);

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
