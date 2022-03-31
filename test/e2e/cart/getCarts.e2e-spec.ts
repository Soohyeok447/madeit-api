import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { setTimeOut } from '../e2e-env';
import { AppModule } from '../../../src/ioc/AppModule';
import { DatabaseService } from 'src/ioc/DatabaseModule';
import { Category } from 'src/domain/common/enums/Category';
import { authorize } from '../request.index';
import { InitApp } from '../config';
import { SignUpRequestDto } from '../../../src/adapter/auth/sign-up/SignUpRequestDto';
import * as request from 'supertest';

describe('getCarts e2e test', () => {
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

    const signUpParam: SignUpRequestDto = {
      thirdPartyAccessToken: 'asdfasdfasdfasdf',
      username: '테스트입니다',
      age: 1,
      goal: 'e2e테스트중',
      statusMessage: '모든게 잘 될거야',
    };

    const res = await request(httpServer)
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

  describe('GET v1/carts', () => {
    describe('try get carts', () => {
      it('should return []', async () => {
        const res = await request(httpServer)
          .get('/v1/carts')
          .set('Authorization', `Bearer ${accessToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual([]);
      });
    });
  });

  let firstRoutineId;
  let secondRoutineId;

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

      const res1 = await request(httpServer)
        .post('/v1/recommended-routines')
        .set('Authorization', `Bearer ${accessToken}`)
        .set('Accept', 'application/json')
        .type('application/json')
        .send(addRoutineParam1);

      const res2 = await request(httpServer)
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
      const routineId1 = {
        recommendedRoutineId: firstRoutineId,
      };

      const routineId2 = {
        recommendedRoutineId: secondRoutineId,
      };

      await request(httpServer)
        .post('/v1/carts')
        .set('Authorization', `Bearer ${accessToken}`)
        .set('Accept', 'application/json')
        .type('application/json')
        .send(routineId1);

      await request(httpServer)
        .post('/v1/carts')
        .set('Authorization', `Bearer ${accessToken}`)
        .set('Accept', 'application/json')
        .type('application/json')
        .send(routineId2);
    });
  });

  describe('GET v1/carts after add routines to cart', () => {
    describe('try get carts', () => {
      it('should return carts', async () => {
        const res = await request(httpServer)
          .get('/v1/carts')
          .set('Authorization', `Bearer ${accessToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveLength(2);
      });
    });
  });
});

/***
 * 빈 장바구니 get
 * 루틴 2개 추가
 * 장바구니 get
 */
