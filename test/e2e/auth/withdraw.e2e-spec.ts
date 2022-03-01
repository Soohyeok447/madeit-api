import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { setTimeOut } from '../e2e-env';
import { AppModule } from '../../../src/ioc/AppModule';
import { DatabaseService } from 'src/ioc/DatabaseModule';
import { SignInRequestDto } from 'src/adapter/auth/sign-in/SignInRequestDto';
import {
  onboard,
  addRoutine,
  signIn,
  addRecommendedRoutine,
  authorize,
} from '../request.index';
import { InitApp } from '../config';
import { Category } from '../../../src/domain/enums/Category';
import { FixedField } from '../../../src/domain/enums/FixedField';
import { withdraw } from './request';

describe('witdraw e2e test', () => {
  let app: INestApplication;
  let httpServer: any;
  let dbConnection;

  let accessToken: string;
  let refreshToken: string;

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

    const signInParam: SignInRequestDto = {
      thirdPartyAccessToken: 'asdfasdfasdfasdf',
    };

    const res = await signIn(httpServer, signInParam);

    accessToken = res.body.accessToken;
    refreshToken = res.body.refreshToken;

    const onboardParam = {
      username: '테스트',
      birth: '0000-00-00',
      job: 'student',
      gender: 'male',
    };

    await onboard(httpServer, accessToken, onboardParam);
  });

  afterAll(async () => {
    await dbConnection.collection('users').deleteMany({});

    await app.close();
  });

  describe('PATCH v1/auth/withdraw', () => {
    describe('try withdraw', () => {
      it('expect succeed to withdraw', async () => {
        const res = await withdraw(httpServer, accessToken);

        expect(res.statusCode).toBe(204);
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
