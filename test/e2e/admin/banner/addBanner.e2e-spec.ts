import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { setTimeOut } from '../../e2e-env';
import { CoreModule, DatabaseService } from '../../../../src/ioc/CoreModule';
import { InitApp } from '../../config';
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
import { AddRecommendedRoutineUseCase } from '../../../../src/domain/use-cases/admin/recommended-routine/add-recommended-routine/AddRecommendedRoutineUseCase';
import { MockAddRecommendedRoutineUseCaseImpl } from '../../../../src/domain/use-cases/admin/recommended-routine/add-recommended-routine/mock/MockAddRecommendedRoutineUseCase';
import { AddBannerUseCase } from '../../../../src/domain/use-cases/admin/banner/add-banner/AddBannerUseCase';
import { AddImageByAdminUseCase } from '../../../../src/domain/use-cases/admin/add-image-by-admin/AddImageByAdminUseCase';
import { AnalyzeRoutinesUsageUseCase } from '../../../../src/domain/use-cases/admin/analyze/analyze-routines-usage/AnalyzeRoutinesUsageUseCase';
import { AnalyzeRoutinesUsageUseCaseImpl } from '../../../../src/domain/use-cases/admin/analyze/analyze-routines-usage/AnalyzeRoutinesUsageUseCaseImpl';
import { CountUsersAddedOneRoutineUseCase } from '../../../../src/domain/use-cases/admin/analyze/count-users-added-one-routine/CountUsersAddedOneRoutineUseCase';
import { CountUsersAddedOneRoutineUseCaseImpl } from '../../../../src/domain/use-cases/admin/analyze/count-users-added-one-routine/CountUsersAddedOneRoutineUseCaseImpl';
import { CountUsersUseCase } from '../../../../src/domain/use-cases/admin/analyze/count-users/CountUsersUseCase';
import { CountUsersUseCaseImpl } from '../../../../src/domain/use-cases/admin/analyze/count-users/CountUsersUseCaseImpl';
import { DeleteBannerUseCase } from '../../../../src/domain/use-cases/admin/banner/delete-banner/DeleteBannerUseCase';
import { DeleteBannerUseCaseImpl } from '../../../../src/domain/use-cases/admin/banner/delete-banner/DeleteBannerUseCaseImpl';
import { DeleteRecommendedRoutineUseCase } from '../../../../src/domain/use-cases/admin/recommended-routine/delete-recommended-routine/DeleteRecommendedRoutineUseCase';
import { DeleteRecommendedRoutineUseCaseImpl } from '../../../../src/domain/use-cases/admin/recommended-routine/delete-recommended-routine/DeleteRecommendedRoutineUseCaseImpl';
import { IssueAdminTokenUseCase } from '../../../../src/domain/use-cases/admin/issue-admin-token/IssueAdminTokenUseCase';
import { IssueAdminTokenUseCaseImpl } from '../../../../src/domain/use-cases/admin/issue-admin-token/IssueAdminTokenUseCaseImpl';
import { ModifyBannerUseCase } from '../../../../src/domain/use-cases/admin/banner/modify-banner/ModifyBannerUseCase';
import { ModifyBannerUseCaseImpl } from '../../../../src/domain/use-cases/admin/banner/modify-banner/ModifyBannerUseCaseImpl';
import { ModifyRecommendedRoutineUseCase } from '../../../../src/domain/use-cases/admin/recommended-routine/modify-recommended-routine/ModifyRecommendedRoutineUseCase';
import { ModifyRecommendedRoutineUseCaseImpl } from '../../../../src/domain/use-cases/admin/recommended-routine/modify-recommended-routine/ModifyRecommendedRoutineUseCaseImpl';
import { PatchCardnewsUseCase } from '../../../../src/domain/use-cases/admin/recommended-routine/patch-cardnews/PatchCardnewsUseCase';
import { PatchCardnewsUseCaseImpl } from '../../../../src/domain/use-cases/admin/recommended-routine/patch-cardnews/PatchCardnewsUseCaseImpl';
import { PatchThumbnailUseCase } from '../../../../src/domain/use-cases/admin/recommended-routine/patch-thumbnail/PatchThumbnailUseCase';
import { PatchThumbnailUseCaseImpl } from '../../../../src/domain/use-cases/admin/recommended-routine/patch-thumbnail/PatchThumbnailUseCaseImpl';
import { RefreshAdminTokenUseCase } from '../../../../src/domain/use-cases/admin/refresh-admin-token/RefreshAdminTokenUseCase';
import { RefreshAdminTokenUseCaseImpl } from '../../../../src/domain/use-cases/admin/refresh-admin-token/RefreshAdminTokenUseCaseImpl';
import { RegisterAdminUseCase } from '../../../../src/domain/use-cases/admin/register-admin/RegisterAdminUseCase';
import { RegisterAdminUseCaseImpl } from '../../../../src/domain/use-cases/admin/register-admin/RegisterAdminUseCaseImpl';
import { AdminControllerInjectedDecorator } from '../../../../src/ioc/controllers/admin/AdminControllerInjectedDecorator';
import { MockAddBannerUseCaseImpl } from '../../../../src/domain/use-cases/admin/banner/add-banner/mock/MockAddBannerUseCaseImpl';
import { MockAddImageByAdminUseCaseImpl } from '../../../../src/domain/use-cases/admin/add-image-by-admin/mock/MockAddImageByAdminUseCaseImpl';
import { AdminAnalyzeControllerInjectedDecorator } from '../../../../src/ioc/controllers/admin/analyze/AdminAnalyzeControllerInjectedDecorator';
import { AdminBannerControllerInjectedDecorator } from '../../../../src/ioc/controllers/admin/banner/AdminBannerControllerInjectedDecorator';
import { AdminRecommendedRoutineControllerInjectedDecorator } from '../../../../src/ioc/controllers/admin/recommended-routine/AdminRecommendedRoutineControllerInjectedDecorator';

describe('addBanner e2e test', () => {
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
          useClass: ModifyBannerUseCaseImpl,
        },
        {
          provide: DeleteBannerUseCase,
          useClass: DeleteBannerUseCaseImpl,
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

  describe('POST v1/admin/banner', () => {
    describe('try add an banner before posting banner image', () => {
      it('BadRequestException should be return', async () => {
        const addBannerParam: any = {
          title: 'testBanner',
          contentVideoId: 'test',
        };

        const res: request.Response = await request(httpServer)
          .post('/v1/admin/banner')
          .set('Accept', 'application/json')
          .type('application/json')
          .send(addBannerParam);

        expect(res.statusCode).toBe(400);
      });

      //이미지 얻기 야호~~
      describe('post banner image', () => {
        it('success to post image', async () => {
          const res: request.Response = await request(httpServer).post(
            '/v1/admin/image',
          );

          imageId = res.body.id;
        });
      });

      describe('using valid request body', () => {
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

          expect(res.statusCode).toBe(201);
        });
      });
    });
  });
});

/***
 * 이미지 없이 배너생성 요청
 * 이미지 생성 후 배너 생성
 */
