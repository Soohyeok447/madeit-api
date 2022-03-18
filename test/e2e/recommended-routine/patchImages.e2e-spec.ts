import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { setTimeOut } from '../e2e-env';
import { AppModule } from '../../../src/ioc/AppModule';
import { DatabaseService } from 'src/ioc/DatabaseModule';
import { authorize, patchThumbnail, patchCardnews } from '../request.index';
import { InitApp, initSignUp } from '../config';
import { addRecommendedRoutine, getRecommendedRoutine } from './request';
import { Category } from '../../../src/domain/common/enums/Category';

describe('patchImages e2e test', () => {
  let app: INestApplication;
  let httpServer: any;
  let dbConnection;

  let accessToken: string;

  setTimeOut();

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = await InitApp(app, moduleRef);

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
    await dbConnection.collection('recommended-routines').deleteMany({});
    await dbConnection.collection('images').deleteMany({});

    await app.close();
  });

  let routineId: string;
  let thumbnail: string;
  let cardnews: string;

  describe('PATCH v1/recommended-routines/:id/thumbnail', () => {
    describe('before getting admin authorization...', () => {
      describe('try patch thumbnail', () => {
        describe('using valid mongo object id with thumbnail', () => {
          it('UserNotAdminException should be thrown', async () => {
            const res = await patchThumbnail(
              httpServer,
              accessToken,
              'test/e2e/recommended-routine/thumbnail.jpg',
              '123456789101112131415161',
            );

            expect(res.statusCode).toBe(401);
          });
        });

        describe('using invalid mongo object id with thumbnail', () => {
          it('InvalidMongoObjectIdException should be thrown', async () => {
            const res = await patchThumbnail(
              httpServer,
              accessToken,
              'test/e2e/recommended-routine/thumbnail.jpg',
              '123',
            );

            expect(res.statusCode).toBe(400);
          });
        });
      });
    });

    describe('after getting admin authorization...', () => {
      describe('try patch thumbnail', () => {
        describe('using wrong id with thumbnail', () => {
          it('RoutineNotFoundException should be thrown', async () => {
            await authorize(httpServer, accessToken);

            const res = await patchThumbnail(
              httpServer,
              accessToken,
              'test/e2e/recommended-routine/thumbnail.jpg',
              '123456789101112131415161',
            );

            expect(res.statusCode).toBe(404);
          });
        });

        describe('using invalid mongo object id with thumbnail', () => {
          it('InvalidMongoObjectIdException should be thrown', async () => {
            const res = await patchThumbnail(
              httpServer,
              accessToken,
              'test/e2e/recommended-routine/thumbnail.jpg',
              '123',
            );

            expect(res.statusCode).toBe(400);
          });
        });
      });
    });
  });

  describe('POST v1/recommended-routines', () => {
    it('add an routine', async () => {
      await authorize(httpServer, accessToken);

      const addRoutineParam = {
        title: 'e2eTest',
        category: Category.Reading,
        introduction: 'e2eTest',
      };

      const res = await addRecommendedRoutine(
        httpServer,
        accessToken,
        addRoutineParam,
      );

      routineId = res.body.id;
    });
  });

  describe('PATCH v1/recommended-routines/:id/thumbnail after add routine', () => {
    describe('try patch thumbnail', () => {
      describe('using invalid mongo object id with thumbnail', () => {
        it('InvalidMongoObjectIdException should be thrown', async () => {
          const res = await patchThumbnail(
            httpServer,
            accessToken,
            'test/e2e/recommended-routine/thumbnail.jpg',
            '123',
          );

          expect(res.statusCode).toBe(400);
        });
      });

      describe('using valid mongo object id with thumbnail', () => {
        it('should return routineModel', async () => {
          const res = await patchThumbnail(
            httpServer,
            accessToken,
            'test/e2e/recommended-routine/thumbnail.jpg',
            routineId,
          );

          expect(res.statusCode).toBe(200);
        });
      });
    });
  });

  describe('PATCH v1/recommended-routines/:id/cardnews after add routine', () => {
    describe('try patch cardnews', () => {
      describe('using invalid mongo object id with cardnews', () => {
        it('InvalidMongoObjectIdException should be thrown', async () => {
          const res = await patchCardnews(
            httpServer,
            accessToken,
            [
              'test/e2e/recommended-routine/1.jpg',
              'test/e2e/recommended-routine/2.jpg',
            ],
            '123',
          );

          expect(res.statusCode).toBe(400);
        });
      });

      describe('using valid mongo object id with cardnews', () => {
        it('should return routineModel', async () => {
          const res = await patchCardnews(
            httpServer,
            accessToken,
            [
              'test/e2e/recommended-routine/1.jpg',
              'test/e2e/recommended-routine/2.jpg',
            ],
            routineId,
          );

          expect(res.statusCode).toBe(200);
        });
      });
    });
  });

  describe('GET v1/recommended-routines/:id', () => {
    describe('try get an routine ', () => {
      it('should be return RoutineModel', async () => {
        const res = await getRecommendedRoutine(
          httpServer,
          accessToken,
          routineId,
        );

        thumbnail = res.body.thumbnail;
        cardnews = res.body.cardnews;

        expect(res.statusCode).toBe(200);
        expect(thumbnail).toBeDefined();
        expect(cardnews).toBeDefined();
      });
    });
  });
});

/***
 * 어드민이 아님
 * 어드민 권한 부여
 * routine이 없음
 * 루틴 하나 생성
 * 유효하지 않은 mongoose object id
 * findRoutine
 */
