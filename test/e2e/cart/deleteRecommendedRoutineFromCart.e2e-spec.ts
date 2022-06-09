import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { setTimeOut } from '../e2e-env';
import { CoreModule, DatabaseService } from '../../../src/ioc/CoreModule';
import { Category } from 'src/domain/common/enums/Category';
import { InitApp } from '../config';
import { SignUpRequestDto } from '../../../src/adapter/auth/sign-up/SignUpRequestDto';
import * as request from 'supertest';
import { Connection } from 'mongoose';
import { AddRoutineToCartRequestDto } from '../../../src/adapter/cart/add-routine-to-cart/AddRoutineToCartRequestDto';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AddRecommendedRoutineUseCase } from '../../../src/domain/use-cases/admin/add-recommended-routine/AddRecommendedRoutineUseCase';
import { MockAddRecommendedRoutineUseCaseImpl } from '../../../src/domain/use-cases/admin/add-recommended-routine/mock/MockAddRecommendedRoutineUseCase';

import { CartModule } from '../../../src/ioc/CartModule';
import { ProviderModule } from '../../../src/ioc/ProviderModule';
import { RepositoryModule } from '../../../src/ioc/RepositoryModule';
import { LoggerModule } from '../../../src/ioc/LoggerModule';
import { AddBannerUseCase } from '../../../src/domain/use-cases/admin/add-banner/AddBannerUseCase';
import { MockAddBannerUseCaseImpl } from '../../../src/domain/use-cases/admin/add-banner/mock/MockAddBannerUseCaseImpl';
import { AddImageByAdminUseCase } from '../../../src/domain/use-cases/admin/add-image-by-admin/AddImageByAdminUseCase';
import { MockAddImageByAdminUseCaseImpl } from '../../../src/domain/use-cases/admin/add-image-by-admin/mock/MockAddImageByAdminUseCaseImpl';
import { AnalyzeRoutinesUsageUseCase } from '../../../src/domain/use-cases/admin/analyze-routines-usage/AnalyzeRoutinesUsageUseCase';
import { AnalyzeRoutinesUsageUseCaseImpl } from '../../../src/domain/use-cases/admin/analyze-routines-usage/AnalyzeRoutinesUsageUseCaseImpl';
import { CountUsersAddedOneRoutineUseCase } from '../../../src/domain/use-cases/admin/count-users-added-one-routine/CountUsersAddedOneRoutineUseCase';
import { CountUsersAddedOneRoutineUseCaseImpl } from '../../../src/domain/use-cases/admin/count-users-added-one-routine/CountUsersAddedOneRoutineUseCaseImpl';
import { CountUsersUseCase } from '../../../src/domain/use-cases/admin/count-users/CountUsersUseCase';
import { CountUsersUseCaseImpl } from '../../../src/domain/use-cases/admin/count-users/CountUsersUseCaseImpl';
import { DeleteBannerUseCase } from '../../../src/domain/use-cases/admin/delete-banner/DeleteBannerUseCase';
import { MockDeleteBannerUseCaseImpl } from '../../../src/domain/use-cases/admin/delete-banner/mock/MockDeleteBannerUseCaseImpl';
import { DeleteRecommendedRoutineUseCase } from '../../../src/domain/use-cases/admin/delete-recommended-routine/DeleteRecommendedRoutineUseCase';
import { DeleteRecommendedRoutineUseCaseImpl } from '../../../src/domain/use-cases/admin/delete-recommended-routine/DeleteRecommendedRoutineUseCaseImpl';
import { IssueAdminTokenUseCase } from '../../../src/domain/use-cases/admin/issue-admin-token/IssueAdminTokenUseCase';
import { IssueAdminTokenUseCaseImpl } from '../../../src/domain/use-cases/admin/issue-admin-token/IssueAdminTokenUseCaseImpl';
import { MockModifyBannerUseCaseImpl } from '../../../src/domain/use-cases/admin/modify-banner/mock/MockModifyBannerUseCaseImpl';
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
import { HashProviderImpl } from '../../../src/infrastructure/providers/HashProviderImpl';
import { JwtProviderImpl } from '../../../src/infrastructure/providers/JwtProviderImpl';
import { MockOAuthFactoryImpl } from '../../../src/infrastructure/providers/oauth/mock/MockOAuthFactoryImpl';
import { AuthControllerInjectedDecorator } from '../../../src/ioc/controllers/auth/AuthControllerInjectedDecorator';
import { AddRecommendedRoutineRequestDto } from '../../../src/adapter/admin/recommended-routine/add-recommended-routine/AddRecommendedRoutineRequestDto';
import { AdminAnalyzeControllerInjectedDecorator } from '../../../src/ioc/controllers/admin/analyze/AdminAnalyzeControllerInjectedDecorator';
import { AdminBannerControllerInjectedDecorator } from '../../../src/ioc/controllers/admin/banner/AdminBannerControllerInjectedDecorator';
import { AdminRecommendedRoutineControllerInjectedDecorator } from '../../../src/ioc/controllers/admin/recommended-routine/AdminRecommendedRoutineControllerInjectedDecorator';

