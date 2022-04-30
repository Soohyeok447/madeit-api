import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { setTimeOut } from '../e2e-env';
import { CoreModule, DatabaseService } from '../../../src/ioc/CoreModule';
import { InitApp } from '../config';
import { Level } from '../../../src/domain/common/enums/Level';
import { Category } from '../../../src/domain/common/enums/Category';
import { Connection } from 'mongoose';
import * as request from 'supertest';
import { AddRoutineRequestDto } from '../../../src/adapter/routine/add-routine/AddRoutineRequestDto';
import { AddRecommendedRoutineRequestDto } from '../../../src/adapter/recommended-routine/add-recommended-routine/AddRecommendedRoutineRequestDto';
import { SignUpRequestDto } from '../../../src/adapter/auth/sign-up/SignUpRequestDto';
import { JwtRefreshStrategy } from '../../../src/adapter/common/strategies/JwtRefreshStrategy';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
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
import { AddRecommendedRoutineUseCase } from '../../../src/domain/use-cases/recommended-routine/add-recommended-routine/AddRecommendedRoutineUseCase';
import { MockAddRecommendedRoutineUseCaseImpl } from '../../../src/domain/use-cases/recommended-routine/add-recommended-routine/mock/MockAddRecommendedRoutineUseCase';
import { DeleteRecommendedRoutineUseCase } from '../../../src/domain/use-cases/recommended-routine/delete-recommended-routine/DeleteRecommendedRoutineUseCase';
import { DeleteRecommendedRoutineUseCaseImpl } from '../../../src/domain/use-cases/recommended-routine/delete-recommended-routine/DeleteRecommendedRoutineUseCaseImpl';
import { GetRecommendedRoutineUseCase } from '../../../src/domain/use-cases/recommended-routine/get-recommended-routine/GetRecommendedRoutineUseCase';
import { GetRecommendedRoutineUseCaseImpl } from '../../../src/domain/use-cases/recommended-routine/get-recommended-routine/GetRecommendedRoutineUseCaseImpl';
import { GetRecommendedRoutinesByCategoryUseCase } from '../../../src/domain/use-cases/recommended-routine/get-recommended-routines-by-category/GetRecommendedRoutinesByCategoryUseCase';
import { GetRecommendedRoutinesByCategoryUseCaseImpl } from '../../../src/domain/use-cases/recommended-routine/get-recommended-routines-by-category/GetRecommendedRoutinesByCategoryUseCaseImpl';
import { ModifyRecommendedRoutineUseCase } from '../../../src/domain/use-cases/recommended-routine/modify-recommended-routine/ModifyRecommendedRoutineUseCase';
import { ModifyRecommendedRoutineUseCaseImpl } from '../../../src/domain/use-cases/recommended-routine/modify-recommended-routine/ModifyRecommendedRoutineUseCaseImpl';
import { PatchCardnewsUseCase } from '../../../src/domain/use-cases/recommended-routine/patch-cardnews/PatchCardnewsUseCase';
import { PatchCardnewsUseCaseImpl } from '../../../src/domain/use-cases/recommended-routine/patch-cardnews/PatchCardnewsUseCaseImpl';
import { PatchThumbnailUseCase } from '../../../src/domain/use-cases/recommended-routine/patch-thumbnail/PatchThumbnailUseCase';
import { PatchThumbnailUseCaseImpl } from '../../../src/domain/use-cases/recommended-routine/patch-thumbnail/PatchThumbnailUseCaseImpl';
import { HashProviderImpl } from '../../../src/infrastructure/providers/HashProviderImpl';
import { JwtProviderImpl } from '../../../src/infrastructure/providers/JwtProviderImpl';
import { MockOAuthFactoryImpl } from '../../../src/infrastructure/providers/oauth/mock/MockOAuthFactoryImpl';
import { AuthControllerInjectedDecorator } from '../../../src/ioc/controllers/auth/AuthControllerInjectedDecorator';
import { RecommendedRoutineControllerInjectedDecorator } from '../../../src/ioc/controllers/recommended-routine/RecommendRoutineControllerInjectedSwagger';
import { ProviderModule } from '../../../src/ioc/ProviderModule';
import { RepositoryModule } from '../../../src/ioc/RepositoryModule';
import { RoutineModule } from '../../../src/ioc/RoutineModule';
import { UserModule } from '../../../src/ioc/UserModule';
import { LoggerModule } from '../../../src/ioc/LoggerModule';

