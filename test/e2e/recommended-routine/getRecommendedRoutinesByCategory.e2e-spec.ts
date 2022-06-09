import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { setTimeOut } from '../e2e-env';
import { CoreModule, DatabaseService } from '../../../src/ioc/CoreModule';
import { InitApp } from '../config';
import { Category } from '../../../src/domain/common/enums/Category';
import { FixedField } from '../../../src/domain/common/enums/FixedField';
import { Connection } from 'mongoose';
import * as request from 'supertest';
import { SignUpRequestDto } from '../../../src/adapter/auth/sign-up/SignUpRequestDto';
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
import { AddRecommendedRoutineUseCase } from '../../../src/domain/use-cases/admin/add-recommended-routine/AddRecommendedRoutineUseCase';
import { MockAddRecommendedRoutineUseCaseImpl } from '../../../src/domain/use-cases/admin/add-recommended-routine/mock/MockAddRecommendedRoutineUseCase';
import { GetRecommendedRoutineUseCase } from '../../../src/domain/use-cases/recommended-routine/get-recommended-routine/GetRecommendedRoutineUseCase';
import { GetRecommendedRoutineUseCaseImpl } from '../../../src/domain/use-cases/recommended-routine/get-recommended-routine/GetRecommendedRoutineUseCaseImpl';
import { GetRecommendedRoutinesByCategoryUseCase } from '../../../src/domain/use-cases/recommended-routine/get-recommended-routines-by-category/GetRecommendedRoutinesByCategoryUseCase';
import { GetRecommendedRoutinesByCategoryUseCaseImpl } from '../../../src/domain/use-cases/recommended-routine/get-recommended-routines-by-category/GetRecommendedRoutinesByCategoryUseCaseImpl';
import { HashProviderImpl } from '../../../src/infrastructure/providers/HashProviderImpl';
import { JwtProviderImpl } from '../../../src/infrastructure/providers/JwtProviderImpl';
import { MockOAuthFactoryImpl } from '../../../src/infrastructure/providers/oauth/mock/MockOAuthFactoryImpl';
import { AuthControllerInjectedDecorator } from '../../../src/ioc/controllers/auth/AuthControllerInjectedDecorator';
import { RecommendedRoutineControllerInjectedDecorator } from '../../../src/ioc/controllers/recommended-routine/RecommendRoutineControllerInjectedSwagger';
import { ProviderModule } from '../../../src/ioc/ProviderModule';
import { RepositoryModule } from '../../../src/ioc/RepositoryModule';
import { LoggerModule } from '../../../src/ioc/LoggerModule';
import { DeleteRecommendedRoutineUseCase } from '../../../src/domain/use-cases/admin/delete-recommended-routine/DeleteRecommendedRoutineUseCase';
import { ModifyRecommendedRoutineUseCase } from '../../../src/domain/use-cases/admin/modify-recommended-routine/ModifyRecommendedRoutineUseCase';
import { ModifyRecommendedRoutineUseCaseImpl } from '../../../src/domain/use-cases/admin/modify-recommended-routine/ModifyRecommendedRoutineUseCaseImpl';
import { PatchCardnewsUseCase } from '../../../src/domain/use-cases/admin/patch-cardnews/PatchCardnewsUseCase';
import { PatchCardnewsUseCaseImpl } from '../../../src/domain/use-cases/admin/patch-cardnews/PatchCardnewsUseCaseImpl';
import { PatchThumbnailUseCase } from '../../../src/domain/use-cases/admin/patch-thumbnail/PatchThumbnailUseCase';
import { PatchThumbnailUseCaseImpl } from '../../../src/domain/use-cases/admin/patch-thumbnail/PatchThumbnailUseCaseImpl';
import { AdminControllerInjectedDecorator } from '../../../src/ioc/controllers/admin/AdminControllerInjectedDecorator';
import { AddBannerUseCase } from '../../../src/domain/use-cases/admin/add-banner/AddBannerUseCase';
import { AddBannerUseCaseImpl } from '../../../src/domain/use-cases/admin/add-banner/AddBannerUseCaseImpl';
import { AddImageByAdminUseCase } from '../../../src/domain/use-cases/admin/add-image-by-admin/AddImageByAdminUseCase';
import { AddImageByAdminUseCaseImpl } from '../../../src/domain/use-cases/admin/add-image-by-admin/AddImageByAdminUseCaseImpl';
import { AnalyzeRoutinesUsageUseCase } from '../../../src/domain/use-cases/admin/analyze-routines-usage/AnalyzeRoutinesUsageUseCase';
import { AnalyzeRoutinesUsageUseCaseImpl } from '../../../src/domain/use-cases/admin/analyze-routines-usage/AnalyzeRoutinesUsageUseCaseImpl';
import { CountUsersAddedOneRoutineUseCase } from '../../../src/domain/use-cases/admin/count-users-added-one-routine/CountUsersAddedOneRoutineUseCase';
import { CountUsersAddedOneRoutineUseCaseImpl } from '../../../src/domain/use-cases/admin/count-users-added-one-routine/CountUsersAddedOneRoutineUseCaseImpl';
import { CountUsersUseCase } from '../../../src/domain/use-cases/admin/count-users/CountUsersUseCase';
import { CountUsersUseCaseImpl } from '../../../src/domain/use-cases/admin/count-users/CountUsersUseCaseImpl';
import { DeleteBannerUseCase } from '../../../src/domain/use-cases/admin/delete-banner/DeleteBannerUseCase';
import { DeleteBannerUseCaseImpl } from '../../../src/domain/use-cases/admin/delete-banner/DeleteBannerUseCaseImpl';
import { DeleteRecommendedRoutineUseCaseImpl } from '../../../src/domain/use-cases/admin/delete-recommended-routine/DeleteRecommendedRoutineUseCaseImpl';
import { IssueAdminTokenUseCase } from '../../../src/domain/use-cases/admin/issue-admin-token/IssueAdminTokenUseCase';
import { IssueAdminTokenUseCaseImpl } from '../../../src/domain/use-cases/admin/issue-admin-token/IssueAdminTokenUseCaseImpl';
import { ModifyBannerUseCase } from '../../../src/domain/use-cases/admin/modify-banner/ModifyBannerUseCase';
import { ModifyBannerUseCaseImpl } from '../../../src/domain/use-cases/admin/modify-banner/ModifyBannerUseCaseImpl';
import { RefreshAdminTokenUseCase } from '../../../src/domain/use-cases/admin/refresh-admin-token/RefreshAdminTokenUseCase';
import { RefreshAdminTokenUseCaseImpl } from '../../../src/domain/use-cases/admin/refresh-admin-token/RefreshAdminTokenUseCaseImpl';
import { RegisterAdminUseCase } from '../../../src/domain/use-cases/admin/register-admin/RegisterAdminUseCase';
import { RegisterAdminUseCaseImpl } from '../../../src/domain/use-cases/admin/register-admin/RegisterAdminUseCaseImpl';
import { AddRecommendedRoutineRequestDto } from '../../../src/adapter/admin/recommended-routine/add-recommended-routine/AddRecommendedRoutineRequestDto';
import { AdminAnalyzeControllerInjectedDecorator } from '../../../src/ioc/controllers/admin/analyze/AdminAnalyzeControllerInjectedDecorator';
import { AdminBannerControllerInjectedDecorator } from '../../../src/ioc/controllers/admin/banner/AdminBannerControllerInjectedDecorator';
import { AdminRecommendedRoutineControllerInjectedDecorator } from '../../../src/ioc/controllers/admin/recommended-routine/AdminRecommendedRoutineControllerInjectedDecorator';

