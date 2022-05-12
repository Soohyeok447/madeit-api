import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { setTimeOut } from '../e2e-env';
import { CoreModule, DatabaseService } from '../../../src/ioc/CoreModule';
import { InitApp } from '../config';
import { Category } from '../../../src/domain/common/enums/Category';
import { Connection } from 'mongoose';
import * as request from 'supertest';
import { SignUpRequestDto } from '../../../src/adapter/auth/sign-up/SignUpRequestDto';
import { AddRecommendedRoutineRequestDto } from '../../../src/adapter/recommended-routine/add-recommended-routine/AddRecommendedRoutineRequestDto';
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
import { MockDeleteRecommendedRoutineUseCaseImpl } from '../../../src/domain/use-cases/recommended-routine/delete-recommended-routine/mock/MockDeleteRecommendedRoutineUseCase';
import { GetRecommendedRoutineUseCase } from '../../../src/domain/use-cases/recommended-routine/get-recommended-routine/GetRecommendedRoutineUseCase';
import { GetRecommendedRoutineUseCaseImpl } from '../../../src/domain/use-cases/recommended-routine/get-recommended-routine/GetRecommendedRoutineUseCaseImpl';
import { GetRecommendedRoutinesByCategoryUseCase } from '../../../src/domain/use-cases/recommended-routine/get-recommended-routines-by-category/GetRecommendedRoutinesByCategoryUseCase';
import { GetRecommendedRoutinesByCategoryUseCaseImpl } from '../../../src/domain/use-cases/recommended-routine/get-recommended-routines-by-category/GetRecommendedRoutinesByCategoryUseCaseImpl';
import { MockModifyRecommendedRoutineUseCaseImpl } from '../../../src/domain/use-cases/recommended-routine/modify-recommended-routine/mock/MockModifyRecommendedRoutineUseCase';
import { ModifyRecommendedRoutineUseCase } from '../../../src/domain/use-cases/recommended-routine/modify-recommended-routine/ModifyRecommendedRoutineUseCase';
import { PatchCardnewsUseCase } from '../../../src/domain/use-cases/recommended-routine/patch-cardnews/PatchCardnewsUseCase';
import { PatchThumbnailUseCase } from '../../../src/domain/use-cases/recommended-routine/patch-thumbnail/PatchThumbnailUseCase';
import { HashProviderImpl } from '../../../src/infrastructure/providers/HashProviderImpl';
import { JwtProviderImpl } from '../../../src/infrastructure/providers/JwtProviderImpl';
import { MockOAuthFactoryImpl } from '../../../src/infrastructure/providers/oauth/mock/MockOAuthFactoryImpl';
import { AuthControllerInjectedDecorator } from '../../../src/ioc/controllers/auth/AuthControllerInjectedDecorator';
import { RecommendedRoutineControllerInjectedDecorator } from '../../../src/ioc/controllers/recommended-routine/RecommendRoutineControllerInjectedSwagger';
import { ProviderModule } from '../../../src/ioc/ProviderModule';
import { RepositoryModule } from '../../../src/ioc/RepositoryModule';
import { MockPatchCardnewsUseCaseImpl } from '../../../src/domain/use-cases/recommended-routine/patch-cardnews/mock/MockPatchCardnewsUseCase';
import { MockPatchThumbnailUseCaseImpl } from '../../../src/domain/use-cases/recommended-routine/patch-thumbnail/mock/MockPatchThumbnailUseCase';
import { LoggerModule } from '../../../src/ioc/LoggerModule';

