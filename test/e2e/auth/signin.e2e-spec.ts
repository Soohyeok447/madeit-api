import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { setTimeOut } from '../e2e-env';
import { AppModule } from '../../../src/ioc/AppModule';
import { DatabaseService } from 'src/ioc/DatabaseModule';
import { SignInRequestDto } from 'src/adapter/auth/sign-in/SignInRequestDto';
import { signIn, signUp } from '../request.index';
import { HttpExceptionFilter } from '../../../src/domain/common/filters/HttpExceptionFilter';
import { Provider } from '../../../src/domain/use-cases/auth/common/types/provider';

describe('signin e2e test', () => {
  let app: INestApplication;
  let httpServer: any;
  let dbConnection;

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
  });

  afterAll(async () => {
    await dbConnection.collection('users').deleteMany({});

    await app.close();
  });

  describe('POST v1/e2e/auth/signin?provider=kakao', () => {
    describe('try signin using wrong provider', () => {
      const reqParam: SignInRequestDto = {
        thirdPartyAccessToken: 'SUPPOSETHISISVALIDTOKEN',
      };

      it('should throw unauthorization exception', async () => {
        const res = await signIn(httpServer, null, reqParam);

        expect(res.statusCode).toBe(400);
        expect(res.body.errorCode).toEqual(1);
      });
    });

    describe('try signin using wrong thirdPartyAccessToken', () => {
      const reqParam: SignInRequestDto = {
        thirdPartyAccessToken: 'wrongToken',
      };

      it('should return accessToken, refreshToken', async () => {
        const res = await signIn(httpServer, Provider.kakao, reqParam);

        expect(res.statusCode).toBe(400);
        expect(res.body.errorCode).toEqual(3);
      });
    });

    describe('try signin before signup', () => {
      const reqParam: SignInRequestDto = {
        thirdPartyAccessToken: 'SUPPOSETHISISVALIDTOKEN',
      };

      it('UserNotFoundException should be thrown', async () => {
        const res = await signIn(httpServer, Provider.kakao, reqParam);

        expect(res.statusCode).toBe(404);
        expect(res.body.errorCode).toEqual(70);
      });
    });

    describe('signup to test signin', () => {
      const signUpParam = {
        thirdPartyAccessToken: 'SUPPOSETHISISVALIDTOKEN',
        username: 'e2eTesting..',
        age: 3,
        goal: 'e2e 테스트를 완벽하게합시다',
        statusMessage: '화이팅중'
      };

      it('expect to the successful signup', async () => {
        const res = await signUp(httpServer, Provider.kakao, signUpParam);

        expect(res.statusCode).toBe(201);
      });
    })

    describe('try signin after signup', () => {
      const reqParam: SignInRequestDto = {
        thirdPartyAccessToken: 'SUPPOSETHISISVALIDTOKEN',
      };

      it('should return accessToken, refreshToken', async () => {
        const res = await signIn(httpServer, Provider.kakao, reqParam);

        expect(res.statusCode).toBe(200);
        expect(res.body.accessToken).toBeDefined();
      });
    });
  });
});

/***
유효하지 않은 provider로 signin시도
유효하지 않은 thirdPartyAccessToken으로 signin시도
유저 회원가입하기 전에 signin시도 (70 에러)
회원가입 + findByUserId로 user 얻고
signin 시도 후 토큰 얻었나 확인
 */
