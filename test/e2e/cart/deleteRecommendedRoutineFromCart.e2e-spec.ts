import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { setTimeOut } from '../e2e-env';
import { AppModule } from '../../../src/ioc/AppModule';
import { DatabaseService } from 'src/ioc/DatabaseModule';
import { Category } from 'src/domain/common/enums/Category';
import { InitApp } from '../config';
import { SignUpRequestDto } from '../../../src/adapter/auth/sign-up/SignUpRequestDto';
import * as request from 'supertest';
import { Connection } from 'mongoose';
import { AddRecommendedRoutineRequestDto } from '../../../src/adapter/recommended-routine/add-recommended-routine/AddRecommendedRoutineRequestDto';
import { AddRoutineToCartRequestDto } from '../../../src/adapter/cart/add-routine-to-cart/AddRoutineToCartRequestDto';

describe('deleteRecommendedRoutineFromCart e2e test', () => {
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
      //TODO fix it
      await request(httpServer)
        .patch('/v1/e2e/user')
        .set('Authorization', `Bearer ${accessToken}`);

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
