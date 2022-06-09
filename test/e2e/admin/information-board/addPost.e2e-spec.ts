import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { setTimeOut } from '../../e2e-env';
import { CoreModule, DatabaseService } from '../../../../src/ioc/CoreModule';
import { InitApp } from '../../config';
import * as request from 'supertest';
import { AddPostRequestDto } from '../../../../src/adapter/admin/information-board/add-post/AddPostRequestDto';
import { Connection } from 'mongoose';
import { SignUpRequestDto } from '../../../../src/adapter/auth/sign-up/SignUpRequestDto';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtRefreshStrategy } from '../../../../src/adapter/common/strategies/JwtRefreshStrategy';
import { JwtStrategy } from '../../../../src/adapter/common/strategies/JwtStrategy';
import { HashProvider } from '../../../../src/domain/providers/HashProvider';
import { JwtProvider } from '../../../../src/domain/providers/JwtProvider';
import { OAuthProviderFactory } from '../../../../src/domain/providers/OAuthProviderFactory';
import { ReissueAccessTokenUseCase } from '../../../../src/domain/use-cases/auth/reissue-access-token/ReissueAccessTokenUseCase';
import { ReissueAccessTokenUseCaseImpl } from '../../../../src/domain/use-cases/auth/reissue-access-token/ReissueAccessTokenUseCaseImpl';
import { SignInUseCase } from '../../../../src/domain/use-cases/auth/sign-in/SignInUseCase';
import { SignInUseCaseImpl } from '../../../../src/domain/use-cases/auth/sign-in/SignInUseCaseImpl';
import { SignOutUseCase } from '../../../../src/domain/use-cases/auth/sign-out/SignOutUseCase';
import { SignOutUseCaseImpl } from '../../../../src/domain/use-cases/auth/sign-out/SignOutUseCaseImpl';
import { SignUpUseCase } from '../../../../src/domain/use-cases/auth/sign-up/SignUpUseCase';
import { SignUpUseCaseImpl } from '../../../../src/domain/use-cases/auth/sign-up/SignUpUseCaseImpl';
import { ValidateUseCase } from '../../../../src/domain/use-cases/auth/validate/ValidateUseCase';
import { ValidateUseCaseImpl } from '../../../../src/domain/use-cases/auth/validate/ValidateUseCaseImpl';
import { WithdrawUseCase } from '../../../../src/domain/use-cases/auth/withdraw/WithdrawUseCase';
import { WithdrawUseCaseImpl } from '../../../../src/domain/use-cases/auth/withdraw/WithdrawUseCaseImpl';
import { HashProviderImpl } from '../../../../src/infrastructure/providers/HashProviderImpl';
import { JwtProviderImpl } from '../../../../src/infrastructure/providers/JwtProviderImpl';
import { MockOAuthFactoryImpl } from '../../../../src/infrastructure/providers/oauth/mock/MockOAuthFactoryImpl';
import { AuthControllerInjectedDecorator } from '../../../../src/ioc/controllers/auth/AuthControllerInjectedDecorator';
import { ProviderModule } from '../../../../src/ioc/ProviderModule';
import { RepositoryModule } from '../../../../src/ioc/RepositoryModule';
import { AddPostUseCase } from '../../../../src/domain/use-cases/information-board/add-post/AddPostUseCase';
import { MockAddPostUseCaseImpl } from '../../../../src/domain/use-cases/information-board/add-post/mock/MockAddPostUseCase';
import { InformationBoardControllerInjectedDecorator } from '../../../../src/ioc/controllers/information-board/InformationBoardControllerInjectedSwagger';
import { LoggerModule } from '../../../../src/ioc/LoggerModule';
import { ModifyPostUseCaseImpl } from '../../../../src/domain/use-cases/information-board/modify-post/ModifyPostUseCaseImpl';
import { ModifyPostUseCase } from '../../../../src/domain/use-cases/information-board/modify-post/ModifyPostUseCase';
import { DeletePostUseCase } from '../../../../src/domain/use-cases/information-board/delete-post/DeletePostUseCase';
import { DeletePostUseCaseImpl } from '../../../../src/domain/use-cases/information-board/delete-post/DeletePostUseCaseImpl';
import { GetPostUseCase } from '../../../../src/domain/use-cases/information-board/get-post/GetPostUseCase';
import { GetPostUseCaseImpl } from '../../../../src/domain/use-cases/information-board/get-post/GetPostUseCaseImpl';
import { GetPostsUseCase } from '../../../../src/domain/use-cases/information-board/get-posts/GetPostsUseCase';
import { GetPostsUseCaseImpl } from '../../../../src/domain/use-cases/information-board/get-posts/GetPostsUseCaseImpl';
import { PutCardnewsUseCase } from '../../../../src/domain/use-cases/information-board/put-cardnews/PutCardnewsUseCase';
import { PutCardnewsUseCaseImpl } from '../../../../src/domain/use-cases/information-board/put-cardnews/PutCardnewsUseCaseImpl';
import { AdminInformationBoardControllerInjectedDecorator } from '../../../../src/ioc/controllers/admin/information-board/AdminInformationBoardControllerInjectedDecorator';

describe('addBoard(information) e2e test', () => {
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
        InformationBoardControllerInjectedDecorator,
        AdminInformationBoardControllerInjectedDecorator,
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
          provide: AddPostUseCase,
          useClass: MockAddPostUseCaseImpl,
        },
        JwtStrategy,
        JwtRefreshStrategy,
        {
          provide: AddPostUseCase,
          useClass: MockAddPostUseCaseImpl,
        },
        {
          provide: ModifyPostUseCase,
          useClass: ModifyPostUseCaseImpl,
        },
        {
          provide: DeletePostUseCase,
          useClass: DeletePostUseCaseImpl,
        },
        {
          provide: GetPostUseCase,
          useClass: GetPostUseCaseImpl,
        },
        {
          provide: GetPostsUseCase,
          useClass: GetPostsUseCaseImpl,
        },
        {
          provide: PutCardnewsUseCase,
          useClass: PutCardnewsUseCaseImpl,
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
    await dbConnection.collection('images').deleteMany({});
    await dbConnection.collection('information-boards').deleteMany({});

    await app.close();
  });

  describe('POST v1/info-boards', () => {
    describe('Add post', () => {
      it('badrequest exception should be thrown because request body is incompleted', async () => {
        const dto: any = {};

        const res: request.Response = await request(httpServer)
          .post('/v1/admin/info-boards')
          .set('Authorization', `Bearer ${accessToken}`)
          .set('Accept', 'application/json')
          .type('application/json')
          .send(dto);

        expect(res.statusCode).toEqual(400);
      });

      it('board entity should be return', async () => {
        const dto: AddPostRequestDto = {
          title: '테스트게시글',
        };

        const res: request.Response = await request(httpServer)
          .post('/v1/admin/info-boards')
          .set('Authorization', `Bearer ${accessToken}`)
          .set('Accept', 'application/json')
          .type('application/json')
          .send(dto);

        expect(res.statusCode).toEqual(201);
        expect(res.body.title).toEqual('테스트게시글');
      });
    });
  });
});

/***
 * 게시글 추가
 * 추가된 게시글 확인
 */
