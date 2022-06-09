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
import { ProviderModule } from '../../../src/ioc/ProviderModule';
import { RepositoryModule } from '../../../src/ioc/RepositoryModule';
import { LoggerModule } from '../../../src/ioc/LoggerModule';
import { RecommendedRoutineModule } from '../../../src/ioc/RecommendedRoutineModule';
import { AuthModule } from '../../../src/ioc/AuthModule';
import { AddBannerUseCase } from '../../../src/domain/use-cases/admin/add-banner/AddBannerUseCase';
import { AddBannerUseCaseImpl } from '../../../src/domain/use-cases/admin/add-banner/AddBannerUseCaseImpl';
import { AddImageByAdminUseCase } from '../../../src/domain/use-cases/admin/add-image-by-admin/AddImageByAdminUseCase';
import { AddImageByAdminUseCaseImpl } from '../../../src/domain/use-cases/admin/add-image-by-admin/AddImageByAdminUseCaseImpl';
import { AddRecommendedRoutineUseCase } from '../../../src/domain/use-cases/admin/add-recommended-routine/AddRecommendedRoutineUseCase';
import { MockAddRecommendedRoutineUseCaseImpl } from '../../../src/domain/use-cases/admin/add-recommended-routine/mock/MockAddRecommendedRoutineUseCase';
import { AnalyzeRoutinesUsageUseCase } from '../../../src/domain/use-cases/admin/analyze-routines-usage/AnalyzeRoutinesUsageUseCase';
import { AnalyzeRoutinesUsageUseCaseImpl } from '../../../src/domain/use-cases/admin/analyze-routines-usage/AnalyzeRoutinesUsageUseCaseImpl';
import { CountUsersAddedOneRoutineUseCase } from '../../../src/domain/use-cases/admin/count-users-added-one-routine/CountUsersAddedOneRoutineUseCase';
import { CountUsersAddedOneRoutineUseCaseImpl } from '../../../src/domain/use-cases/admin/count-users-added-one-routine/CountUsersAddedOneRoutineUseCaseImpl';
import { CountUsersUseCase } from '../../../src/domain/use-cases/admin/count-users/CountUsersUseCase';
import { CountUsersUseCaseImpl } from '../../../src/domain/use-cases/admin/count-users/CountUsersUseCaseImpl';
import { DeleteBannerUseCase } from '../../../src/domain/use-cases/admin/delete-banner/DeleteBannerUseCase';
import { DeleteBannerUseCaseImpl } from '../../../src/domain/use-cases/admin/delete-banner/DeleteBannerUseCaseImpl';
import { DeleteRecommendedRoutineUseCase } from '../../../src/domain/use-cases/admin/delete-recommended-routine/DeleteRecommendedRoutineUseCase';
import { MockDeleteRecommendedRoutineUseCaseImpl } from '../../../src/domain/use-cases/admin/delete-recommended-routine/mock/MockDeleteRecommendedRoutineUseCaseImpl';
import { IssueAdminTokenUseCase } from '../../../src/domain/use-cases/admin/issue-admin-token/IssueAdminTokenUseCase';
import { IssueAdminTokenUseCaseImpl } from '../../../src/domain/use-cases/admin/issue-admin-token/IssueAdminTokenUseCaseImpl';
import { ModifyBannerUseCase } from '../../../src/domain/use-cases/admin/modify-banner/ModifyBannerUseCase';
import { ModifyBannerUseCaseImpl } from '../../../src/domain/use-cases/admin/modify-banner/ModifyBannerUseCaseImpl';
import { MockModifyRecommendedRoutineUseCaseImpl } from '../../../src/domain/use-cases/admin/modify-recommended-routine/mock/MockModifyRecommendedRoutineUseCase';
import { ModifyRecommendedRoutineUseCase } from '../../../src/domain/use-cases/admin/modify-recommended-routine/ModifyRecommendedRoutineUseCase';
import { MockPatchCardnewsUseCaseImpl } from '../../../src/domain/use-cases/admin/patch-cardnews/mock/MockPatchCardnewsUseCase';
import { PatchCardnewsUseCase } from '../../../src/domain/use-cases/admin/patch-cardnews/PatchCardnewsUseCase';
import { MockPatchThumbnailUseCaseImpl } from '../../../src/domain/use-cases/admin/patch-thumbnail/mock/MockPatchThumbnailUseCase';
import { PatchThumbnailUseCase } from '../../../src/domain/use-cases/admin/patch-thumbnail/PatchThumbnailUseCase';
import { RefreshAdminTokenUseCase } from '../../../src/domain/use-cases/admin/refresh-admin-token/RefreshAdminTokenUseCase';
import { RefreshAdminTokenUseCaseImpl } from '../../../src/domain/use-cases/admin/refresh-admin-token/RefreshAdminTokenUseCaseImpl';
import { RegisterAdminUseCase } from '../../../src/domain/use-cases/admin/register-admin/RegisterAdminUseCase';
import { RegisterAdminUseCaseImpl } from '../../../src/domain/use-cases/admin/register-admin/RegisterAdminUseCaseImpl';
import { AdminControllerInjectedDecorator } from '../../../src/ioc/controllers/admin/AdminControllerInjectedDecorator';

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

        AuthModule,
        RecommendedRoutineModule,
      ],
      providers: [
        {
          provide: RegisterAdminUseCase,
          useClass: RegisterAdminUseCaseImpl,
        },
        {
          provide: IssueAdminTokenUseCase,
          useClass: IssueAdminTokenUseCaseImpl,
        },
        {
          provide: RefreshAdminTokenUseCase,
          useClass: RefreshAdminTokenUseCaseImpl,
        },
        {
          provide: CountUsersUseCase,
          useClass: CountUsersUseCaseImpl,
        },
        {
          provide: CountUsersAddedOneRoutineUseCase,
          useClass: CountUsersAddedOneRoutineUseCaseImpl,
        },
        {
          provide: AnalyzeRoutinesUsageUseCase,
          useClass: AnalyzeRoutinesUsageUseCaseImpl,
        },
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
          provide: PatchThumbnailUseCase,
          useClass: MockPatchThumbnailUseCaseImpl,
        },
        {
          provide: PatchCardnewsUseCase,
          useClass: MockPatchCardnewsUseCaseImpl,
        },
        {
          provide: AddBannerUseCase,
          useClass: AddBannerUseCaseImpl,
        },
        {
          provide: ModifyBannerUseCase,
          useClass: ModifyBannerUseCaseImpl,
        },
        {
          provide: DeleteBannerUseCase,
          useClass: DeleteBannerUseCaseImpl,
        },
        {
          provide: AddImageByAdminUseCase,
          useClass: AddImageByAdminUseCaseImpl,
        },
      ],
      controllers: [AdminControllerInjectedDecorator],
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

  describe('PATCH v1/admin/recommended-routines/:id/thumbnail', () => {
    describe('before getting admin authorization...', () => {
      describe('try patch thumbnail', () => {
        describe('using invalid mongo object id with thumbnail', () => {
          it('InvalidMongoObjectIdException should be thrown', async () => {
            const res: request.Response = await request(httpServer)
              .patch(`/v1/admin/recommended-routines/123/thumbnail`)
              .set('Content-Type', 'multipart/form-data')
              .attach('thumbnail', 'test/e2e/admin/thumbnail.jpg');

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
                `/v1/admin/recommended-routines/123456789101112131415161/thumbnail`,
              )
              .set('Content-Type', 'multipart/form-data')
              .attach('thumbnail', 'test/e2e/admin/thumbnail.jpg');

            expect(res.statusCode).toBe(404);
          });
        });

        describe('using invalid mongo object id with thumbnail', () => {
          it('InvalidMongoObjectIdException should be thrown', async () => {
            const res: request.Response = await request(httpServer)
              .patch(`/v1/admin/recommended-routines/123/thumbnail`)
              .set('Content-Type', 'multipart/form-data')
              .attach('thumbnail', 'test/e2e/admin/thumbnail.jpg');

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
        days: [],
        contentVideoId: '',
      };

      const res: request.Response = await request(httpServer)
        .post('/v1/admin/recommended-routines')
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
            .patch(`/v1/admin/recommended-routines/123/thumbnail`)
            .set('Content-Type', 'multipart/form-data')
            .attach('thumbnail', 'test/e2e/admin/thumbnail.jpg');

          expect(res.statusCode).toBe(400);
        });
      });

      describe('using valid mongo object id with thumbnail', () => {
        it('should return routineModel', async () => {
          const res: request.Response = await request(httpServer)
            .patch(`/v1/admin/recommended-routines/${routineId}/thumbnail`)
            .set('Content-Type', 'multipart/form-data')
            .attach('thumbnail', 'test/e2e/admin/thumbnail.jpg');

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
            .patch(`/v1/admin/recommended-routines/123/cardnews`)
            .set('Authorization', `Bearer ${accessToken}`)
            .set('Content-Type', 'multipart/form-data')
            .attach('cardnews', 'test/e2e/admin/1.jpg')
            .attach('cardnews', 'test/e2e/admin/1.jpg', 'test/e2e/admin/2.jpg');

          expect(res.statusCode).toBe(400);
        });
      });

      describe('using valid mongo object id with cardnews', () => {
        it('should return routineModel', async () => {
          const res: request.Response = await request(httpServer)
            .patch(`/v1/admin/recommended-routines/${routineId}/cardnews`)
            .set('Authorization', `Bearer ${accessToken}`)
            .set('Content-Type', 'multipart/form-data')
            .attach('cardnews', 'test/e2e/admin/1.jpg')
            .attach('cardnews', 'test/e2e/admin/1.jpg', 'test/e2e/admin/2.jpg');

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
