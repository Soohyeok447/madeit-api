import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { setTimeOut } from '../e2e-env';
import { AppModule } from '../../../src/ioc/AppModule';
import { DatabaseService } from 'src/ioc/DatabaseModule';
import { InitApp } from '../config';
import { Category } from '../../../src/domain/common/enums/Category';
import { Connection } from 'mongoose';
import * as request from 'supertest';
import { SignUpRequestDto } from '../../../src/adapter/auth/sign-up/SignUpRequestDto';
import { AddRecommendedRoutineRequestDto } from '../../../src/adapter/recommended-routine/add-recommended-routine/AddRecommendedRoutineRequestDto';

describe('patchImages e2e test', () => {
  let app: INestApplication;
  let httpServer: any;
  let dbConnection: Connection;

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

    const signUpParam: SignUpRequestDto = {
      thirdPartyAccessToken: 'asdfasdfasdfasdf',
      username: '테스트입니다',
      age: 1,
      goal: 'e2e테스트중',
      statusMessage: '모든게 잘 될거야',
    };

    const res: request.Response = await request(httpServer)
      .post(`/v1/e2e/auth/signup?provider=kakao`)
      .set('Accept', 'application/json')
      .type('application/json')
      .send(signUpParam);

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
            const res: request.Response = await request(httpServer)
              .patch(
                `/v1/recommended-routines/123456789101112131415161/thumbnail`,
              )
              .set('Authorization', `Bearer ${accessToken}`)
              .set('Content-Type', 'multipart/form-data')
              .attach(
                'thumbnail',
                'test/e2e/recommended-routine/thumbnail.jpg',
              );

            expect(res.statusCode).toBe(401);
          });
        });

        describe('using invalid mongo object id with thumbnail', () => {
          it('InvalidMongoObjectIdException should be thrown', async () => {
            const res: request.Response = await request(httpServer)
              .patch(`/v1/recommended-routines/123/thumbnail`)
              .set('Authorization', `Bearer ${accessToken}`)
              .set('Content-Type', 'multipart/form-data')
              .attach(
                'thumbnail',
                'test/e2e/recommended-routine/thumbnail.jpg',
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
            //TODO fix it
            await request(httpServer)
              .patch('/v1/e2e/user')
              .set('Authorization', `Bearer ${accessToken}`);

            const res: request.Response = await request(httpServer)
              .patch(
                `/v1/recommended-routines/123456789101112131415161/thumbnail`,
              )
              .set('Authorization', `Bearer ${accessToken}`)
              .set('Content-Type', 'multipart/form-data')
              .attach(
                'thumbnail',
                'test/e2e/recommended-routine/thumbnail.jpg',
              );

            expect(res.statusCode).toBe(404);
          });
        });

        describe('using invalid mongo object id with thumbnail', () => {
          it('InvalidMongoObjectIdException should be thrown', async () => {
            const res: request.Response = await request(httpServer)
              .patch(`/v1/recommended-routines/123/thumbnail`)
              .set('Authorization', `Bearer ${accessToken}`)
              .set('Content-Type', 'multipart/form-data')
              .attach(
                'thumbnail',
                'test/e2e/recommended-routine/thumbnail.jpg',
              );

            expect(res.statusCode).toBe(400);
          });
        });
      });
    });
  });

  describe('POST v1/recommended-routines', () => {
    it('add an routine', async () => {
      //TODO fix it
      await request(httpServer)
        .patch('/v1/e2e/user')
        .set('Authorization', `Bearer ${accessToken}`);

      const addRoutineParam: AddRecommendedRoutineRequestDto = {
        title: 'e2eTest',
        category: Category.Reading,
        introduction: 'e2eTest',
      };

      const res: request.Response = await request(httpServer)
        .post('/v1/recommended-routines')
        .set('Authorization', `Bearer ${accessToken}`)
        .set('Accept', 'application/json')
        .type('application/json')
        .send(addRoutineParam);

      routineId = res.body.id;
    });
  });

  describe('PATCH v1/recommended-routines/:id/thumbnail after add routine', () => {
    describe('try patch thumbnail', () => {
      describe('using invalid mongo object id with thumbnail', () => {
        it('InvalidMongoObjectIdException should be thrown', async () => {
          const res: request.Response = await request(httpServer)
            .patch(`/v1/recommended-routines/123/thumbnail`)
            .set('Authorization', `Bearer ${accessToken}`)
            .set('Content-Type', 'multipart/form-data')
            .attach('thumbnail', 'test/e2e/recommended-routine/thumbnail.jpg');

          expect(res.statusCode).toBe(400);
        });
      });

      describe('using valid mongo object id with thumbnail', () => {
        it('should return routineModel', async () => {
          const res: request.Response = await request(httpServer)
            .patch(`/v1/recommended-routines/${routineId}/thumbnail`)
            .set('Authorization', `Bearer ${accessToken}`)
            .set('Content-Type', 'multipart/form-data')
            .attach('thumbnail', 'test/e2e/recommended-routine/thumbnail.jpg');

          expect(res.statusCode).toBe(200);
        });
      });
    });
  });

  describe('PATCH v1/recommended-routines/:id/cardnews after add routine', () => {
    describe('try patch cardnews', () => {
      describe('using invalid mongo object id with cardnews', () => {
        it('InvalidMongoObjectIdException should be thrown', async () => {
          const res: request.Response = await request(httpServer)
            .patch(`/v1/recommended-routines/123/cardnews`)
            .set('Authorization', `Bearer ${accessToken}`)
            .set('Content-Type', 'multipart/form-data')
            .attach('cardnews', 'test/e2e/recommended-routine/1.jpg')
            .attach(
              'cardnews',
              'test/e2e/recommended-routine/1.jpg',
              'test/e2e/recommended-routine/2.jpg',
            );

          expect(res.statusCode).toBe(400);
        });
      });

      describe('using valid mongo object id with cardnews', () => {
        it('should return routineModel', async () => {
          const res: request.Response = await request(httpServer)
            .patch(`/v1/recommended-routines/${routineId}/cardnews`)
            .set('Authorization', `Bearer ${accessToken}`)
            .set('Content-Type', 'multipart/form-data')
            .attach('cardnews', 'test/e2e/recommended-routine/1.jpg')
            .attach(
              'cardnews',
              'test/e2e/recommended-routine/1.jpg',
              'test/e2e/recommended-routine/2.jpg',
            );

          expect(res.statusCode).toBe(200);
        });
      });
    });
  });

  describe('GET v1/recommended-routines/:id', () => {
    describe('try get an routine ', () => {
      it('should be return RoutineModel', async () => {
        const res: request.Response = await request(httpServer)
          .get(`/v1/recommended-routines/${routineId}`)
          .set('Authorization', `Bearer ${accessToken}`);

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