describe('doneRoutine e2e test', () => {
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
        RoutineModule,
        CoreModule,
        LoggerModule.forRoot(),
        UserModule,
      ],
      controllers: [
        AuthControllerInjectedDecorator,
        RecommendedRoutineControllerInjectedDecorator,
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
        JwtStrategy,
        JwtRefreshStrategy,
        {
          provide: AddRecommendedRoutineUseCase,
          useClass: MockAddRecommendedRoutineUseCaseImpl,
        },
        {
          provide: ModifyRecommendedRoutineUseCase,
          useClass: ModifyRecommendedRoutineUseCaseImpl,
        },
        {
          provide: DeleteRecommendedRoutineUseCase,
          useClass: DeleteRecommendedRoutineUseCaseImpl,
        },
        {
          provide: GetRecommendedRoutineUseCase,
          useClass: GetRecommendedRoutineUseCaseImpl,
        },
        {
          provide: GetRecommendedRoutinesByCategoryUseCase,
          useClass: GetRecommendedRoutinesByCategoryUseCaseImpl,
        },
        {
          provide: PatchThumbnailUseCase,
          useClass: PatchThumbnailUseCaseImpl,
        },
        {
          provide: PatchCardnewsUseCase,
          useClass: PatchCardnewsUseCaseImpl,
        },
      ],
      exports: [PassportModule, JwtStrategy, JwtRefreshStrategy],
    }).compile();

    app = await InitApp(app, moduleRef);

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
    await dbConnection.collection('routines').deleteMany({});
    await dbConnection.collection('recommended-routines').deleteMany({});
    await dbConnection.collection('complete-routines').deleteMany({});

    await app.close();
  });

  let routineId: string;
  let recommendedRoutineId: string;

  describe('POST v1/routines (point = 0, exp = 0)', () => {
    describe('try add routine', () => {
      it('success to add routine', async () => {
        const addRoutineParam: AddRoutineRequestDto = {
          title: '테스트',
          hour: 1,
          minute: 1,
          days: [1, 2, 5, 7],
          alarmVideoId: 'asdfasdf',
          contentVideoId: 'asdfasdf',
          timerDuration: 3000,
        };

        const res: request.Response = await request(httpServer)
          .post('/v1/routines')
          .set('Authorization', `Bearer ${accessToken}`)
          .set('Accept', 'application/json')
          .type('application/json')
          .send(addRoutineParam);

        routineId = res.body.id;
      });
    });
  });

  describe('PATCH v1/routines/:id/done (exp, point이 각각 0) ', () => {
    describe('try call with nonexistent routineId', () => {
      it('RoutineNotFoundException should be thrown', async () => {
        const res: request.Response = await request(httpServer)
          .patch(`/v1/routines/621807f8955beba4b95f77f8/done`)
          .set('Authorization', `Bearer ${accessToken}`);

        expect(res.statusCode).toBe(404);
        expect(res.body.errorCode).toBe(71);
      });
    });

    describe('try call with valid routineId', () => {
      it('RoutineNotFoundException should be thrown', async () => {
        const res: request.Response = await request(httpServer)
          .patch(`/v1/routines/${routineId}/done`)
          .set('Authorization', `Bearer ${accessToken}`);

        expect(res.statusCode).toBe(404);
        expect(res.body.errorCode).toEqual(3);
      });
    });

    describe('POST v1/recommended-routines (point = 0, exp = 0)', () => {
      describe('try add recommendedroutine', () => {
        it('success to add recommendedroutine', async () => {
          const addRoutineParam: AddRecommendedRoutineRequestDto = {
            title: '타이틀1',
            introduction: '소개글',
            category: Category.Health,
          };

          const res: request.Response = await request(httpServer)
            .post('/v1/recommended-routines')
            .set('Authorization', `Bearer ${accessToken}`)
            .set('Accept', 'application/json')
            .type('application/json')
            .send(addRoutineParam);

          recommendedRoutineId = res.body.id;
        });
      });
    });

    describe('POST v1/routines (point = 0, exp = 0)', () => {
      describe('try add routine', () => {
        it('success to add routine', async () => {
          const addRoutineParam: AddRoutineRequestDto = {
            title: '테스트',
            hour: 1,
            minute: 2,
            days: [1, 2, 5, 7],
            alarmVideoId: 'asdfasdf',
            contentVideoId: 'asdfasdf',
            timerDuration: 3000,
            recommendedRoutineId,
          };

          const res: request.Response = await request(httpServer)
            .post('/v1/routines')
            .set('Authorization', `Bearer ${accessToken}`)
            .set('Accept', 'application/json')
            .type('application/json')
            .send(addRoutineParam);

          routineId = res.body.id;
        });
      });
    });

    describe('GET v1/users/me', () => {
      it('didRoutinesInTotal, didRoutinesInMonth should be increased', async () => {
        await request(httpServer)
          .patch(`/v1/routines/${routineId}/done`)
          .set('Authorization', `Bearer ${accessToken}`);

        const res: request.Response = await request(httpServer)
          .get('/v1/users/me')
          .set('Authorization', `Bearer ${accessToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.didRoutinesInTotal).toEqual(1);
        expect(res.body.didRoutinesInMonth).toEqual(1);
        expect(res.body.level).toEqual(Level.bronze);
        expect(res.body.exp).toEqual(0);
        expect(res.body.point).toEqual(0);
      });
    });
  });

  describe('POST v1/recommended-routines (point = 100, exp = 1000)', () => {
    describe('try add recommendedroutine', () => {
      it('success to add recommendedroutine', async () => {
        const addRoutineParam: AddRecommendedRoutineRequestDto = {
          title: '타이틀2',
          introduction: '소개글',
          category: Category.Health,
          point: 100,
          exp: 1000,
        };

        const res: request.Response = await request(httpServer)
          .post('/v1/recommended-routines')
          .set('Authorization', `Bearer ${accessToken}`)
          .set('Accept', 'application/json')
          .type('application/json')
          .send(addRoutineParam);

        recommendedRoutineId = res.body.id;
      });
    });
  });

  describe('POST v1/routines (point = 100, exp = 1000)', () => {
    describe('try add routine', () => {
      it('success to add routine', async () => {
        const addRoutineParam: AddRoutineRequestDto = {
          title: '테스트',
          hour: 1,
          minute: 3,
          days: [1, 2, 5, 7],
          alarmVideoId: 'asdfasdf',
          contentVideoId: 'asdfasdf',
          timerDuration: 3000,
          recommendedRoutineId,
        };

        const res: request.Response = await request(httpServer)
          .post('/v1/routines')
          .set('Authorization', `Bearer ${accessToken}`)
          .set('Accept', 'application/json')
          .type('application/json')
          .send(addRoutineParam);

        routineId = res.body.id;
      });
    });
  });

  describe('PATCH v1/routines/:id/done (exp가 1000, point가 100) ', () => {
    describe('try call with valid routineId', () => {
      it('{} should be thrown', async () => {
        const res: request.Response = await request(httpServer)
          .patch(`/v1/routines/${routineId}/done`)
          .set('Authorization', `Bearer ${accessToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({});
      });
    });

    describe('GET v1/users/me', () => {
      it('didRoutinesInTotal, didRoutinesInMonth, point, exp should be increased', async () => {
        const res: request.Response = await request(httpServer)
          .get('/v1/users/me')
          .set('Authorization', `Bearer ${accessToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.didRoutinesInTotal).toEqual(2);
        expect(res.body.didRoutinesInMonth).toEqual(2);
        expect(res.body.level).not.toEqual(Level.bronze);
        expect(res.body.exp).toEqual(1000);
        expect(res.body.point).toEqual(100);
      });
    });
  });
});

/***
 * point, exp이 각각 0인 루틴 추가
 * 존재하지 않는 아이디로 doneRoutine 호출 시도
 * doneRoutine 호출
 * 유저 point, exp는 0이고 완료횟수가 늘었는지 확인
 * point, exp이 100, 1000인 루틴 추가
 * doneRoutine 호출
 * 유저 point, exp가 100, 1000이고 완료횟수가 늘었고 레벨이 변했는지 확인
 */
