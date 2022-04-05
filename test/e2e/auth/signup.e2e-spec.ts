import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { setTimeOut } from '../e2e-env';
import { CoreModule, DatabaseService } from '../../../src/ioc/CoreModule';
import { InitApp } from '../config';
import { SignUpRequestDto } from '../../../src/adapter/auth/sign-up/SignUpRequestDto';
import { Level } from '../../../src/domain/common/enums/Level';
import * as request from 'supertest';
import { Connection } from 'mongoose';
import { SignUpUseCase } from '../../../src/domain/use-cases/auth/sign-up/SignUpUseCase';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthControllerInjectedDecorator } from '../../../src/ioc/controllers/auth/AuthControllerInjectedDecorator';
import { SignUpUseCaseImpl } from '../../../src/domain/use-cases/auth/sign-up/SignUpUseCaseImpl';
import { MockOAuthFactoryImpl } from '../../../src/infrastructure/providers/oauth/mock/MockOAuthFactoryImpl';
import { OAuthProviderFactory } from '../../../src/domain/providers/OAuthProviderFactory';
import { JwtProvider } from '../../../src/domain/providers/JwtProvider';
import { JwtProviderImpl } from '../../../src/infrastructure/providers/JwtProviderImpl';
import { HashProvider } from '../../../src/domain/providers/HashProvider';
import { HashProviderImpl } from '../../../src/infrastructure/providers/HashProviderImpl';
import { JwtStrategy } from '../../../src/adapter/common/strategies/JwtStrategy';
import { JwtRefreshStrategy } from '../../../src/adapter/common/strategies/JwtRefreshStrategy';
import { RepositoryModule } from '../../../src/ioc/RepositoryModule';
import { ProviderModule } from '../../../src/ioc/ProviderModule';
import { SignInUseCase } from '../../../src/domain/use-cases/auth/sign-in/SignInUseCase';
import { SignInUseCaseImpl } from '../../../src/domain/use-cases/auth/sign-in/SignInUseCaseImpl';
import { ReissueAccessTokenUseCase } from '../../../src/domain/use-cases/auth/reissue-access-token/ReissueAccessTokenUseCase';
import { ReissueAccessTokenUseCaseImpl } from '../../../src/domain/use-cases/auth/reissue-access-token/ReissueAccessTokenUseCaseImpl';
import { SignOutUseCase } from '../../../src/domain/use-cases/auth/sign-out/SignOutUseCase';
import { SignOutUseCaseImpl } from '../../../src/domain/use-cases/auth/sign-out/SignOutUseCaseImpl';
import { WithdrawUseCase } from '../../../src/domain/use-cases/auth/withdraw/WithdrawUseCase';
import { WithdrawUseCaseImpl } from '../../../src/domain/use-cases/auth/withdraw/WithdrawUseCaseImpl';
import { ValidateUseCase } from '../../../src/domain/use-cases/auth/validate/ValidateUseCase';
import { ValidateUseCaseImpl } from '../../../src/domain/use-cases/auth/validate/ValidateUseCaseImpl';

describe('signup e2e test', () => {
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

  describe('POST v1/auth/signup', () => {
    describe('try signup using wrong provider', () => {
      describe('provider=dfadfdasfsadfasfda', () => {
        const signUpParam: SignUpRequestDto = {
          thirdPartyAccessToken: 'asdfasdfasdfasdf',
          username: 'e2eTesting..',
          age: 3,
          goal: 'e2e 테스트를 완벽하게합시다',
          statusMessage: '화이팅중',
        };

        it('InvalidProviderException should be thrown', async () => {
          const res: request.Response = await request(httpServer)
            .post(`/v1/auth/signup`)
            .set('Accept', 'application/json')
            .type('application/json')
            .send(signUpParam);

          expect(res.statusCode).toBe(400);
          expect(res.body.errorCode).toEqual(1);
        });
      });
    });

    describe('try signup using valid provider', () => {
      describe('provider=kakao', () => {
        describe('using wrong thirdPartyAccessToken', () => {
          const signUpParam: SignUpRequestDto = {
            thirdPartyAccessToken: 'wrongToken',
            username: 'e2eTesting..',
            age: 3,
            goal: 'e2e 테스트를 완벽하게합시다',
            statusMessage: '화이팅중',
          };

          it('InvalidKakaoToken should be thrown', async () => {
            const res: request.Response = await request(httpServer)
              .post(`/v1/auth/signup?provider=kakao`)
              .set('Accept', 'application/json')
              .type('application/json')
              .send(signUpParam);

            expect(res.statusCode).toBe(400);
            expect(res.body.errorCode).toEqual(3);
          });
        });

        describe('using valid thirdPartyAccessToken', () => {
          describe('using not intact request form', () => {
            const signUpParam: any = {
              thirdPartyAccessToken: 'SUPPOSETHISISVALIDTOKEN',
              // username: 'e2eTesting..',
              // age: 3,
              goal: 'e2e 테스트를 완벽하게합시다',
              statusMessage: '화이팅중',
            };

            it('BadRequestExceptiont should be thrown', async () => {
              const res: request.Response = await request(httpServer)
                .post(`/v1/auth/signup?provider=kakao`)
                .set('Accept', 'application/json')
                .type('application/json')
                .send(signUpParam);

              expect(res.statusCode).toBe(400);
            });
          });

          describe('using intact request form', () => {
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
              expect(res.body.point).toEqual(0);
              expect(res.body.exp).toEqual(0);
              expect(res.body.level).toEqual(Level.bronze);
              expect(res.body.didRoutinesInMonth).toEqual(0);
              expect(res.body.didRoutinesInTotal).toEqual(0);
            });
          });

          describe('retry signup already registered', () => {
            const signUpParam: SignUpRequestDto = {
              thirdPartyAccessToken: 'SUPPOSETHISISVALIDTOKEN',
              username: 'e2eTesting..',
              age: 3,
              goal: 'e2e 테스트를 완벽하게합시다',
              statusMessage: '화이팅중',
            };

            it('UserAlreadyRegisteredException should be thrown', async () => {
              const res: request.Response = await request(httpServer)
                .post(`/v1/auth/signup?provider=kakao`)
                .set('Accept', 'application/json')
                .type('application/json')
                .send(signUpParam);

              expect(res.statusCode).toBe(409);
              expect(res.body.errorCode).toEqual(7);
            });
          });
        });
      });
    });
  });
});

/***
 * 잘못된 프로바이더 (kakao, google)
 * 잘못된 토큰 (kakao, google)
 * 잘못된 request form
 * 회원가입 (+ point, exp, didRoutinesInTotal(Month), level 초기화 됐나)
 * 회원가입 재시도 (이미 가입한 유저)
 */
