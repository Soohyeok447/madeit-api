import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { setTimeOut } from '../e2e-env';
import { CoreModule, DatabaseService } from '../../../src/ioc/CoreModule';
import { InitApp } from '../config';
import { Category } from '../../../src/domain/common/enums/Category';
import { FixedField } from '../../../src/domain/common/enums/FixedField';
import { Connection } from 'mongoose';
import * as request from 'supertest';
import { AddRecommendedRoutineRequestDto } from '../../../src/adapter/recommended-routine/add-recommended-routine/AddRecommendedRoutineRequestDto';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AddRecommendedRoutineUseCase } from '../../../src/domain/use-cases/admin/add-recommended-routine/AddRecommendedRoutineUseCase';
import { MockAddRecommendedRoutineUseCaseImpl } from '../../../src/domain/use-cases/admin/add-recommended-routine/mock/MockAddRecommendedRoutineUseCase';

import { ProviderModule } from '../../../src/ioc/ProviderModule';
import { RepositoryModule } from '../../../src/ioc/RepositoryModule';
import { LoggerModule } from '../../../src/ioc/LoggerModule';
import { AnalyzeRoutinesUsageUseCase } from '../../../src/domain/use-cases/admin/analyze-routines-usage/AnalyzeRoutinesUsageUseCase';
import { AnalyzeRoutinesUsageUseCaseImpl } from '../../../src/domain/use-cases/admin/analyze-routines-usage/AnalyzeRoutinesUsageUseCaseImpl';
import { CountUsersAddedOneRoutineUseCase } from '../../../src/domain/use-cases/admin/count-users-added-one-routine/CountUsersAddedOneRoutineUseCase';
import { CountUsersAddedOneRoutineUseCaseImpl } from '../../../src/domain/use-cases/admin/count-users-added-one-routine/CountUsersAddedOneRoutineUseCaseImpl';
import { CountUsersUseCase } from '../../../src/domain/use-cases/admin/count-users/CountUsersUseCase';
import { CountUsersUseCaseImpl } from '../../../src/domain/use-cases/admin/count-users/CountUsersUseCaseImpl';
import { IssueAdminTokenUseCase } from '../../../src/domain/use-cases/admin/issue-admin-token/IssueAdminTokenUseCase';
import { IssueAdminTokenUseCaseImpl } from '../../../src/domain/use-cases/admin/issue-admin-token/IssueAdminTokenUseCaseImpl';
import { RefreshAdminTokenUseCase } from '../../../src/domain/use-cases/admin/refresh-admin-token/RefreshAdminTokenUseCase';
import { RefreshAdminTokenUseCaseImpl } from '../../../src/domain/use-cases/admin/refresh-admin-token/RefreshAdminTokenUseCaseImpl';
import { RegisterAdminUseCase } from '../../../src/domain/use-cases/admin/register-admin/RegisterAdminUseCase';
import { RegisterAdminUseCaseImpl } from '../../../src/domain/use-cases/admin/register-admin/RegisterAdminUseCaseImpl';
import { AdminControllerInjectedDecorator } from '../../../src/ioc/controllers/admin/AdminControllerInjectedDecorator';
import { AdminModule } from '../../../src/ioc/AdminModule';
import { AuthModule } from '../../../src/ioc/AuthModule';
import { RecommendedRoutineModule } from '../../../src/ioc/RecommendedRoutineModule';
import { AddBannerUseCase } from '../../../src/domain/use-cases/admin/add-banner/AddBannerUseCase';
import { AddBannerUseCaseImpl } from '../../../src/domain/use-cases/admin/add-banner/AddBannerUseCaseImpl';
import { AddImageByAdminUseCase } from '../../../src/domain/use-cases/admin/add-image-by-admin/AddImageByAdminUseCase';
import { AddImageByAdminUseCaseImpl } from '../../../src/domain/use-cases/admin/add-image-by-admin/AddImageByAdminUseCaseImpl';
import { DeleteBannerUseCase } from '../../../src/domain/use-cases/admin/delete-banner/DeleteBannerUseCase';
import { DeleteBannerUseCaseImpl } from '../../../src/domain/use-cases/admin/delete-banner/DeleteBannerUseCaseImpl';
import { ModifyBannerUseCase } from '../../../src/domain/use-cases/admin/modify-banner/ModifyBannerUseCase';
import { ModifyBannerUseCaseImpl } from '../../../src/domain/use-cases/admin/modify-banner/ModifyBannerUseCaseImpl';
import { MockDeleteRecommendedRoutineUseCaseImpl } from '../../../src/domain/use-cases/admin/delete-recommended-routine/mock/MockDeleteRecommendedRoutineUseCaseImpl';
import { MockModifyRecommendedRoutineUseCaseImpl } from '../../../src/domain/use-cases/admin/modify-recommended-routine/mock/MockModifyRecommendedRoutineUseCase';
import { DeleteRecommendedRoutineUseCase } from '../../../src/domain/use-cases/admin/delete-recommended-routine/DeleteRecommendedRoutineUseCase';
import { ModifyRecommendedRoutineUseCase } from '../../../src/domain/use-cases/admin/modify-recommended-routine/ModifyRecommendedRoutineUseCase';
import { PatchCardnewsUseCase } from '../../../src/domain/use-cases/admin/patch-cardnews/PatchCardnewsUseCase';
import { PatchThumbnailUseCase } from '../../../src/domain/use-cases/admin/patch-thumbnail/PatchThumbnailUseCase';
import { MockPatchThumbnailUseCaseImpl } from '../../../src/domain/use-cases/admin/patch-thumbnail/mock/MockPatchThumbnailUseCase';
import { MockPatchCardnewsUseCaseImpl } from '../../../src/domain/use-cases/admin/patch-cardnews/mock/MockPatchCardnewsUseCase';

describe('deleteRecommendedRoutine e2e test', () => {
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
      controllers: [AdminControllerInjectedDecorator],
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
        };

        const res: request.Response = await request(httpServer)
          .post('/v1/admin/recommended-routines')
          .set('Accept', 'application/json')
          .type('application/json')
          .send(addRoutineParam);

        routineId = res.body.id;
      });
    });
  });

  describe('Delete v1/admin/recommended-routines/:id', () => {
    describe('try delete an recommended routine', () => {
      it('expect to succeed remonvig an recommended routine', async () => {
        const res: request.Response = await request(httpServer).delete(
          `/v1/admin/recommended-routines/${routineId}`,
        );

        expect(res.statusCode).toBe(200);
      });
    });

    describe('try delete already deleted recommended routine', () => {
      it('NotFoundRecommededRoutineException should be thrown', async () => {
        const res: request.Response = await request(httpServer).delete(
          `/v1/admin/recommended-routines/${routineId}`,
        );

        expect(res.statusCode).toBe(404);
        expect(res.body.errorCode).toBe(72);
      });
    });
  });
});

/***
 * 추천 루틴 생성
 * 추천 루틴 삭제
 * 삭제된 것 확인
 */
