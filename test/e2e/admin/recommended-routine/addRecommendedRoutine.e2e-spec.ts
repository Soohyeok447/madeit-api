import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { setTimeOut } from '../../e2e-env';
import { CoreModule, DatabaseService } from '../../../../src/ioc/CoreModule';
import { InitApp } from '../../config';
import { Category } from '../../../../src/domain/common/enums/Category';
import { FixedField } from '../../../../src/domain/common/enums/FixedField';
import { Connection } from 'mongoose';
import * as request from 'supertest';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ProviderModule } from '../../../../src/ioc/ProviderModule';
import { RepositoryModule } from '../../../../src/ioc/RepositoryModule';
import { LoggerModule } from '../../../../src/ioc/LoggerModule';
import { AdminModule } from '../../../../src/ioc/AdminModule';
import { AuthModule } from '../../../../src/ioc/AuthModule';
import { RecommendedRoutineModule } from '../../../../src/ioc/RecommendedRoutineModule';
import { AddRecommendedRoutineUseCase } from '../../../../src/domain/use-cases/admin/add-recommended-routine/AddRecommendedRoutineUseCase';
import { MockAddRecommendedRoutineUseCaseImpl } from '../../../../src/domain/use-cases/admin/add-recommended-routine/mock/MockAddRecommendedRoutineUseCase';
import { AddBannerUseCase } from '../../../../src/domain/use-cases/admin/add-banner/AddBannerUseCase';
import { AddBannerUseCaseImpl } from '../../../../src/domain/use-cases/admin/add-banner/AddBannerUseCaseImpl';
import { AddImageByAdminUseCase } from '../../../../src/domain/use-cases/admin/add-image-by-admin/AddImageByAdminUseCase';
import { AddImageByAdminUseCaseImpl } from '../../../../src/domain/use-cases/admin/add-image-by-admin/AddImageByAdminUseCaseImpl';
import { AnalyzeRoutinesUsageUseCase } from '../../../../src/domain/use-cases/admin/analyze-routines-usage/AnalyzeRoutinesUsageUseCase';
import { AnalyzeRoutinesUsageUseCaseImpl } from '../../../../src/domain/use-cases/admin/analyze-routines-usage/AnalyzeRoutinesUsageUseCaseImpl';
import { CountUsersAddedOneRoutineUseCase } from '../../../../src/domain/use-cases/admin/count-users-added-one-routine/CountUsersAddedOneRoutineUseCase';
import { CountUsersAddedOneRoutineUseCaseImpl } from '../../../../src/domain/use-cases/admin/count-users-added-one-routine/CountUsersAddedOneRoutineUseCaseImpl';
import { CountUsersUseCase } from '../../../../src/domain/use-cases/admin/count-users/CountUsersUseCase';
import { CountUsersUseCaseImpl } from '../../../../src/domain/use-cases/admin/count-users/CountUsersUseCaseImpl';
import { DeleteBannerUseCase } from '../../../../src/domain/use-cases/admin/delete-banner/DeleteBannerUseCase';
import { DeleteBannerUseCaseImpl } from '../../../../src/domain/use-cases/admin/delete-banner/DeleteBannerUseCaseImpl';
import { DeleteRecommendedRoutineUseCase } from '../../../../src/domain/use-cases/admin/delete-recommended-routine/DeleteRecommendedRoutineUseCase';
import { DeleteRecommendedRoutineUseCaseImpl } from '../../../../src/domain/use-cases/admin/delete-recommended-routine/DeleteRecommendedRoutineUseCaseImpl';
import { IssueAdminTokenUseCase } from '../../../../src/domain/use-cases/admin/issue-admin-token/IssueAdminTokenUseCase';
import { IssueAdminTokenUseCaseImpl } from '../../../../src/domain/use-cases/admin/issue-admin-token/IssueAdminTokenUseCaseImpl';
import { ModifyBannerUseCase } from '../../../../src/domain/use-cases/admin/modify-banner/ModifyBannerUseCase';
import { ModifyBannerUseCaseImpl } from '../../../../src/domain/use-cases/admin/modify-banner/ModifyBannerUseCaseImpl';
import { ModifyRecommendedRoutineUseCase } from '../../../../src/domain/use-cases/admin/modify-recommended-routine/ModifyRecommendedRoutineUseCase';
import { ModifyRecommendedRoutineUseCaseImpl } from '../../../../src/domain/use-cases/admin/modify-recommended-routine/ModifyRecommendedRoutineUseCaseImpl';
import { PatchCardnewsUseCase } from '../../../../src/domain/use-cases/admin/patch-cardnews/PatchCardnewsUseCase';
import { PatchCardnewsUseCaseImpl } from '../../../../src/domain/use-cases/admin/patch-cardnews/PatchCardnewsUseCaseImpl';
import { PatchThumbnailUseCase } from '../../../../src/domain/use-cases/admin/patch-thumbnail/PatchThumbnailUseCase';
import { PatchThumbnailUseCaseImpl } from '../../../../src/domain/use-cases/admin/patch-thumbnail/PatchThumbnailUseCaseImpl';
import { RefreshAdminTokenUseCase } from '../../../../src/domain/use-cases/admin/refresh-admin-token/RefreshAdminTokenUseCase';
import { RefreshAdminTokenUseCaseImpl } from '../../../../src/domain/use-cases/admin/refresh-admin-token/RefreshAdminTokenUseCaseImpl';
import { RegisterAdminUseCase } from '../../../../src/domain/use-cases/admin/register-admin/RegisterAdminUseCase';
import { RegisterAdminUseCaseImpl } from '../../../../src/domain/use-cases/admin/register-admin/RegisterAdminUseCaseImpl';
import { AdminControllerInjectedDecorator } from '../../../../src/ioc/controllers/admin/AdminControllerInjectedDecorator';
import { AddRecommendedRoutineRequestDto } from '../../../../src/adapter/admin/recommended-routine/add-recommended-routine/AddRecommendedRoutineRequestDto';
import { AdminAnalyzeControllerInjectedDecorator } from '../../../../src/ioc/controllers/admin/analyze/AdminAnalyzeControllerInjectedDecorator';
import { AdminBannerControllerInjectedDecorator } from '../../../../src/ioc/controllers/admin/banner/AdminBannerControllerInjectedDecorator';
import { AdminRecommendedRoutineControllerInjectedDecorator } from '../../../../src/ioc/controllers/admin/recommended-routine/AdminRecommendedRoutineControllerInjectedDecorator';