describe('patchImages e2e test', () => {
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
          useClass: MockModifyRecommendedRoutineUseCaseImpl,
        },
        {
          provide: DeleteRecommendedRoutineUseCase,
          useClass: MockDeleteRecommendedRoutineUseCaseImpl,
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
          useClass: MockPatchThumbnailUseCaseImpl,
        },
        {
          provide: PatchCardnewsUseCase,
          useClass: MockPatchCardnewsUseCaseImpl,
        },
      ],
      exports: [PassportModule, JwtStrategy, JwtRefreshStrategy],
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
    await dbConnection.collection('recommended-routines').deleteMany({});
    await dbConnection.collection('images').deleteMany({});

    await app.close();
  });

  let routineId: string;

  describe('PATCH v1/recommended-routines/:id/thumbnail', () => {
    describe('before getting admin authorization...', () => {
      describe('try patch thumbnail', () => {
        describe('using valid mongo object id with thumbnail', () => {
          it('UserNotAdminException should be thrown', async () => {
            const res: request.Response = await request(httpServer)
              .patch(
                `/v1/recommended-routines/000000000000000000000000/thumbnail`,
              )
              .set('Authorization', `Bearer ${accessToken}`)
              .set('Content-Type', 'multipart/form-data')
              .attach(
                'thumbnail',
                'test/e2e/recommended-routine/thumbnail.jpg',
              );

            expect(res.statusCode).toBe(401);
          });
        });

        describe('using invalid mongo object id with thumbnail', () => {
          it('InvalidMongoObjectIdException should be thrown', async () => {
            const res: request.Response = await request(httpServer)
              .patch(`/v1/recommended-routines/123/thumbnail`)
              .set('Authorization', `Bearer ${accessToken}`)
              .set('Content-Type', 'multipart/form-data')
              .attach(
                'thumbnail',
                'test/e2e/recommended-routine/thumbnail.jpg',
              );

            expect(res.statusCode).toBe(400);
          });
        });
      });
    });

    describe('after getting admin authorization...', () => {
      describe('try patch thumbnail', () => {
        describe('using wrong id with thumbnail', () => {
          it('RoutineNotFoundException should be thrown', async () => {
            const res: request.Response = await request(httpServer)
              .patch(
                `/v1/recommended-routines/123456789101112131415161/thumbnail`,
              )
              .set('Authorization', `Bearer ${accessToken}`)
              .set('Content-Type', 'multipart/form-data')
              .attach(
                'thumbnail',
                'test/e2e/recommended-routine/thumbnail.jpg',
              );

            expect(res.statusCode).toBe(404);
          });
        });

        describe('using invalid mongo object id with thumbnail', () => {
          it('InvalidMongoObjectIdException should be thrown', async () => {
            const res: request.Response = await request(httpServer)
              .patch(`/v1/recommended-routines/123/thumbnail`)
              .set('Authorization', `Bearer ${accessToken}`)
              .set('Content-Type', 'multipart/form-data')
              .attach(
                'thumbnail',
                'test/e2e/recommended-routine/thumbnail.jpg',
              );

            expect(res.statusCode).toBe(400);
          });
        });
      });
    });
  });

  describe('POST v1/recommended-routines', () => {
    it('add an routine', async () => {
      const addRoutineParam: AddRecommendedRoutineRequestDto = {
        title: 'e2eTest',
        category: Category.Reading,
        introduction: 'e2eTest',
      };

      const res: request.Response = await request(httpServer)
        .post('/v1/recommended-routines')
        .set('Authorization', `Bearer ${accessToken}`)
        .set('Accept', 'application/json')
        .type('application/json')
        .send(addRoutineParam);

      routineId = res.body.id;
    });
  });

  describe('PATCH v1/recommended-routines/:id/thumbnail after add routine', () => {
    describe('try patch thumbnail', () => {
      describe('using invalid mongo object id with thumbnail', () => {
        it('InvalidMongoObjectIdException should be thrown', async () => {
          const res: request.Response = await request(httpServer)
            .patch(`/v1/recommended-routines/123/thumbnail`)
            .set('Authorization', `Bearer ${accessToken}`)
            .set('Content-Type', 'multipart/form-data')
            .attach('thumbnail', 'test/e2e/recommended-routine/thumbnail.jpg');

          expect(res.statusCode).toBe(400);
        });
      });

      describe('using valid mongo object id with thumbnail', () => {
        it('should return routineModel', async () => {
          const res: request.Response = await request(httpServer)
            .patch(`/v1/recommended-routines/${routineId}/thumbnail`)
            .set('Authorization', `Bearer ${accessToken}`)
            .set('Content-Type', 'multipart/form-data')
            .attach('thumbnail', 'test/e2e/recommended-routine/thumbnail.jpg');

          expect(res.statusCode).toBe(200);
        });
      });
    });
  });

  describe('PATCH v1/recommended-routines/:id/cardnews after add routine', () => {
    describe('try patch cardnews', () => {
      describe('using invalid mongo object id with cardnews', () => {
        it('InvalidMongoObjectIdException should be thrown', async () => {
          const res: request.Response = await request(httpServer)
            .patch(`/v1/recommended-routines/123/cardnews`)
            .set('Authorization', `Bearer ${accessToken}`)
            .set('Content-Type', 'multipart/form-data')
            .attach('cardnews', 'test/e2e/recommended-routine/1.jpg')
            .attach(
              'cardnews',
              'test/e2e/recommended-routine/1.jpg',
              'test/e2e/recommended-routine/2.jpg',
            );

          expect(res.statusCode).toBe(400);
        });
      });

      describe('using valid mongo object id with cardnews', () => {
        it('should return routineModel', async () => {
          const res: request.Response = await request(httpServer)
            .patch(`/v1/recommended-routines/${routineId}/cardnews`)
            .set('Authorization', `Bearer ${accessToken}`)
            .set('Content-Type', 'multipart/form-data')
            .attach('cardnews', 'test/e2e/recommended-routine/1.jpg')
            .attach(
              'cardnews',
              'test/e2e/recommended-routine/1.jpg',
              'test/e2e/recommended-routine/2.jpg',
            );

          expect(res.statusCode).toBe(200);
        });
      });
    });
  });

  describe('GET v1/recommended-routines/:id', () => {
    describe('try get an routine ', () => {
      it('should be return RoutineModel', async () => {
        const res: request.Response = await request(httpServer)
          .get(`/v1/recommended-routines/${routineId}`)
          .set('Authorization', `Bearer ${accessToken}`);

        expect(res.statusCode).toBe(200);
      });
    });
  });
});

/***
 * 어드민이 아님
 * 어드민 권한 부여
 * routine이 없음
 * 루틴 하나 생성
 * 유효하지 않은 mongoose object id
 * findRoutine
 */