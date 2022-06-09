import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { Connection } from 'mongoose';
import * as request from 'supertest';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AddBannerUseCase } from '../../../../src/domain/use-cases/admin/add-banner/AddBannerUseCase';
import { MockAddBannerUseCaseImpl } from '../../../../src/domain/use-cases/admin/add-banner/mock/MockAddBannerUseCaseImpl';
import { AddImageByAdminUseCase } from '../../../../src/domain/use-cases/admin/add-image-by-admin/AddImageByAdminUseCase';
import { MockAddImageByAdminUseCaseImpl } from '../../../../src/domain/use-cases/admin/add-image-by-admin/mock/MockAddImageByAdminUseCaseImpl';
import { AddRecommendedRoutineUseCase } from '../../../../src/domain/use-cases/admin/add-recommended-routine/AddRecommendedRoutineUseCase';
import { MockAddRecommendedRoutineUseCaseImpl } from '../../../../src/domain/use-cases/admin/add-recommended-routine/mock/MockAddRecommendedRoutineUseCase';
import { AnalyzeRoutinesUsageUseCase } from '../../../../src/domain/use-cases/admin/analyze-routines-usage/AnalyzeRoutinesUsageUseCase';
import { AnalyzeRoutinesUsageUseCaseImpl } from '../../../../src/domain/use-cases/admin/analyze-routines-usage/AnalyzeRoutinesUsageUseCaseImpl';
import { CountUsersAddedOneRoutineUseCase } from '../../../../src/domain/use-cases/admin/count-users-added-one-routine/CountUsersAddedOneRoutineUseCase';
import { CountUsersAddedOneRoutineUseCaseImpl } from '../../../../src/domain/use-cases/admin/count-users-added-one-routine/CountUsersAddedOneRoutineUseCaseImpl';
import { CountUsersUseCase } from '../../../../src/domain/use-cases/admin/count-users/CountUsersUseCase';
import { CountUsersUseCaseImpl } from '../../../../src/domain/use-cases/admin/count-users/CountUsersUseCaseImpl';
import { DeleteBannerUseCase } from '../../../../src/domain/use-cases/admin/delete-banner/DeleteBannerUseCase';
import { MockDeleteBannerUseCaseImpl } from '../../../../src/domain/use-cases/admin/delete-banner/mock/MockDeleteBannerUseCaseImpl';
import { DeleteRecommendedRoutineUseCase } from '../../../../src/domain/use-cases/admin/delete-recommended-routine/DeleteRecommendedRoutineUseCase';
import { DeleteRecommendedRoutineUseCaseImpl } from '../../../../src/domain/use-cases/admin/delete-recommended-routine/DeleteRecommendedRoutineUseCaseImpl';
import { IssueAdminTokenUseCase } from '../../../../src/domain/use-cases/admin/issue-admin-token/IssueAdminTokenUseCase';
import { IssueAdminTokenUseCaseImpl } from '../../../../src/domain/use-cases/admin/issue-admin-token/IssueAdminTokenUseCaseImpl';
import { MockModifyBannerUseCaseImpl } from '../../../../src/domain/use-cases/admin/modify-banner/mock/MockModifyBannerUseCaseImpl';
import { ModifyBannerUseCase } from '../../../../src/domain/use-cases/admin/modify-banner/ModifyBannerUseCase';
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

describe('deleteBanner e2e test', () => {
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
          useClass: MockAddBannerUseCaseImpl,
        },
        {
          provide: ModifyBannerUseCase,
          useClass: MockModifyBannerUseCaseImpl,
        },
        {
          provide: DeleteBannerUseCase,
          useClass: MockDeleteBannerUseCaseImpl,
        },
        {
          provide: AddImageByAdminUseCase,
          useClass: MockAddImageByAdminUseCaseImpl,
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
    await dbConnection.collection('banners').deleteMany({});
    await dbConnection.collection('imagesv2').deleteMany({});

    await app.close();
  });

  let imageId: string;
  let bannerId: string;

  describe('post banner image', () => {
    it('success to post image', async () => {
      const res: request.Response = await request(httpServer).post(
        '/v1/admin/image',
      );

      imageId = res.body.id;
    });
  });

  describe('post banner', () => {
    it('banner entity should be return', async () => {
      const addBannerParam: any = {
        title: 'testBanner',
        contentVideoId: 'test',
        bannerImageId: imageId,
      };

      const res: request.Response = await request(httpServer)
        .post('/v1/admin/banner')
        .set('Accept', 'application/json')
        .type('application/json')
        .send(addBannerParam);

      bannerId = res.body.id;

      expect(res.statusCode).toBe(201);
    });
  });

  describe('try delete banner', () => {
    it('BannerNotFoundException should be thrown', async () => {
      const res: request.Response = await request(httpServer).delete(
        `/v1/admin/banner/6288cce698eb63ed75fef163`,
      );

      expect(res.statusCode).toBe(404);
    });

    it('it should be deleted successfully', async () => {
      const res: request.Response = await request(httpServer).delete(
        `/v1/admin/banner/${bannerId}`,
      );

      expect(res.statusCode).toBe(200);
    });
  });
});

/***
 * 이미지 생성 후 배너 생성
 * 배너 수정 실패 (속성 부족한 body)
 * 배너 수정 성공
 */
