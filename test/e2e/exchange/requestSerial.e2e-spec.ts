import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { setTimeOut } from '../e2e-env';
import { CoreModule, DatabaseService } from '../../../src/ioc/CoreModule';
import { InitApp } from '../config';
import * as request from 'supertest';
import { Connection } from 'mongoose';
import { SignUpRequestDto } from '../../../src/adapter/auth/sign-up/SignUpRequestDto';
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
import { LoggerModule } from '../../../src/ioc/LoggerModule';
import { ExchangeControllerInjectedDecorator } from '../../../src/ioc/controllers/exchange/ExchangeControllerInjectedDecorator';
import { RequestSerialUseCase } from '../../../src/domain/use-cases/exchange/request-serial/RequestSerialUseCase';
import { RequestSerialUseCaseImpl } from '../../../src/domain/use-cases/exchange/request-serial/RequestSerialUseCaseImpl';
import { IssueExchangeTokenUseCase } from '../../../src/domain/use-cases/exchange/issue-exchange-token/IssueExchangeTokenUseCase';
import { IssueExchangeTokenUseCaseImpl } from '../../../src/domain/use-cases/exchange/issue-exchange-token/IssueExchangeTokenUseCaseImpl';
import { AuthModule } from '../../../src/ioc/AuthModule';
import { ExchangeModule } from '../../../src/ioc/ExchangeModule';
import { RequestSerialRequestDto } from '../../../src/adapter/exchange/request-serial/RequestSerialRequestDto';
import { ExchangePointUseCase } from '../../../src/domain/use-cases/exchange/exchange-point/ExchangePointUseCase';
import { ExchangePointUseCaseImpl } from '../../../src/domain/use-cases/exchange/exchange-point/ExchangePointUseCaseImpl';

describe('requestSerial e2e test', () => {
  let app: INestApplication;
  let httpServer: any;
  let dbConnection: Connection;

  let accessToken: string;

  setTimeOut();

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [
        RepositoryModule,
        ProviderModule,
        CoreModule,
        AuthModule,
        ExchangeModule,
        LoggerModule.forRoot(),
      ],
      controllers: [
        AuthControllerInjectedDecorator,
        ExchangeControllerInjectedDecorator,
      ],
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
        {
          provide: RequestSerialUseCase,
          useClass: RequestSerialUseCaseImpl,
        },
        {
          provide: IssueExchangeTokenUseCase,
          useClass: IssueExchangeTokenUseCaseImpl,
        },
        {
          provide: ExchangePointUseCase,
          useClass: ExchangePointUseCaseImpl,
        },
      ],
      exports: [],
    }).compile();

    app = await InitApp(app, moduleRef);

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
    await dbConnection.collection('serials').deleteMany({});

    await app.close();
  });

  describe('POST v1/exchange/serial', () => {
    describe('Request Serial', () => {
      describe('with invalid email', () => {
        it('invalid request body exception should be thrown', async () => {
          const dto: RequestSerialRequestDto = {
            email: '이메일',
          };

          const res: request.Response = await request(httpServer)
            .post('/v1/exchange/serial')
            .set('Authorization', `Bearer ${accessToken}`)
            .set('Accept', 'application/json')
            .type('application/json')
            .send(dto);

          expect(res.statusCode).toEqual(400);
        });
      });

      describe('with valid email', () => {
        it('{} should be return', async () => {
          const dto: RequestSerialRequestDto = {
            email: 'nntest@ttttttestsstest.test',
          };

          const res: request.Response = await request(httpServer)
            .post('/v1/exchange/serial')
            .set('Authorization', `Bearer ${accessToken}`)
            .set('Accept', 'application/json')
            .type('application/json')
            .send(dto);

          expect(res.statusCode).toEqual(201);
          expect(res.body).toEqual({});
        });
      });
    });
  });
});

/***
 * 유효하지 않은 이메일로 시리얼 발급시도
 * 유효한 이메일로 시리얼 발급시도
 */
