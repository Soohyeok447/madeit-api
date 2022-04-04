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
import { HashProviderImpl } from '../../../src/infrastructure/providers/HashProviderImpl';
import { JwtProviderImpl } from '../../../src/infrastructure/providers/JwtProviderImpl';
import { MockOAuthFactoryImpl } from '../../../src/infrastructure/providers/oauth/mock/MockOAuthFactoryImpl';
import { AuthControllerInjectedDecorator } from '../../../src/ioc/controllers/auth/AuthControllerInjectedDecorator';
import { ProviderModule } from '../../../src/ioc/ProviderModule';
import { RepositoryModule } from '../../../src/ioc/RepositoryModule';
import { CartModule } from '../../../src/ioc/CartModule';
import { AddRecommendedRoutineUseCase } from '../../../src/domain/use-cases/recommended-routine/add-recommended-routine/AddRecommendedRoutineUseCase';
import { MockAddRecommendedRoutineUseCaseImpl } from '../../../src/domain/use-cases/recommended-routine/add-recommended-routine/mock/MockAddRecommendedRoutineUseCase';
import { DeleteRecommendedRoutineUseCase } from '../../../src/domain/use-cases/recommended-routine/delete-recommended-routine/DeleteRecommendedRoutineUseCase';
import { DeleteRecommendedRoutineUseCaseImpl } from '../../../src/domain/use-cases/recommended-routine/delete-recommended-routine/DeleteRecommendedRoutineUseCaseImpl';
import { GetRecommendedRoutineUseCase } from '../../../src/domain/use-cases/recommended-routine/get-recommended-routine/GetRecommendedRoutineUseCase';
import { GetRecommendedRoutineUseCaseImpl } from '../../../src/domain/use-cases/recommended-routine/get-recommended-routine/GetRecommendedRoutineUseCaseImpl';
import { GetRecommendedRoutinesByCategoryUseCase } from '../../../src/domain/use-cases/recommended-routine/get-recommended-routines-by-category/GetRecommendedRoutinesByCategoryUseCase';
import { GetRecommendedRoutinesByCategoryUseCaseImpl } from '../../../src/domain/use-cases/recommended-routine/get-recommended-routines-by-category/GetRecommendedRoutinesByCategoryUseCaseImpl';
import { ModifyRecommendedRoutineUseCase } from '../../../src/domain/use-cases/recommended-routine/modify-recommended-routine/ModifyRecommendedRoutineUseCase';
import { ModifyRecommendedRoutineUseCaseImpl } from '../../../src/domain/use-cases/recommended-routine/modify-recommended-routine/ModifyRecommendedRoutineUseCaseImpl';
import { PatchCardnewsUseCase } from '../../../src/domain/use-cases/recommended-routine/patch-cardnews/PatchCardnewsUseCase';
import { PatchCardnewsUseCaseImpl } from '../../../src/domain/use-cases/recommended-routine/patch-cardnews/PatchCardnewsUseCaseImpl';
import { PatchThumbnailUseCase } from '../../../src/domain/use-cases/recommended-routine/patch-thumbnail/PatchThumbnailUseCase';
import { PatchThumbnailUseCaseImpl } from '../../../src/domain/use-cases/recommended-routine/patch-thumbnail/PatchThumbnailUseCaseImpl';
import { RecommendedRoutineControllerInjectedDecorator } from '../../../src/ioc/controllers/recommended-routine/RecommendRoutineControllerInjectedSwagger';

