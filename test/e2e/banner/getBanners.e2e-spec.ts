import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { setTimeOut } from '../e2e-env';
import { CoreModule, DatabaseService } from '../../../src/ioc/CoreModule';
import { InitApp } from '../config';
import { Connection } from 'mongoose';
import * as request from 'supertest';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ProviderModule } from '../../../src/ioc/ProviderModule';
import { RepositoryModule } from '../../../src/ioc/RepositoryModule';
import { LoggerModule } from '../../../src/ioc/LoggerModule';
import { AdminModule } from '../../../src/ioc/AdminModule';
import { AuthModule } from '../../../src/ioc/AuthModule';
import { RecommendedRoutineModule } from '../../../src/ioc/RecommendedRoutineModule';
import { AddRecommendedRoutineUseCase } from '../../../src/domain/use-cases/admin/add-recommended-routine/AddRecommendedRoutineUseCase';
import { MockAddRecommendedRoutineUseCaseImpl } from '../../../src/domain/use-cases/admin/add-recommended-routine/mock/MockAddRecommendedRoutineUseCase';
import { AddBannerUseCase } from '../../../src/domain/use-cases/admin/add-banner/AddBannerUseCase';
import { AddImageByAdminUseCase } from '../../../src/domain/use-cases/admin/add-image-by-admin/AddImageByAdminUseCase';
import { AnalyzeRoutinesUsageUseCase } from '../../../src/domain/use-cases/admin/analyze-routines-usage/AnalyzeRoutinesUsageUseCase';
import { AnalyzeRoutinesUsageUseCaseImpl } from '../../../src/domain/use-cases/admin/analyze-routines-usage/AnalyzeRoutinesUsageUseCaseImpl';
import { CountUsersAddedOneRoutineUseCase } from '../../../src/domain/use-cases/admin/count-users-added-one-routine/CountUsersAddedOneRoutineUseCase';
import { CountUsersAddedOneRoutineUseCaseImpl } from '../../../src/domain/use-cases/admin/count-users-added-one-routine/CountUsersAddedOneRoutineUseCaseImpl';
import { CountUsersUseCase } from '../../../src/domain/use-cases/admin/count-users/CountUsersUseCase';
import { CountUsersUseCaseImpl } from '../../../src/domain/use-cases/admin/count-users/CountUsersUseCaseImpl';
import { DeleteBannerUseCase } from '../../../src/domain/use-cases/admin/delete-banner/DeleteBannerUseCase';
import { DeleteRecommendedRoutineUseCase } from '../../../src/domain/use-cases/admin/delete-recommended-routine/DeleteRecommendedRoutineUseCase';
import { DeleteRecommendedRoutineUseCaseImpl } from '../../../src/domain/use-cases/admin/delete-recommended-routine/DeleteRecommendedRoutineUseCaseImpl';
import { IssueAdminTokenUseCase } from '../../../src/domain/use-cases/admin/issue-admin-token/IssueAdminTokenUseCase';
import { IssueAdminTokenUseCaseImpl } from '../../../src/domain/use-cases/admin/issue-admin-token/IssueAdminTokenUseCaseImpl';
import { ModifyBannerUseCase } from '../../../src/domain/use-cases/admin/modify-banner/ModifyBannerUseCase';
import { ModifyRecommendedRoutineUseCase } from '../../../src/domain/use-cases/admin/modify-recommended-routine/ModifyRecommendedRoutineUseCase';
import { ModifyRecommendedRoutineUseCaseImpl } from '../../../src/domain/use-cases/admin/modify-recommended-routine/ModifyRecommendedRoutineUseCaseImpl';
import { PatchCardnewsUseCase } from '../../../src/domain/use-cases/admin/patch-cardnews/PatchCardnewsUseCase';
import { PatchCardnewsUseCaseImpl } from '../../../src/domain/use-cases/admin/patch-cardnews/PatchCardnewsUseCaseImpl';
import { PatchThumbnailUseCase } from '../../../src/domain/use-cases/admin/patch-thumbnail/PatchThumbnailUseCase';
import { PatchThumbnailUseCaseImpl } from '../../../src/domain/use-cases/admin/patch-thumbnail/PatchThumbnailUseCaseImpl';
import { RefreshAdminTokenUseCase } from '../../../src/domain/use-cases/admin/refresh-admin-token/RefreshAdminTokenUseCase';
import { RefreshAdminTokenUseCaseImpl } from '../../../src/domain/use-cases/admin/refresh-admin-token/RefreshAdminTokenUseCaseImpl';
import { RegisterAdminUseCase } from '../../../src/domain/use-cases/admin/register-admin/RegisterAdminUseCase';
import { RegisterAdminUseCaseImpl } from '../../../src/domain/use-cases/admin/register-admin/RegisterAdminUseCaseImpl';
import { AdminControllerInjectedDecorator } from '../../../src/ioc/controllers/admin/AdminControllerInjectedDecorator';
import { MockAddBannerUseCaseImpl } from '../../../src/domain/use-cases/admin/add-banner/mock/MockAddBannerUseCaseImpl';
import { MockAddImageByAdminUseCaseImpl } from '../../../src/domain/use-cases/admin/add-image-by-admin/mock/MockAddImageByAdminUseCaseImpl';
import { MockModifyBannerUseCaseImpl } from '../../../src/domain/use-cases/admin/modify-banner/mock/MockModifyBannerUseCaseImpl';
import { MockDeleteBannerUseCaseImpl } from '../../../src/domain/use-cases/admin/delete-banner/mock/MockDeleteBannerUseCaseImpl';
import { BannerControllerInjectedDecorator } from '../../../src/ioc/controllers/banner/BannerControllerInjectedDecorator';
import { GetBannerUseCase } from '../../../src/domain/use-cases/banner/get-banner/GetBannerUseCase';
import { MockGetBannerUseCaseImpl } from '../../../src/domain/use-cases/banner/get-banner/mock/MockGetBannerUseCaseImpl';
import { GetBannersUseCase } from '../../../src/domain/use-cases/banner/get-banners/GetBannersUseCase';
import { MockGetBannersUseCaseImpl } from '../../../src/domain/use-cases/banner/get-banners/mock/MockGetBannersUseCaseImpl';
import { AdminAnalyzeControllerInjectedDecorator } from '../../../src/ioc/controllers/admin/analyze/AdminAnalyzeControllerInjectedDecorator';
import { AdminBannerControllerInjectedDecorator } from '../../../src/ioc/controllers/admin/banner/AdminBannerControllerInjectedDecorator';
import { AdminRecommendedRoutineControllerInjectedDecorator } from '../../../src/ioc/controllers/admin/recommended-routine/AdminRecommendedRoutineControllerInjectedDecorator';

