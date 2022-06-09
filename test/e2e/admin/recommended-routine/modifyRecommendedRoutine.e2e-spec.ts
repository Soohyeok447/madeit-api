import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Connection } from 'mongoose';
import * as request from 'supertest';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AddRecommendedRoutineRequestDto } from '../../../../src/adapter/admin/recommended-routine/add-recommended-routine/AddRecommendedRoutineRequestDto';
import { ModifyRecommendedRoutineRequestDto } from '../../../../src/adapter/admin/recommended-routine/modify-recommended-routine/ModifyRecommendedRoutineRequestDto';
import { Category } from '../../../../src/domain/common/enums/Category';
import { FixedField } from '../../../../src/domain/common/enums/FixedField';
import { AddBannerUseCase } from '../../../../src/domain/use-cases/admin/banner/add-banner/AddBannerUseCase';
import { AddBannerUseCaseImpl } from '../../../../src/domain/use-cases/admin/banner/add-banner/AddBannerUseCaseImpl';
import { AddImageByAdminUseCase } from '../../../../src/domain/use-cases/admin/add-image-by-admin/AddImageByAdminUseCase';
import { AddImageByAdminUseCaseImpl } from '../../../../src/domain/use-cases/admin/add-image-by-admin/AddImageByAdminUseCaseImpl';
import { AddRecommendedRoutineUseCase } from '../../../../src/domain/use-cases/admin/recommended-routine/add-recommended-routine/AddRecommendedRoutineUseCase';
import { MockAddRecommendedRoutineUseCaseImpl } from '../../../../src/domain/use-cases/admin/recommended-routine/add-recommended-routine/mock/MockAddRecommendedRoutineUseCase';
import { AnalyzeRoutinesUsageUseCase } from '../../../../src/domain/use-cases/admin/analyze/analyze-routines-usage/AnalyzeRoutinesUsageUseCase';
import { AnalyzeRoutinesUsageUseCaseImpl } from '../../../../src/domain/use-cases/admin/analyze/analyze-routines-usage/AnalyzeRoutinesUsageUseCaseImpl';
import { CountUsersAddedOneRoutineUseCase } from '../../../../src/domain/use-cases/admin/analyze/count-users-added-one-routine/CountUsersAddedOneRoutineUseCase';
import { CountUsersAddedOneRoutineUseCaseImpl } from '../../../../src/domain/use-cases/admin/analyze/count-users-added-one-routine/CountUsersAddedOneRoutineUseCaseImpl';
import { CountUsersUseCase } from '../../../../src/domain/use-cases/admin/analyze/count-users/CountUsersUseCase';
import { CountUsersUseCaseImpl } from '../../../../src/domain/use-cases/admin/analyze/count-users/CountUsersUseCaseImpl';
import { DeleteBannerUseCase } from '../../../../src/domain/use-cases/admin/banner/delete-banner/DeleteBannerUseCase';
import { DeleteBannerUseCaseImpl } from '../../../../src/domain/use-cases/admin/banner/delete-banner/DeleteBannerUseCaseImpl';
import { DeleteRecommendedRoutineUseCase } from '../../../../src/domain/use-cases/admin/recommended-routine/delete-recommended-routine/DeleteRecommendedRoutineUseCase';
import { MockDeleteRecommendedRoutineUseCaseImpl } from '../../../../src/domain/use-cases/admin/recommended-routine/delete-recommended-routine/mock/MockDeleteRecommendedRoutineUseCaseImpl';
import { IssueAdminTokenUseCase } from '../../../../src/domain/use-cases/admin/issue-admin-token/IssueAdminTokenUseCase';
import { IssueAdminTokenUseCaseImpl } from '../../../../src/domain/use-cases/admin/issue-admin-token/IssueAdminTokenUseCaseImpl';
import { ModifyBannerUseCase } from '../../../../src/domain/use-cases/admin/banner/modify-banner/ModifyBannerUseCase';
import { ModifyBannerUseCaseImpl } from '../../../../src/domain/use-cases/admin/banner/modify-banner/ModifyBannerUseCaseImpl';
import { MockModifyRecommendedRoutineUseCaseImpl } from '../../../../src/domain/use-cases/admin/recommended-routine/modify-recommended-routine/mock/MockModifyRecommendedRoutineUseCase';
import { ModifyRecommendedRoutineUseCase } from '../../../../src/domain/use-cases/admin/recommended-routine/modify-recommended-routine/ModifyRecommendedRoutineUseCase';
import { MockPatchCardnewsUseCaseImpl } from '../../../../src/domain/use-cases/admin/recommended-routine/patch-cardnews/mock/MockPatchCardnewsUseCase';
import { PatchCardnewsUseCase } from '../../../../src/domain/use-cases/admin/recommended-routine/patch-cardnews/PatchCardnewsUseCase';
import { MockPatchThumbnailUseCaseImpl } from '../../../../src/domain/use-cases/admin/recommended-routine/patch-thumbnail/mock/MockPatchThumbnailUseCase';
import { PatchThumbnailUseCase } from '../../../../src/domain/use-cases/admin/recommended-routine/patch-thumbnail/PatchThumbnailUseCase';
import { RefreshAdminTokenUseCase } from '../../../../src/domain/use-cases/admin/refresh-admin-token/RefreshAdminTokenUseCase';
import { RefreshAdminTokenUseCaseImpl } from '../../../../src/domain/use-cases/admin/refresh-admin-token/RefreshAdminTokenUseCaseImpl';
import { RegisterAdminUseCase } from '../../../../src/domain/use-cases/admin/register-admin/RegisterAdminUseCase';
import { RegisterAdminUseCaseImpl } from '../../../../src/domain/use-cases/admin/register-admin/RegisterAdminUseCaseImpl';
import { AdminModule } from '../../../../src/ioc/AdminModule';
import { AuthModule } from '../../../../src/ioc/AuthModule';
import { AdminControllerInjectedDecorator } from '../../../../src/ioc/controllers/admin/AdminControllerInjectedDecorator';
import { AdminAnalyzeControllerInjectedDecorator } from '../../../../src/ioc/controllers/admin/analyze/AdminAnalyzeControllerInjectedDecorator';
import { AdminBannerControllerInjectedDecorator } from '../../../../src/ioc/controllers/admin/banner/AdminBannerControllerInjectedDecorator';
import { AdminRecommendedRoutineControllerInjectedDecorator } from '../../../../src/ioc/controllers/admin/recommended-routine/AdminRecommendedRoutineControllerInjectedDecorator';
import { CoreModule, DatabaseService } from '../../../../src/ioc/CoreModule';
import { LoggerModule } from '../../../../src/ioc/LoggerModule';
import { ProviderModule } from '../../../../src/ioc/ProviderModule';
import { RecommendedRoutineModule } from '../../../../src/ioc/RecommendedRoutineModule';
import { RepositoryModule } from '../../../../src/ioc/RepositoryModule';
import { InitApp } from '../../config';
import { setTimeOut } from '../../e2e-env';