describe('addRecommendedRoutine e2e test', () => {
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
        LoggerModule.forRoot(),
        AdminModule,
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
          useClass: ModifyRecommendedRoutineUseCaseImpl,
        },
        {
          provide: DeleteRecommendedRoutineUseCase,
          useClass: DeleteRecommendedRoutineUseCaseImpl,
        },
        {
          provide: PatchThumbnailUseCase,
          useClass: PatchThumbnailUseCaseImpl,
        },
        {
          provide: PatchCardnewsUseCase,
          useClass: PatchCardnewsUseCaseImpl,
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
      controllers: [
        AdminControllerInjectedDecorator,
        AdminBannerControllerInjectedDecorator,
        AdminRecommendedRoutineControllerInjectedDecorator,
        AdminAnalyzeControllerInjectedDecorator,
      ],
    }).compile();

    app = await InitApp(app, moduleRef);

    dbConnection = moduleRef
      .get<DatabaseService>(DatabaseService)
      .getConnection();
    httpServer = app.getHttpServer();
  });

  afterAll(async () => {
    await dbConnection.collection('users').deleteMany({});
    await dbConnection.collection('recommended-routines').deleteMany({});

    await app.close();
  });

  describe('POST v1/recommended-routines', () => {
    describe('try add an recommended routine', () => {
      describe('using not intact request body', () => {
        it('BadRequestException should be return', async () => {
          const addRoutineParam: any = {
            title: '타이틀',
          };

          const res: request.Response = await request(httpServer)
            .post('/v1/admin/recommended-routines')
            .set('Accept', 'application/json')
            .type('application/json')
            .send(addRoutineParam);

          expect(res.statusCode).toBe(400);
        });
      });

      describe('using valid request body', () => {
        describe('before get authorization', () => {
          it('UserNotAdminException should be return', async () => {
            const addRoutineParam: AddRecommendedRoutineRequestDto = {
              title: 'UserIsNotAdmin',
              introduction: '소개글',
              category: Category.Health,
              days: [],
              contentVideoId: '',
            };

            const res: request.Response = await request(httpServer)
              .post('/v1/admin/recommended-routines')
              .set('Accept', 'application/json')
              .type('application/json')
              .send(addRoutineParam);

            expect(res.statusCode).toBe(401);
          });
        });
      });

      describe('using valid request body after get authorization', () => {
        it('recommended routine model should be return', async () => {
          const addRoutineParam: AddRecommendedRoutineRequestDto = {
            title: '타이틀',
            introduction: '소개글',
            category: Category.Health,
            days: [],
            contentVideoId: '',
          };

          const res: request.Response = await request(httpServer)
            .post('/v1/admin/recommended-routines')
            .set('Accept', 'application/json')
            .type('application/json')
            .send(addRoutineParam);

          expect(res.statusCode).toBe(201);
        });
      });

      describe('try add recommended routine that has duplicated title ', () => {
        it('TitleConflictException should be thrown', async () => {
          const addRoutineParam: AddRecommendedRoutineRequestDto = {
            title: '타이틀',
            introduction: '소개글',
            days: [],
            category: Category.Health,
            contentVideoId: '',
          };

          const res: request.Response = await request(httpServer)
            .post('/v1/admin/recommended-routines')
            .set('Accept', 'application/json')
            .type('application/json')
            .send(addRoutineParam);

          expect(res.statusCode).toBe(409);
          expect(res.body.errorCode).toBe(1);
        });
      });

      describe('using valid request body without duplicated title', () => {
        it('recommended routine model should be return', async () => {
          const addRoutineParam: AddRecommendedRoutineRequestDto = {
            title: '중복되지 않은 타이틀',
            introduction: '소개글',
            category: Category.Health,
            fixedFields: [FixedField.Title, FixedField.ContentVideoId],
            hour: 3,
            minute: 30,
            days: [],
            contentVideoId: '',
          };

          const res: request.Response = await request(httpServer)
            .post('/v1/admin/recommended-routines')
            .set('Accept', 'application/json')
            .type('application/json')
            .send(addRoutineParam);

          expect(res.statusCode).toBe(201);
          expect(res.body.fixedFields).toEqual([
            FixedField.Title,
            FixedField.ContentVideoId,
          ]);
          expect(res.body.hour).toEqual(3);
          expect(res.body.minute).toEqual(30);
        });
      });
    });
  });
});

/***
 * 완전치 않은 request body
 * 어드민이 아님
 * 추천 루틴 추가
 * 중복된 이름으로 추가시도
 * 새 추천 루틴 추가
 */
