import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { setTimeOut } from '../e2e-env';
import { CoreModule, DatabaseService } from '../../../src/ioc/CoreModule';
import { SignInRequestDto } from 'src/adapter/auth/sign-in/SignInRequestDto';
import { HttpExceptionFilter } from '../../../src/domain/common/filters/HttpExceptionFilter';
import * as request from 'supertest';
import { Connection } from 'mongoose';
import { SignUpRequestDto } from '../../../src/adapter/auth/sign-up/SignUpRequestDto';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from '../../../src/adapter/common/strategies/JwtStrategy';
import { JwtRefreshStrategy } from '../../../src/adapter/common/strategies/JwtRefreshStrategy';
import { HashProviderImpl } from '../../../src/infrastructure/providers/HashProviderImpl';
import { HashProvider } from '../../../src/domain/providers/HashProvider';
import { JwtProviderImpl } from '../../../src/infrastructure/providers/JwtProviderImpl';
import { JwtProvider } from '../../../src/domain/providers/JwtProvider';
import { JwtModule } from '@nestjs/jwt';
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
import { MockOAuthFactoryImpl } from '../../../src/infrastructure/providers/oauth/mock/MockOAuthFactoryImpl';
import { AuthControllerInjectedDecorator } from '../../../src/ioc/controllers/auth/AuthControllerInjectedDecorator';
import { ProviderModule } from '../../../src/ioc/ProviderModule';
import { RepositoryModule } from '../../../src/ioc/RepositoryModule';

describe('signin e2e test', () => {
  let app: INestApplication;
  let httpServer: any;
  let dbConnection: Connection;

  setTimeOut();

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({}),
        RepositoryModule,
        ProviderModule,
        CoreModule,
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

  describe('POST v1/auth/signin?provider=kakao', () => {
    describe('try signin using wrong provider', () => {
      const reqParam: SignInRequestDto = {
        thirdPartyAccessToken: 'SUPPOSETHISISVALIDTOKEN',
      };

      it('should throw unauthorization exception', async () => {
        const res: request.Response = await request(httpServer)
          .post(`/v1/auth/signin`)
          .set('Accept', 'application/json')
          .type('application/json')
          .send(reqParam);

        expect(res.statusCode).toBe(400);
        expect(res.body.errorCode).toEqual(1);
      });
    });

    describe('try signin using wrong thirdPartyAccessToken', () => {
      const reqParam: SignInRequestDto = {
        thirdPartyAccessToken: 'wrongToken',
      };

      it('should return accessToken, refreshToken', async () => {
        const res: request.Response = await request(httpServer)
          .post(`/v1/auth/signin?provider=kakao`)
          .set('Accept', 'application/json')
          .type('application/json')
          .send(reqParam);

        expect(res.statusCode).toBe(400);
        expect(res.body.errorCode).toEqual(3);
      });
    });

    describe('try signin before signup', () => {
      const reqParam: SignInRequestDto = {
        thirdPartyAccessToken: 'SUPPOSETHISISVALIDTOKEN',
      };

      it('UserNotFoundException should be thrown', async () => {
        const res: request.Response = await request(httpServer)
          .post(`/v1/auth/signin?provider=kakao`)
          .set('Accept', 'application/json')
          .type('application/json')
          .send(reqParam);

        expect(res.statusCode).toBe(404);
        expect(res.body.errorCode).toEqual(70);
      });
    });

    describe('signup to test signin', () => {
      const reqParam: SignUpRequestDto = {
        thirdPartyAccessToken: 'SUPPOSETHISISVALIDTOKEN',
        username: 'e2eTesting..',
        age: 3,
        goal: 'e2e 테스트를 완벽하게합시다',
        statusMessage: '화이팅중',
      };

      it('expect to the successful signup', async () => {
        const res: request.Response = await request(httpServer)
          .post(`/v1/auth/signup?provider=kakao`)
          .set('Accept', 'application/json')
          .type('application/json')
          .send(reqParam);

        expect(res.statusCode).toBe(201);
      });
    });

    describe('try signin after signup', () => {
      const reqParam: SignInRequestDto = {
        thirdPartyAccessToken: 'SUPPOSETHISISVALIDTOKEN',
      };

      it('should return accessToken, refreshToken', async () => {
        const res: request.Response = await request(httpServer)
          .post(`/v1/auth/signin?provider=kakao`)
          .set('Accept', 'application/json')
          .type('application/json')
          .send(reqParam);

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