describe('modifyRecommendedRoutine e2e test', () => {
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

  let routineId: string;

  describe('POST v1/admin/recommended-routines', () => {
    describe('try add an recommended routine', () => {
      it('success to add recommded routine', async () => {
        const addRoutineParam: AddRecommendedRoutineRequestDto = {
          title: '타이틀',
          introduction: '소개글',
          category: Category.Health,
          fixedFields: [FixedField.Title, FixedField.ContentVideoId],
          hour: 3,
          minute: 30,
          days: [],
          contentVideoId: '',
        };

        await request(httpServer)
          .post('/v1/admin/recommended-routines')
          .set('Accept', 'application/json')
          .type('application/json')
          .send(addRoutineParam);

        const addRoutineParam2: AddRecommendedRoutineRequestDto = {
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
          .send(addRoutineParam2);

        routineId = res.body.id;
      });
    });
  });

  describe('PATCH v1/admin/recommended-routines/:id', () => {
    describe('try modify an recommended routine', () => {
      describe('using invalid request body', () => {
        it('BadRequestException should be return', async () => {
          const modifyRoutineParam: any = {
            category: '잘못된 카테고리',
          };

          const res: request.Response = await request(httpServer)
            .patch(`/v1/admin/recommended-routines/${routineId}`)
            .set('Accept', 'application/json')
            .type('application/json')
            .send(modifyRoutineParam);

          expect(res.statusCode).toBe(400);
        });
      });

      describe('using valid request body that include duplicated title', () => {
        it('ConflictTitleException should be return', async () => {
          const modifyRoutineParam: ModifyRecommendedRoutineRequestDto = {
            title: '타이틀',
            introduction: '소개글',
            category: Category.Health,
          };

          const res: request.Response = await request(httpServer)
            .patch(`/v1/admin/recommended-routines/${routineId}`)
            .set('Accept', 'application/json')
            .type('application/json')
            .send(modifyRoutineParam);

          expect(res.statusCode).toBe(409);
        });
      });

      describe('using valid request body', () => {
        it('recommended routine model should be return', async () => {
          const modifyRoutineParam: ModifyRecommendedRoutineRequestDto = {
            title: '이거 괜찮습니다~~',
            introduction: '수정된 소개글',
            category: Category.Health,
          };

          const res: request.Response = await request(httpServer)
            .patch(`/v1/admin/recommended-routines/${routineId}`)
            .set('Accept', 'application/json')
            .type('application/json')
            .send(modifyRoutineParam);

          expect(res.statusCode).toBe(200);
          expect(res.body.introduction).toEqual('수정된 소개글');
        });
      });
    });
  });
});

/***
 * 추천 루틴 2개 추가 -> 그 중 1개의 routineId 저장
 * 잘못된 form (category, fixedFields)
 * 중복된 이름으로 수정시도
 * 수정 성공
 * 수정된 것 확인
 */
