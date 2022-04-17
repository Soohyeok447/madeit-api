import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { setTimeOut } from '../e2e-env';
import { CoreModule, DatabaseService } from '../../../src/ioc/CoreModule';
import { Connection } from 'mongoose';
import { SignUpRequestDto } from '../../../src/adapter/auth/sign-up/SignUpRequestDto';
import * as request from 'supertest';
import { ValidateUsernameRequestDto } from '../../../src/adapter/user/validate-username/ValidateUsernameRequestDto';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtRefreshStrategy } from '../../../src/adapter/common/strategies/JwtRefreshStrategy';
import { JwtStrategy } from '../../../src/adapter/common/strategies/JwtStrategy';
import { HashProvider } from '../../../src/domain/providers/HashProvider';
import { JwtProvider } from '../../../src/domain/providers/JwtProvider';
import { OAuthProviderFactory } from '../../../src/domain/providers/OAuthProviderFactory';
import { ReissueAccessTokenUseCase } from '../../../src/domain/use-cases/auth/reissue-access-token/ReissueAccessTokenUseCase';
import { ReissueAccessTokenUseCaseImpl } from '../../../src/domain/use-cases/auth/reissue-access-token/ReissueAccessTokenUseCaseImpl';
import { SignInUseCase } from '../../../src/domain/use-cases/auth/sign-in/SignInUseCase';
import { SignInUseCaseImpl } from '../../../src/domain/use-cases/auth/sign-in/SignInUseCaseImpl';
import { SignOutUseCase } from '../../../src/domain/use-cases/auth/sign-out/SignOutUseCase';
import { SignOutUseCaseImpl } from '../../../src/domain/use-cases/auth/sign-out/SignOutUseCaseImpl';
import { SignUpUseCase } from '../../../src/domain/use-cases/auth/sign-up/SignUpUseCase';
import { SignUpUseCaseImpl } from '../../../src/domain/use-cases/auth/sign-up/SignUpUseCaseImpl';
import { ValidateUseCase } from '../../../src/domain/use-cases/auth/validate/ValidateUseCase';
import { ValidateUseCaseImpl } from '../../../src/domain/use-cases/auth/validate/ValidateUseCaseImpl';
import { WithdrawUseCase } from '../../../src/domain/use-cases/auth/withdraw/WithdrawUseCase';
import { WithdrawUseCaseImpl } from '../../../src/domain/use-cases/auth/withdraw/WithdrawUseCaseImpl';
import { HashProviderImpl } from '../../../src/infrastructure/providers/HashProviderImpl';
import { JwtProviderImpl } from '../../../src/infrastructure/providers/JwtProviderImpl';
import { MockOAuthFactoryImpl } from '../../../src/infrastructure/providers/oauth/mock/MockOAuthFactoryImpl';
import { AuthControllerInjectedDecorator } from '../../../src/ioc/controllers/auth/AuthControllerInjectedDecorator';
import { ProviderModule } from '../../../src/ioc/ProviderModule';
import { RepositoryModule } from '../../../src/ioc/RepositoryModule';
import { UserModule } from '../../../src/ioc/UserModule';
import { MockHttpExceptionFilter } from '../../../src/domain/common/filters/MockHttpExceptionFilter';
import { LoggerModule } from '../../../src/ioc/LoggerModule';

describe('validateUsername e2e test', () => {
  let app: INestApplication;
  let httpServer: any;
  let dbConnection: Connection;

  let accessToken: string;

  setTimeOut();

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({}),
        RepositoryModule,
        ProviderModule,
        CoreModule,
        LoggerModule.forRoot(),
        UserModule,
      ],
      controllers: [AuthControllerInjectedDecorator],
      providers: [
        {
          provide: OAuthProviderFactory,
          useClass: MockOAuthFactoryImpl,
        },
        {
          provide: SignInUseCase,
          useClass: SignInUseCaseImpl,
        },
        {
          provide: SignUpUseCase,
          useClass: SignUpUseCaseImpl,
        },
        {
          provide: ReissueAccessTokenUseCase,
          useClass: ReissueAccessTokenUseCaseImpl,
        },
        {
          provide: SignOutUseCase,
          useClass: SignOutUseCaseImpl,
        },
        {
          provide: WithdrawUseCase,
          useClass: WithdrawUseCaseImpl,
        },
        {
          provide: ValidateUseCase,
          useClass: ValidateUseCaseImpl,
        },
        {
          provide: JwtProvider,
          useClass: JwtProviderImpl,
        },
        {
          provide: HashProvider,
          useClass: HashProviderImpl,
        },
        JwtStrategy,
        JwtRefreshStrategy,
      ],
      exports: [PassportModule, JwtStrategy, JwtRefreshStrategy],
    }).compile();

    app = moduleRef.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    app.useGlobalFilters(new MockHttpExceptionFilter());

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
      .post(`/v1/auth/signup?provider=kakao`)
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

        expect(res.statusCode).toBe(200);
        expect(res.body.errorCode).toEqual(1);
        expect(res.body.result).toEqual(false);
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

        expect(res.statusCode).toBe(200);
        expect(res.body.errorCode).toEqual(1);
        expect(res.body.result).toEqual(false);
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

        expect(res.statusCode).toBe(200);
        expect(res.body.errorCode).toEqual(1);
        expect(res.body.result).toEqual(false);
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

        expect(res.statusCode).toBe(200);
        expect(res.body.errorCode).toEqual(1);
        expect(res.body.result).toEqual(false);
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

        expect(res.statusCode).toBe(200);
        expect(res.body.errorCode).toEqual(1);
        expect(res.body.result).toEqual(false);
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

        expect(res.statusCode).toBe(200);
        expect(res.body.errorCode).toEqual(1);
        expect(res.body.result).toEqual(false);
      });
    });

    describe('try validate with duplicated username', () => {
      it('{result: false} should be thrown', async () => {
        const reqValidateParam: ValidateUsernameRequestDto = {
          username: '테스트입니다',
        };

        const res: request.Response = await request(httpServer)
          .post('/v1/users/validate')
          .set('Authorization', `Bearer ${accessToken}`)
          .set('Accept', 'application/json')
          .type('application/json')
          .send(reqValidateParam);

        expect(res.statusCode).toBe(200);
        expect(res.body.result).toEqual(false);
        expect(res.body.errorCode).toEqual(2);
      });
    });

    describe('try validate using only number', () => {
      it('{result: true} should be return', async () => {
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
        expect(res.body.result).toEqual(true);
      });
    });

    describe('try validate using only english', () => {
      it('{result: true} should be return', async () => {
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
        expect(res.body.result).toEqual(true);
      });
    });

    describe('try validate using english & korean', () => {
      it('{result: true} should be return', async () => {
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
        expect(res.body.result).toEqual(true);
      });
    });
  });
});

/***
2자 미만 username
8자 초과 username
유효한 username
 */
