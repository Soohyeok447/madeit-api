import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { setTimeOut } from '../e2e-env';
import { CoreModule, DatabaseService } from '../../../src/ioc/CoreModule';
import { InitApp } from '../config';
import * as request from 'supertest';
import { Connection } from 'mongoose';
import { ValidateRequestDto } from '../../../src/adapter/auth/validate/ValidateRequestDto';
import { SignUpRequestDto } from '../../../src/adapter/auth/sign-up/SignUpRequestDto';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from '../../../src/adapter/common/strategies/JwtStrategy';
import { JwtRefreshStrategy } from '../../../src/adapter/common/strategies/JwtRefreshStrategy';
import { HashProviderImpl } from '../../../src/infrastructure/providers/HashProviderImpl';
import { HashProvider } from '../../../src/domain/providers/HashProvider';
import { JwtProviderImpl } from '../../../src/infrastructure/providers/JwtProviderImpl';
import { JwtProvider } from '../../../src/domain/providers/JwtProvider';
import { ValidateUseCaseImpl } from '../../../src/domain/use-cases/auth/validate/ValidateUseCaseImpl';
import { ValidateUseCase } from '../../../src/domain/use-cases/auth/validate/ValidateUseCase';
import { WithdrawUseCaseImpl } from '../../../src/domain/use-cases/auth/withdraw/WithdrawUseCaseImpl';
import { WithdrawUseCase } from '../../../src/domain/use-cases/auth/withdraw/WithdrawUseCase';
import { SignOutUseCaseImpl } from '../../../src/domain/use-cases/auth/sign-out/SignOutUseCaseImpl';
import { SignOutUseCase } from '../../../src/domain/use-cases/auth/sign-out/SignOutUseCase';
import { ReissueAccessTokenUseCaseImpl } from '../../../src/domain/use-cases/auth/reissue-access-token/ReissueAccessTokenUseCaseImpl';
import { ReissueAccessTokenUseCase } from '../../../src/domain/use-cases/auth/reissue-access-token/ReissueAccessTokenUseCase';
import { SignUpUseCaseImpl } from '../../../src/domain/use-cases/auth/sign-up/SignUpUseCaseImpl';
import { SignUpUseCase } from '../../../src/domain/use-cases/auth/sign-up/SignUpUseCase';
import { SignInUseCaseImpl } from '../../../src/domain/use-cases/auth/sign-in/SignInUseCaseImpl';
import { SignInUseCase } from '../../../src/domain/use-cases/auth/sign-in/SignInUseCase';
import { MockOAuthFactoryImpl } from '../../../src/infrastructure/providers/oauth/mock/MockOAuthFactoryImpl';
import { OAuthProviderFactory } from '../../../src/domain/providers/OAuthProviderFactory';
import { AuthControllerInjectedDecorator } from '../../../src/ioc/controllers/auth/AuthControllerInjectedDecorator';
import { ProviderModule } from '../../../src/ioc/ProviderModule';
import { RepositoryModule } from '../../../src/ioc/RepositoryModule';
import { JwtModule } from '@nestjs/jwt';

describe('validate e2e test', () => {
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

    app = await InitApp(app, moduleRef);

    dbConnection = moduleRef
      .get<DatabaseService>(DatabaseService)
      .getConnection();
    httpServer = app.getHttpServer();
  });

  afterAll(async () => {
    await dbConnection.collection('users').deleteMany({});
    await dbConnection.collection('images').deleteMany({});

    await app.close();
  });

  describe('POST v1/auth/validate', () => {
    describe('try validate using wrong provider', () => {
      it('InvalidProviderException should be trown', async () => {
        const validateRequest: ValidateRequestDto = {
          thirdPartyAccessToken: 'SUPPOSETHISISVALIDTOKEN',
        };

        const res: request.Response = await request(httpServer)
          .post(`/v1/auth/validate`)
          .set('Accept', 'application/json')
          .type('application/json')
          .send(validateRequest);

        expect(res.statusCode).toBe(400);
        expect(res.body.errorCode).toEqual(1);
      });
    });

    describe('try validate using wrong thirdPartyAccessToken', () => {
      it('InvalidKakaoTokenException should be trown', async () => {
        const validateRequest: ValidateRequestDto = {
          thirdPartyAccessToken: 'wrongToken',
        };

        const res: request.Response = await request(httpServer)
          .post(`/v1/auth/validate?provider=kakao`)
          .set('Accept', 'application/json')
          .type('application/json')
          .send(validateRequest);

        expect(res.statusCode).toBe(400);
        expect(res.body.errorCode).toEqual(3);
      });
    });

    describe('signup to test alreadyRegistered situation', () => {
      const signUpParam: SignUpRequestDto = {
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
          .send(signUpParam);

        expect(res.statusCode).toBe(201);
      });
    });

    describe('try validate using valid reqeust', () => {
      it('{} should be return', async () => {
        const validateRequest: ValidateRequestDto = {
          thirdPartyAccessToken: 'SUPPOSETHISISVALIDTOKEN',
        };

        const res: request.Response = await request(httpServer)
          .post(`/v1/auth/validate?provider=kakao`)
          .set('Accept', 'application/json')
          .type('application/json')
          .send(validateRequest);

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({});
      });
    });
  });
});

/***
 * 잘못된 프로바이더 (kakao, google)
 * 잘못된 토큰 (kakao, google)
 * validate시도 (유저없음) 404가 맞음
 * 회원가입
 * validate 재시도 (유저 있음) 200 가맞음
 */
