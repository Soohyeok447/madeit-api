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
import { HashProviderImpl } from '../../../src/infrastructure/providers/HashProviderImpl';
import { JwtProviderImpl } from '../../../src/infrastructure/providers/JwtProviderImpl';
import { MockOAuthFactoryImpl } from '../../../src/infrastructure/providers/oauth/mock/MockOAuthFactoryImpl';
import { AuthControllerInjectedDecorator } from '../../../src/ioc/controllers/auth/AuthControllerInjectedDecorator';
import { RecommendedRoutineControllerInjectedDecorator } from '../../../src/ioc/controllers/recommended-routine/RecommendRoutineControllerInjectedSwagger';
import { ProviderModule } from '../../../src/ioc/ProviderModule';
import { RepositoryModule } from '../../../src/ioc/RepositoryModule';
import { LoggerModule } from '../../../src/ioc/LoggerModule';
import { AdminControllerInjectedDecorator } from '../../../src/ioc/controllers/admin/AdminControllerInjectedDecorator';
import { RegisterAdminUseCase } from '../../../src/domain/use-cases/admin/register-admin/RegisterAdminUseCase';
import { RegisterAdminUseCaseImpl } from '../../../src/domain/use-cases/admin/register-admin/RegisterAdminUseCaseImpl';
import { IssueAdminTokenUseCase } from '../../../src/domain/use-cases/admin/issue-admin-token/IssueAdminTokenUseCase';
import { IssueAdminTokenUseCaseImpl } from '../../../src/domain/use-cases/admin/issue-admin-token/IssueAdminTokenUseCaseImpl';
import { RefreshAdminTokenUseCase } from '../../../src/domain/use-cases/admin/refresh-admin-token/RefreshAdminTokenUseCase';
import { RefreshAdminTokenUseCaseImpl } from '../../../src/domain/use-cases/admin/refresh-admin-token/RefreshAdminTokenUseCaseImpl';
import { CountUsersUseCase } from '../../../src/domain/use-cases/admin/count-users/CountUsersUseCase';
import { CountUsersUseCaseImpl } from '../../../src/domain/use-cases/admin/count-users/CountUsersUseCaseImpl';
import { CountUsersAddedOneRoutineUseCase } from '../../../src/domain/use-cases/admin/count-users-added-one-routine/CountUsersAddedOneRoutineUseCase';
import { CountUsersAddedOneRoutineUseCaseImpl } from '../../../src/domain/use-cases/admin/count-users-added-one-routine/CountUsersAddedOneRoutineUseCaseImpl';
import { AnalyzeRoutinesUsageUseCase } from '../../../src/domain/use-cases/admin/analyze-routines-usage/AnalyzeRoutinesUsageUseCase';
import { AnalyzeRoutinesUsageUseCaseImpl } from '../../../src/domain/use-cases/admin/analyze-routines-usage/AnalyzeRoutinesUsageUseCaseImpl';

describe('addRecommendedRoutine e2e test', () => {
  let app: INestApplication;
  let httpServer: any;
  let dbConnection: Connection;

  let cookies: string;

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
        // {
        //   provide: AnalyzeFulfillRateUseCase,
        //   useClass: AnalyzeFulfillRateUseCaseImpl,
        // },
      ],
      exports: [PassportModule, JwtStrategy, JwtRefreshStrategy],
    }).compile();

    app = await InitApp(app, moduleRef);

    dbConnection = moduleRef
      .get<DatabaseService>(DatabaseService)
      .getConnection();
    httpServer = app.getHttpServer();

    const signInRequestDto: any = {
      id: process.env.ADMIN_ID,
      password: process.env.ADMIN_PASSWORD,
    };

    const res: request.Response = await request(httpServer)
      .post(`/v1/admin/issue`)
      .set('Accept', 'application/json')
      .type('application/json')
      .send(signInRequestDto);

    console.log(res.body);

    cookies = res.headers.cookie;
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

          console.log(cookies);

          const res: request.Response = await request(httpServer)
            .post('/v1/admin/recommended-routines')
            .set('Accept', 'application/json')
            .set('Cookie', cookies)
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
            category: Category.Health,
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