import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { setTimeOut } from '../e2e-env';
import { AppModule } from '../../../src/ioc/AppModule';
import { DatabaseService } from 'src/ioc/DatabaseModule';
import { modifyUser } from '../request.index';
import { HttpExceptionFilter } from '../../../src/domain/common/filters/HttpExceptionFilter';
import { findUser, patchAvatar } from './request';
import { initSignUp } from '../config';

describe('modify e2e test', () => {
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

  describe('PATCH v1/users/me', () => {
    describe('try onboard with intact request body', () => {
      it('modify success', async () => {
        const reqParam = {
          username: 'test',
          age: 33,
          goal: '3옥 레 질러보기',
          statusMessage: '목상태안좋음',
        };

        const res = await modifyUser(httpServer, accessToken, reqParam);

        expect(res.statusCode).toBe(200);
      });
    });
  });

  describe('PATCH v1/users/me/avatar', () => {
    describe('try patch avatar', () => {
      it('expect to patch avatar', async () => {
        const res = await patchAvatar(
          httpServer,
          accessToken,
          'test/e2e/user/avatar.jpg',
        );

        expect(res.statusCode).toBe(200);
      });
    });

    describe('try check patched avatar', () => {
      it('avatar has been defined', async () => {
        const res = await findUser(httpServer, accessToken);

        expect(res.statusCode).toBe(200);
        expect(res.body.avatar).toBeDefined();
      });
    });
  });
});

/***
유효한 request body로 modifying
아바타 patching
patching된 아바타 확인
 */
