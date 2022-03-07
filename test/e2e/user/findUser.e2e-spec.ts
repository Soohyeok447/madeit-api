import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { setTimeOut } from '../e2e-env';
import { AppModule } from '../../../src/ioc/AppModule';
import { DatabaseService } from 'src/ioc/DatabaseModule';
import { onboard, findUser, patchAvatar, signUp } from '../request.index';
import { HttpExceptionFilter } from '../../../src/domain/common/filters/HttpExceptionFilter';
import { initSignUp } from '../config';

describe('findUser e2e test', () => {
  let app: INestApplication;
  let httpServer: any;
  let dbConnection;

  let accessToken: string;

  setTimeOut();

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    app.useGlobalFilters(new HttpExceptionFilter());

    await app.init();
    dbConnection = moduleRef
      .get<DatabaseService>(DatabaseService)
      .getConnection();
    httpServer = app.getHttpServer();

    const res = await initSignUp(httpServer);

    accessToken = res.body.accessToken;
  });

  afterAll(async () => {
    await dbConnection.collection('users').deleteMany({});
    await dbConnection.collection('images').deleteMany({});

    await app.close();
  });

  describe('GET v1/users/me', () => {
    describe('try find user after onboard', () => {
      const reqParam = {
        username: '테스트',
        age: 33,
        goal: '공중 3회전 돌기',
        statusMessage: '피곤한상태',
        thirdPartyAccessToken: 'accessToken',
      };

      describe('before patchAvatar', () => {
        it('should return an UserModel', async () => {
          await signUp(httpServer, accessToken, reqParam);

          const res = await findUser(httpServer, accessToken);

          expect(res.statusCode).toBe(200);
        });
      });

      describe('after patchAvatar', () => {
        it('should return an UserModel', async () => {
          await onboard(httpServer, accessToken, reqParam);

          await patchAvatar(
            httpServer,
            accessToken,
            'test/e2e/user/avatar.jpg',
          );

          const res = await findUser(httpServer, accessToken);

          expect(res.statusCode).toBe(200);
          expect(res.body.avatar).toBeDefined();

          await patchAvatar(httpServer, accessToken, null);

          const deleteResult = await findUser(httpServer, accessToken);
          expect(deleteResult.body.avatar).toBeUndefined();
        });
      });
    });
  });
});

/***
onboard전 findUser 호출
onboard후 findUser 호출
patchAvatar전 findUser 호출
patchAvatar후 findUser 호출
 */