describe('addRecommendedRoutineToCart e2e test', () => {
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
          useClass: ModifyRecommendedRoutineUseCaseImpl,
        },
        {
          provide: DeleteRecommendedRoutineUseCase,
          useClass: DeleteRecommendedRoutineUseCaseImpl,
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
          useClass: PatchThumbnailUseCaseImpl,
        },
        {
          provide: PatchCardnewsUseCase,
          useClass: PatchCardnewsUseCaseImpl,
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
    await dbConnection.collection('carts').deleteMany({});

    await app.close();
  });

  let firstRoutineId: string;
  let secondRoutineId: string;

  describe('POST v1/carts', () => {
    describe('try add routine to cart', () => {
      describe('using invalid mongo object id', () => {
        it('BadRequestException should be thrown', async () => {
          const addRoutineToCartParams: AddRoutineToCartRequestDto = {
            recommendedRoutineId: '123',
          };

          const res: request.Response = await request(httpServer)
            .post('/v1/carts')
            .set('Authorization', `Bearer ${accessToken}`)
            .set('Accept', 'application/json')
            .type('application/json')
            .send(addRoutineToCartParams);

          expect(res.statusCode).toBe(400);
        });
      });

      describe('using unintact request body', () => {
        it('BadRequestException should be thrown', async () => {
          const addRoutineToCartParams: any = {
            wrongKey: '123456789101112131415161',
          };

          const res: request.Response = await request(httpServer)
            .post('/v1/carts')
            .set('Authorization', `Bearer ${accessToken}`)
            .set('Accept', 'application/json')
            .type('application/json')
            .send(addRoutineToCartParams);

          expect(res.statusCode).toBe(400);
        });
      });

      describe('using nonexistent routine id', () => {
        it('RoutineNotFoundException should be thrown', async () => {
          const addRoutineToCartParams: AddRoutineToCartRequestDto = {
            recommendedRoutineId: '123456789101112131415161',
          };

          const res: request.Response = await request(httpServer)
            .post('/v1/carts')
            .set('Authorization', `Bearer ${accessToken}`)
            .set('Accept', 'application/json')
            .type('application/json')
            .send(addRoutineToCartParams);

          expect(res.statusCode).toBe(404);
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
      };

      const addRoutineParam2: AddRecommendedRoutineRequestDto = {
        title: `e2eTEST2`,
        category: Category.Health,
        introduction: 'e2eTEST',
      };

      const res1: request.Response = await request(httpServer)
        .post('/v1/recommended-routines')
        .set('Authorization', `Bearer ${accessToken}`)
        .set('Accept', 'application/json')
        .type('application/json')
        .send(addRoutineParam1);

      const res2: request.Response = await request(httpServer)
        .post('/v1/recommended-routines')
        .set('Authorization', `Bearer ${accessToken}`)
        .set('Accept', 'application/json')
        .type('application/json')
        .send(addRoutineParam2);

      firstRoutineId = res1.body.id;
      secondRoutineId = res2.body.id;

      console.log(firstRoutineId);
      console.log(secondRoutineId);
    });
  });

  describe('POST v1/carts after add routines', () => {
    describe('try add routine to cart', () => {
      describe('using intact request body include valid existent routineId', () => {
        it('success to add routine to cart', async () => {
          const addRoutineToCartParams: AddRoutineToCartRequestDto = {
            recommendedRoutineId: firstRoutineId,
          };

          const res: request.Response = await request(httpServer)
            .post('/v1/carts')
            .set('Authorization', `Bearer ${accessToken}`)
            .set('Accept', 'application/json')
            .type('application/json')
            .send(addRoutineToCartParams);

          console.log(res.body);

          expect(res.statusCode).toBe(201);
        });
      });

      describe('using intact request body that include duplicated routineId from cart', () => {
        it('CartConflictException should be thrown', async () => {
          const addRoutineToCartParams: AddRoutineToCartRequestDto = {
            recommendedRoutineId: firstRoutineId,
          };

          const res: request.Response = await request(httpServer)
            .post('/v1/carts')
            .set('Authorization', `Bearer ${accessToken}`)
            .set('Accept', 'application/json')
            .type('application/json')
            .send(addRoutineToCartParams);

          expect(res.statusCode).toBe(409);
        });
      });

      describe('using intact request body that include not duplicated routineId from cart', () => {
        it('success to add routine to cart', async () => {
          const addRoutineToCartParams: AddRoutineToCartRequestDto = {
            recommendedRoutineId: secondRoutineId,
          };

          const res: request.Response = await request(httpServer)
            .post('/v1/carts')
            .set('Authorization', `Bearer ${accessToken}`)
            .set('Accept', 'application/json')
            .type('application/json')
            .send(addRoutineToCartParams);

          expect(res.statusCode).toBe(201);
        });
      });
    });
  });
});

/***
 * 유효하지 않은 routineId
 * 온전하지 않은 request body
 * 없는 루틴 추가 시도
 * 루틴 2개 추가
 * 장바구니에 루틴 추가
 * 이미 장바구니에 존재중인 루틴 추가시도
 * 장바구니에 없는 루틴 추가 시도
 */
