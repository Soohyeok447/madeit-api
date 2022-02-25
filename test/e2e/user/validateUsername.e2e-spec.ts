import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { setTimeOut } from '../e2e-env';
import { AppModule } from '../../../src/ioc/AppModule';
import { DatabaseService } from 'src/ioc/DatabaseModule';
import { SignInRequestDto } from 'src/adapter/auth/sign-in/SignInRequestDto';
import { onboard, signIn, validateUsername } from '../request.index';
import { HttpExceptionFilter } from '../../../src/domain/common/filters/HttpExceptionFilter';

describe('validateUsername e2e test', () => {
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

    app.useGlobalFilters(new HttpExceptionFilter());

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


  describe('POST v1/users/validate', () => {
    describe('try validate with username length is 1', () => {
      it('InvalidUsernameException should be thrown', async () => {
        const reqParam = {
          username: "1",
        };

        const res = await validateUsername(httpServer, accessToken, reqParam);

        expect(res.statusCode).toBe(400);
      });
    })

    describe('try validate with username length is 9', () => {
      it('InvalidUsernameException should be thrown', async () => {
        const reqParam = {
          username: "123456789",
        };

        const res = await validateUsername(httpServer, accessToken, reqParam);

        expect(res.statusCode).toBe(400);
      });
    })

    describe('try validate with duplicated username', () => {
      it('UsernameConflictException should be thrown', async () => {
        const reqParam = {
          username: "테스트",
          age: 33,
          goal: "공중 3회전 돌기",
          statusMessage: "피곤한상태"
        };

        await onboard(httpServer, accessToken, reqParam);

        const reqValidateParam = {
          username: "테스트",
        };

        const res = await validateUsername(httpServer, accessToken, reqValidateParam);

        expect(res.statusCode).toBe(409);
      });
    })


    describe('try onboard with duplicated username', () => {
      it('ConflictUsernameException should be thrown', async () => {
        const reqValidateParam = {
          username: "중복이아녀요",
        };

        const res = await validateUsername(httpServer, accessToken, reqValidateParam);

        expect(res.statusCode).toBe(204);
      });
    })
  })
});

/***
2자 미만 username
8자 초과 username
중복된 username
유효한 username
 */
