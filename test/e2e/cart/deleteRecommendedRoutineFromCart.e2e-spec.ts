import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { setTimeOut } from '../e2e-env';
import { AppModule } from '../../../src/ioc/AppModule';
import { DatabaseService } from 'src/ioc/DatabaseModule';
import { Category } from 'src/domain/common/enums/Category';
import {
  authorize,
  addRecommendedRoutineToCart,
  getcarts,
  deleteRecommendedRoutineFromCart,
  addRecommendedRoutine,
} from '../request.index';
import { InitApp, initSignUp } from '../config';

describe('deleteRecommendedRoutineFromCart e2e test', () => {
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
          const res = await deleteRecommendedRoutineFromCart(
            httpServer,
            accessToken,
            '123456789101112131415161',
          );

          expect(res.statusCode).toBe(404);
        });
      });

      describe('using invlid mongo object id', () => {
        it('InvalidMongoObjectIdException should be thrown', async () => {
          const res = await deleteRecommendedRoutineFromCart(
            httpServer,
            accessToken,
            '123',
          );

          expect(res.statusCode).toBe(400);
        });
      });
    });
  });

  describe('POST v1/routines', () => {
    it('add routine two times', async () => {
      await authorize(httpServer, accessToken);

      const addRoutineParam1 = {
        title: `e2eTEST1`,
        category: Category.Health,
        introduction: 'e2eTEST',
      };

      const addRoutineParam2 = {
        title: `e2eTEST2`,
        category: Category.Health,
        introduction: 'e2eTEST',
      };

      const res1 = await addRecommendedRoutine(
        httpServer,
        accessToken,
        addRoutineParam1,
      );
      const res2 = await addRecommendedRoutine(
        httpServer,
        accessToken,
        addRoutineParam2,
      );

      firstRoutineId = res1.body.id;
      secondRoutineId = res2.body.id;
    });
  });

  describe('POST v1/carts', () => {
    it('add routine to cart two times', async () => {
      const recommendedRoutineId1 = {
        recommendedRoutineId: firstRoutineId,
      };

      const recommendedRoutineId2 = {
        recommendedRoutineId: secondRoutineId,
      };

      await addRecommendedRoutineToCart(
        httpServer,
        accessToken,
        recommendedRoutineId1,
      );
      await addRecommendedRoutineToCart(
        httpServer,
        accessToken,
        recommendedRoutineId2,
      );
    });
  });

  describe('GET v1/carts', () => {
    it('get carts that length is 2', async () => {
      const res = await getcarts(httpServer, accessToken);

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
          const res = await deleteRecommendedRoutineFromCart(
            httpServer,
            accessToken,
            '123456789101112131415161',
          );

          expect(res.statusCode).toBe(404);
        });
      });

      describe('using valid routineId', () => {
        it('success to delete', async () => {
          const res = await deleteRecommendedRoutineFromCart(
            httpServer,
            accessToken,
            firstRecommendedRoutineId,
          );

          expect(res.statusCode).toBe(200);
        });
      });
    });
  });

  describe('GET v1/carts after delete once', () => {
    it('get carts that length is 1', async () => {
      const res = await getcarts(httpServer, accessToken);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveLength(1);
    });
  });

  describe('DELETE v1/carts/:id after delete once', () => {
    describe('try delete routine from cart', () => {
      describe('using valid routineId', () => {
        it('success to delete', async () => {
          const res = await deleteRecommendedRoutineFromCart(
            httpServer,
            accessToken,
            secondRecommendedRoutineId,
          );

          expect(res.statusCode).toBe(200);
        });
      });
    });
  });

  describe('GET v1/carts after delete two times', () => {
    it('get carts that length is 0', async () => {
      const res = await getcarts(httpServer, accessToken);

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