describe('getRecommendedRoutinesByCategory e2e test', () => {
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
        AdminControllerInjectedDecorator,
        AdminBannerControllerInjectedDecorator,
        AdminRecommendedRoutineControllerInjectedDecorator,
        AdminAnalyzeControllerInjectedDecorator,
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
        {
          provide: GetRecommendedRoutineUseCase,
          useClass: GetRecommendedRoutineUseCaseImpl,
        },
        {
          provide: GetRecommendedRoutinesByCategoryUseCase,
          useClass: GetRecommendedRoutinesByCategoryUseCaseImpl,
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
    await dbConnection.collection('recommended-routines').deleteMany({});

    await app.close();
  });

  describe('GET v1/recommended-routines using invalid category', () => {
    it('[] should be thrown', async () => {
      const res: request.Response = await request(httpServer)
        .get(`/v1/recommended-routines?size=5&category=invalid`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.statusCode).toBe(400);
      expect(res.body.errorCode).toEqual(1);
    });
  });

  describe('GET v1/recommended-routines before add an recommended routine', () => {
    it('[] should be thrown', async () => {
      const res: request.Response = await request(httpServer)
        .get(`/v1/recommended-routines?size=5&category=Health`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.items).toHaveLength(0);
    });
  });

  describe('POST v1/recommended-routines', () => {
    it('add recommended routine 3 times', async () => {
      let i: number;
      for (i = 0; i < 3; i++) {
        const addRoutineParam: AddRecommendedRoutineRequestDto = {
          title: `테스트${i}`,
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
          .set('Authorization', `Bearer ${accessToken}`)
          .set('Accept', 'application/json')
          .type('application/json')
          .send(addRoutineParam);
      }
    });
  });

  describe('GET v1/recommended-routines after add recommended routine 3 times', () => {
    it('RecommendedRoutineModel list should be thrown', async () => {
      const res: request.Response = await request(httpServer)
        .get(`/v1/recommended-routines?size=5&category=Health`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.items).toHaveLength(3);
      expect(res.body.hasMore).toEqual(false);
      expect(res.body.nextCursor).toEqual(null);
    });
  });

  describe('POST v1/recommended-routines already called 3 times', () => {
    it('add recommended routine 3 times', async () => {
      let i: number;
      for (i = 3; i < 7; i++) {
        const addRoutineParam: AddRecommendedRoutineRequestDto = {
          title: `테스트${i}`,
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
          .set('Authorization', `Bearer ${accessToken}`)
          .set('Accept', 'application/json')
          .type('application/json')
          .send(addRoutineParam);
      }
    });
  });

  let nextCursor: string;

  describe('GET v1/recommended-routines after add recommended routine 9 times', () => {
    it('RecommendedRoutineModel list should be thrown', async () => {
      const res: request.Response = await request(httpServer)
        .get(`/v1/recommended-routines?size=5&category=Health`)
        .set('Authorization', `Bearer ${accessToken}`);
      nextCursor = res.body.nextCursor;

      expect(res.statusCode).toBe(200);
      expect(res.body.items).toHaveLength(5);
      expect(res.body.hasMore).toEqual(true);
    });
  });

  describe('GET v1/recommended-routines using paging', () => {
    it('RecommendedRoutineModel list should be thrown', async () => {
      const res: request.Response = await request(httpServer)
        .get(
          `/v1/recommended-routines?size=5&category=Health&next=${nextCursor}`,
        )
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.items).toHaveLength(2);
      expect(res.body.hasMore).toEqual(false);
    });
  });
});

/***
 * [size는 5]
 * 유효하지 않은 카테고리로 검색 시도
 * 아무것도 없을 때 getAll 해서 [] 받기
 * 루틴 3개 생성
 * getALl해서 3개 받아졌나 확인 + nextCursor null인지 확인
 * 루틴 4개 생성
 * getAll해서 5개 받아졌나 확인 + nextCursor 존재하고 hasMore true인지 확인
 * nextCursor로 페이징
 * nextCursor null인지 확인 hasMore false인지 확인
 * 카테고리 한정해서 getAll하고 모든 item들의 category가 한정한 카테고리인지확인
 */
