import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { setTimeOut } from '../e2e-env';
import { AppModule } from '../../../src/ioc/AppModule';
import { DatabaseService } from 'src/ioc/DatabaseModule';
import { SignInRequestDto } from 'src/adapter/auth/sign-in/SignInRequestDto';
import { onboard, signIn, modifyUser } from '../request.index';

describe('modify e2e test', () => {
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


  describe('PATCH v1/users/me', () => {
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

    describe('try onboard with intact request body', () => {
      it('modify success', async () => {
        const reqParam = {
          username: "test",
          age: 33,
          goal: "3옥 레 질러보기",
          statusMessage: "목상태안좋음"
        };

        const res = await modifyUser(httpServer, accessToken, reqParam);

        expect(res.statusCode).toBe(200);
      });
    })

  })
});



/***
onboarding
유효한 request body로 modifying
 */