describe('deleteRecommendedRoutineFromCart e2e test', () => {
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
        CartModule,
        CoreModule,
        LoggerModule.forRoot(),
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
        AuthControllerInjectedDecorator,
        AdminBannerControllerInjectedDecorator,
        AdminRecommendedRoutineControllerInjectedDecorator,
        AdminAnalyzeControllerInjectedDecorator,
      ],
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
    await dbConnection.collection('carts').deleteMany({});

    await app.close();
  });

  let firstRoutineId: string;
  let secondRoutineId: string;

  let firstRecommendedRoutineId: string;
  let secondRecommendedRoutineId: string;

  describe('DELETE v1/carts/:id', () => {
    describe('try delete routine from empty cart', () => {
      describe('using nonexistence routineId', () => {
        it('CartNotFoundException should be thrown', async () => {
          const res: request.Response = await request(httpServer)
            .delete(`/v1/carts/123456789101112131415161`)
            .set('Authorization', `Bearer ${accessToken}`);

          expect(res.statusCode).toBe(404);
        });
      });

      describe('using invlid mongo object id', () => {
        it('InvalidMongoObjectIdException should be thrown', async () => {
          const res: request.Response = await request(httpServer)
            .delete(`/v1/carts/123`)
            .set('Authorization', `Bearer ${accessToken}`);

          expect(res.statusCode).toBe(400);
        });
      });
    });
  });

  describe('POST v1/routines', () => {
    it('add routine two times', async () => {
      const addRoutineParam1: AddRecommendedRoutineRequestDto = {
        title: `e2eTEST1`,
        category: Category.Health,
        introduction: 'e2eTEST',
        days: [],
        contentVideoId: '',
      };

      const addRoutineParam2: AddRecommendedRoutineRequestDto = {
        title: `e2eTEST2`,
        category: Category.Health,
        introduction: 'e2eTEST',
        days: [],
        contentVideoId: '',
      };

      const res1: request.Response = await request(httpServer)
        .post('/v1/admin/recommended-routines')
        .set('Authorization', `Bearer ${accessToken}`)
        .set('Accept', 'application/json')
        .type('application/json')
        .send(addRoutineParam1);

      const res2: request.Response = await request(httpServer)
        .post('/v1/admin/recommended-routines')
        .set('Authorization', `Bearer ${accessToken}`)
        .set('Accept', 'application/json')
        .type('application/json')
        .send(addRoutineParam2);

      firstRoutineId = res1.body.id;
      secondRoutineId = res2.body.id;
    });
  });

  describe('POST v1/carts', () => {
    it('add routine to cart two times', async () => {
      const recommendedRoutineId1: AddRoutineToCartRequestDto = {
        recommendedRoutineId: firstRoutineId,
      };

      const recommendedRoutineId2: AddRoutineToCartRequestDto = {
        recommendedRoutineId: secondRoutineId,
      };

      await request(httpServer)
        .post('/v1/carts')
        .set('Authorization', `Bearer ${accessToken}`)
        .set('Accept', 'application/json')
        .type('application/json')
        .send(recommendedRoutineId1);

      await request(httpServer)
        .post('/v1/carts')
        .set('Authorization', `Bearer ${accessToken}`)
        .set('Accept', 'application/json')
        .type('application/json')
        .send(recommendedRoutineId2);
    });
  });

  describe('GET v1/carts', () => {
    it('get carts that length is 2', async () => {
      const res: request.Response = await request(httpServer)
        .get('/v1/carts')
        .set('Authorization', `Bearer ${accessToken}`);

      firstRecommendedRoutineId = res.body[0].id;
      secondRecommendedRoutineId = res.body[1].id;

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveLength(2);
    });
  });

  describe('DELETE v1/carts/:id after put routine into cart', () => {
    describe('try delete routine from cart', () => {
      describe('using nonexistence routineId', () => {
        it('CartNotFoundException should be thrown', async () => {
          const res: request.Response = await request(httpServer)
            .delete(`/v1/carts/123456789101112131415161`)
            .set('Authorization', `Bearer ${accessToken}`);

          expect(res.statusCode).toBe(404);
        });
      });

      describe('using valid routineId', () => {
        it('success to delete', async () => {
          const res: request.Response = await request(httpServer)
            .delete(`/v1/carts/${firstRecommendedRoutineId}`)
            .set('Authorization', `Bearer ${accessToken}`);

          expect(res.statusCode).toBe(200);
        });
      });
    });
  });

  describe('GET v1/carts after delete once', () => {
    it('get carts that length is 1', async () => {
      const res: request.Response = await request(httpServer)
        .get('/v1/carts')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveLength(1);
    });
  });

  describe('DELETE v1/carts/:id after delete once', () => {
    describe('try delete routine from cart', () => {
      describe('using valid routineId', () => {
        it('success to delete', async () => {
          const res: request.Response = await request(httpServer)
            .delete(`/v1/carts/${secondRecommendedRoutineId}`)
            .set('Authorization', `Bearer ${accessToken}`);

          expect(res.statusCode).toBe(200);
        });
      });
    });
  });

  describe('GET v1/carts after delete two times', () => {
    it('get carts that length is 0', async () => {
      const res: request.Response = await request(httpServer)
        .get('/v1/carts')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveLength(0);
    });
  });
});

/***
 * 빈 장바구니에서 없는 id로 삭제 시도
 * 빈 장바구니에서 유효하지 않은 mongo object id로 삭제 시도
 * 추천루틴 2개 추가
 * 장바구니 get
 * 없는 id로 삭제 시도
 * 장바구니에서 삭제
 * 장바구니 get
 * 장바구니에서 삭제
 * 장바구니 get
 */