describe('getBanner e2e test', () => {
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
        {
          provide: GetBannerUseCase,
          useClass: MockGetBannerUseCaseImpl,
        },
        {
          provide: GetBannersUseCase,
          useClass: MockGetBannersUseCaseImpl,
        },
      ],
      controllers: [
        AdminControllerInjectedDecorator,
        BannerControllerInjectedDecorator,
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
  let imageId2: string;

  describe('try get banners before post banner', () => {
    it('BannerNotFoundException should be thrown', async () => {
      const res: request.Response = await request(httpServer).get(
        `/v1/banners`,
      );

      expect(res.statusCode).toBe(404);
    });
  });

  describe('post banner image', () => {
    it('success to post image', async () => {
      const res: request.Response = await request(httpServer).post(
        '/v1/admin/image',
      );

      imageId = res.body.id;
    });

    it('success to post image', async () => {
      const res: request.Response = await request(httpServer).post(
        '/v1/admin/image',
      );

      imageId2 = res.body.id;
    });
  });

  describe('post banner', () => {
    it('banner entity should be return', async () => {
      const addBannerParam: any = {
        title: 'testBanner',
        contentVideoId: 'test',
        bannerImageId: imageId,
      };

      await request(httpServer)
        .post('/v1/admin/banner')
        .set('Accept', 'application/json')
        .type('application/json')
        .send(addBannerParam);
    });

    it('banner entity should be return', async () => {
      const addBannerParam: any = {
        title: 'testBanner',
        contentVideoId: 'test',
        bannerImageId: imageId2,
      };

      await request(httpServer)
        .post('/v1/admin/banner')
        .set('Accept', 'application/json')
        .type('application/json')
        .send(addBannerParam);
    });
  });

  describe('try get banners', () => {
    it('Banner entitys should be return', async () => {
      const res: request.Response = await request(httpServer).get(
        `/v1/banners`,
      );

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveLength(2);
    });
  });
});

/***
 * 배너들 get 실패
 * 이미지 생성 후 배너 2개 생성
 * 배너들 get 성공
 */
