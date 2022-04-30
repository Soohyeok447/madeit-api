import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { setTimeOut } from '../e2e-env';
import { CoreModule, DatabaseService } from '../../../src/ioc/CoreModule';
import { InitApp } from '../config';
import { Connection } from 'mongoose';
import * as request from 'supertest';
import { SignUpRequestDto } from '../../../src/adapter/auth/sign-up/SignUpRequestDto';
import { AddRoutineRequestDto } from '../../../src/adapter/routine/add-routine/AddRoutineRequestDto';
import { ModifyRoutineRequestDto } from '../../../src/adapter/routine/modify-routine/ModifyRoutineRequestDto';
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
import { LoggerModule } from '../../../src/ioc/LoggerModule';

describe('modifyRoutine e2e test', () => {
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
    await dbConnection.collection('complete-routines').deleteMany({});

    await app.close();
  });

  describe('PATCH v1/routines/:id', () => {
    let routineId: string;

    describe('add routine', () => {
      it('success to add routine', async () => {
        const addRoutineParamForTestDuplication: AddRoutineRequestDto = {
          title: '테스트',
          hour: 15,
          minute: 30,
          days: [1, 2, 3],
          alarmVideoId: 'asdfasdf',
          contentVideoId: 'asdfasdf',
          timerDuration: 3000,
        };

        await request(httpServer)
          .post('/v1/routines')
          .set('Authorization', `Bearer ${accessToken}`)
          .set('Accept', 'application/json')
          .type('application/json')
          .send(addRoutineParamForTestDuplication);

        const addRoutineParam: AddRoutineRequestDto = {
          title: '테스트',
          hour: 15,
          minute: 50,
          days: [1, 2, 3],
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

        expect(res.statusCode).toBe(201);
      });
    });

    describe('try modify routine', () => {
      describe('using invalid days [1,2,3,5,6,7,8,9,9,1,2,3]', () => {
        it('BadRequestException should be thrown', async () => {
          const modifyRoutineParam: ModifyRoutineRequestDto = {
            title: '타이틀',
            hour: 0,
            minute: 0,
            days: [1, 2, 3, 5, 6, 7, 8, 9, 9, 1, 2, 3],
          };

          const res: request.Response = await request(httpServer)
            .patch(`/v1/routines/${routineId}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .set('Accept', 'application/json')
            .type('application/json')
            .send(modifyRoutineParam);

          expect(res.statusCode).toBe(400);
        });
      });

      describe('using invalid days []', () => {
        it('BadRequestException should be thrown', async () => {
          const modifyRoutineParam: ModifyRoutineRequestDto = {
            title: '타이틀',
            hour: 0,
            minute: 0,
            days: [],
          };

          const res: request.Response = await request(httpServer)
            .patch(`/v1/routines/${routineId}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .set('Accept', 'application/json')
            .type('application/json')
            .send(modifyRoutineParam);

          expect(res.statusCode).toBe(400);
        });
      });

      describe('using invalid hour 24', () => {
        it('BadRequestException should be thrown', async () => {
          const modifyRoutineParam: ModifyRoutineRequestDto = {
            title: '타이틀',
            hour: 24,
            minute: 0,
            days: [1],
          };

          const res: request.Response = await request(httpServer)
            .patch(`/v1/routines/${routineId}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .set('Accept', 'application/json')
            .type('application/json')
            .send(modifyRoutineParam);

          expect(res.statusCode).toBe(400);
          expect(res.body.errorCode).toBe(1);
        });
      });

      describe('using invalid hour -1', () => {
        it('BadRequestException should be thrown', async () => {
          const modifyRoutineParam: ModifyRoutineRequestDto = {
            title: '타이틀',
            hour: -1,
            minute: 0,
            days: [1],
          };

          const res: request.Response = await request(httpServer)
            .patch(`/v1/routines/${routineId}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .set('Accept', 'application/json')
            .type('application/json')
            .send(modifyRoutineParam);

          expect(res.statusCode).toBe(400);
          expect(res.body.errorCode).toBe(1);
        });
      });

      describe('using invalid minute 60', () => {
        it('BadRequestException should be thrown', async () => {
          const modifyRoutineParam: ModifyRoutineRequestDto = {
            title: '타이틀',
            hour: 0,
            minute: 60,
            days: [1],
          };

          const res: request.Response = await request(httpServer)
            .patch(`/v1/routines/${routineId}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .set('Accept', 'application/json')
            .type('application/json')
            .send(modifyRoutineParam);

          expect(res.statusCode).toBe(400);
          expect(res.body.errorCode).toBe(1);
        });
      });

      describe('using invalid minute 60', () => {
        it('BadRequestException should be thrown', async () => {
          const modifyRoutineParam: ModifyRoutineRequestDto = {
            title: '타이틀',
            hour: 0,
            minute: 60,
            days: [1],
          };

          const res: request.Response = await request(httpServer)
            .patch(`/v1/routines/${routineId}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .set('Accept', 'application/json')
            .type('application/json')
            .send(modifyRoutineParam);

          expect(res.statusCode).toBe(400);
          expect(res.body.errorCode).toBe(1);
        });
      });

      describe('try duplicated routine', () => {
        it('ConflictRoutineAlarmException should be thrown', async () => {
          const modifyRoutineParam: ModifyRoutineRequestDto = {
            title: '타이틀',
            hour: 15,
            minute: 30,
            days: [1, 2, 3],
          };

          const res: request.Response = await request(httpServer)
            .patch(`/v1/routines/${routineId}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .set('Accept', 'application/json')
            .type('application/json')
            .send(modifyRoutineParam);

          expect(res.statusCode).toBe(409);
          expect(res.body.errorCode).toBe(2);
        });
      });

      describe('using valid request form without youtube id, timerDuration field', () => {
        it('ConflictRoutineAlarmException should be thrown', async () => {
          const modifyRoutineParam: ModifyRoutineRequestDto = {
            title: '타이틀',
            hour: 11,
            minute: 11,
            days: [6, 7],
          };

          const res: request.Response = await request(httpServer)
            .patch(`/v1/routines/${routineId}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .set('Accept', 'application/json')
            .type('application/json')
            .send(modifyRoutineParam);

          expect(res.statusCode).toBe(200);
          expect(res.body.alarmVideoId).toEqual('asdfasdf');
          expect(res.body.contentVideoId).toEqual('asdfasdf');
          expect(res.body.timerDuration).toEqual(3000);
        });
      });
    });
  });
});

/***
 * 유튜브 id, 타이머 추가한 알람추가 성공
 * 유효하지 않은 시간
 * 중복된 알람 추가시도
 * 유튜브 id, 타이머 없는 알람으로 수정 성공
 */
