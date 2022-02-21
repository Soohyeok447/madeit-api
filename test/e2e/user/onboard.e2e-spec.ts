import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { setTimeOut } from '../e2e-env';
import { AppModule } from '../../../src/ioc/AppModule';
import { DatabaseService } from 'src/ioc/DatabaseModule';
import { SignInRequestDto } from 'src/adapter/auth/sign-in/SignInRequestDto';
import { onboard, signIn } from '../request.index';

describe('onboard e2e test', () => {
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

    app = moduleRef.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    await app.init();
    dbConnection = moduleRef.get<DatabaseService>(DatabaseService).getConnection();
    httpServer = app.getHttpServer();

    const reqParam: SignInRequestDto = {
      thirdPartyAccessToken: 'asdfasdfasdfasdf'
    }

    const res = await signIn(httpServer, reqParam);

    accessToken = res.body.accessToken;
    refreshToken = res.body.refreshToken;

  });

  afterAll(async () => {
    await dbConnection.collection('users').deleteMany({});

    await app.close();
  });


  describe('PUT v1/users/onboard', () => {
    describe('try onboard with not intact request body', () => {
      it('bad reqeust exception should be thrown ', async () => {
        const reqParam = {};

        const res = await onboard(httpServer, accessToken, reqParam);

        expect(res.statusCode).toBe(400);
      });
    })

    describe('try onboard with not intact request body', () => {
      it('bad reqeust exception should be thrown ', async () => {
        const reqParam = {
          age: 33
        };

        const res = await onboard(httpServer, accessToken, reqParam);

        expect(res.statusCode).toBe(400);
      });
    })

    describe('try onboard with not intact request body', () => {
      it('bad reqeust exception should be thrown ', async () => {
        const reqParam = {
          username: 'test'
        };

        const res = await onboard(httpServer, accessToken, reqParam);

        expect(res.statusCode).toBe(400);
      });
    })

    describe('try onboard with invalid username', () => {
      it('InvalidUsername exception should be thrown due to too long username', async () => {
        const reqParam = {
          username: "잠깐만날바라봐줘널따라가고있어난온힘을다해비출게",
          age: 33,
          goal: "공중 3회전 돌기",
          statusMessage: "피곤한상태"
        };

        const res = await onboard(httpServer, accessToken, reqParam);

        expect(res.statusCode).toBe(400);
      });

      it('InvalidUsername exception should be thrown due to too short username', async () => {
        const reqParam = {
          username: "헉",
          age: 33,
          goal: "공중 3회전 돌기",
          statusMessage: "피곤한상태"
        };

        const res = await onboard(httpServer, accessToken, reqParam);

        expect(res.statusCode).toBe(400);
      });
    })



    describe('try onboard with intact request body', () => {
      it('onboard success', async () => {
        const reqParam = {
          username: "테스트",
          age: 33,
          goal: "공중 3회전 돌기",
          statusMessage: "피곤한상태"
        };

        const res = await onboard(httpServer, accessToken, reqParam);

        expect(res.statusCode).toBe(200);
      });
    })


    describe('try onboard with duplicated username', () => {
      it('ConflictUsernameException should be thrown', async () => {
        const reqParam = {
          username: "테스트",
          age: 33,
          goal: "공중 3회전 돌기",
          statusMessage: "피곤한상태"
        };

        const res = await onboard(httpServer, accessToken, reqParam);

        expect(res.statusCode).toBe(409);
      });
    })
  })
});

/***
온전치 않은 request body로 인한 exception
온전치 않은 request body로 인한 exception
유효하지 않은 name으로 인한 exception
유효한 request body로 onboarding
중복된 닉네임으로 인한 exception
 */
