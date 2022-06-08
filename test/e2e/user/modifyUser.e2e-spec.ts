import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { setTimeOut } from '../e2e-env';
import { CoreModule, DatabaseService } from '../../../src/ioc/CoreModule';
import { Connection } from 'mongoose';
import { SignUpRequestDto } from '../../../src/adapter/auth/sign-up/SignUpRequestDto';
import * as request from 'supertest';
import { ModifyUserRequestDto } from '../../../src/adapter/user/modify-user/ModifyUserRequestDto';
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
import { MockHttpExceptionFilter } from '../../../src/domain/common/filters/MockHttpExceptionFilter';
import { LoggerModule } from '../../../src/ioc/LoggerModule';
import { FindUserUseCase } from '../../../src/domain/use-cases/user/find-user/FindUserUseCase';
import { FindUserUseCaseImplV2 } from '../../../src/domain/use-cases/user/find-user/FindUserUseCaseImplV2';
import { ModifyUserUseCase } from '../../../src/domain/use-cases/user/modify-user/ModifyUserUseCase';
import { ModifyUserUseCaseImplV2 } from '../../../src/domain/use-cases/user/modify-user/ModifyUserUseCaseImplV2';
import { PatchAvatarUseCase } from '../../../src/domain/use-cases/user/patch-avatar/PatchAvatarUseCase';
import { PatchAvatarUseCaseImplV2 } from '../../../src/domain/use-cases/user/patch-avatar/PatchAvatarUseCaseImplV2';
import { ValidateUsernameUseCase } from '../../../src/domain/use-cases/user/validate-username/ValidateUsernameUseCase';
import { ValidateUsernameUseCaseImpl } from '../../../src/domain/use-cases/user/validate-username/ValidateusernameUseCaseImpl';
import { UserControllerInjectedDecorator } from '../../../src/ioc/controllers/user/UserControllerInjectedDecorator';

describe('modify e2e test', () => {
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
      ],
      controllers: [
        AuthControllerInjectedDecorator,
        UserControllerInjectedDecorator,
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
          provide: FindUserUseCase,
          useClass: FindUserUseCaseImplV2,
        },
        {
          provide: ModifyUserUseCase,
          useClass: ModifyUserUseCaseImplV2,
        },
        {
          provide: PatchAvatarUseCase,
          useClass: PatchAvatarUseCaseImplV2,
        },
        {
          provide: ValidateUsernameUseCase,
          useClass: ValidateUsernameUseCaseImpl,
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
    await dbConnection.collection('images').deleteMany({});

    await app.close();
  });

  describe('PATCH v1/users/me', () => {
    describe('try onboard with invalid username', () => {
      it('modify failed', async () => {
        const reqParam: ModifyUserRequestDto = {
          username: '1',
          age: 33,
          goal: '3옥 레 질러보기',
          statusMessage: '목상태안좋음',
        };

        const res: request.Response = await request(httpServer)
          .patch('/v1/users/me')
          .set('Authorization', `Bearer ${accessToken}`)
          .set('Accept', 'application/json')
          .type('application/json')
          .send(reqParam);

        expect(res.statusCode).toBe(400);
        expect(res.body.errorCode).toEqual(1);
      });
    });

    describe('try onboard with invalid username', () => {
      it('modify failed', async () => {
        const reqParam: ModifyUserRequestDto = {
          username: '9자를 넘겨버리는 닉네임입니다~',
          age: 33,
          goal: '3옥 레 질러보기',
          statusMessage: '목상태안좋음',
        };

        const res: request.Response = await request(httpServer)
          .patch('/v1/users/me')
          .set('Authorization', `Bearer ${accessToken}`)
          .set('Accept', 'application/json')
          .type('application/json')
          .send(reqParam);

        expect(res.statusCode).toBe(400);
        expect(res.body.errorCode).toEqual(1);
      });
    });

    describe('try onboard with intact request body', () => {
      it('modify success', async () => {
        const reqParam: ModifyUserRequestDto = {
          username: 'test',
          age: 33,
          goal: '3옥 레 질러보기',
          statusMessage: '목상태안좋음',
        };

        const res: request.Response = await request(httpServer)
          .patch('/v1/users/me')
          .set('Authorization', `Bearer ${accessToken}`)
          .set('Accept', 'application/json')
          .type('application/json')
          .send(reqParam);

        expect(res.statusCode).toBe(200);
      });
    });
  });
});

/***
 * 유효하지 않은 username
유효한 request body로 modifying
 */
