import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { setTimeOut } from '../e2e-env';
import { AppModule } from '../../../src/ioc/AppModule';
import { DatabaseService } from 'src/ioc/DatabaseModule';
import { Category } from 'src/domain/enums/Category';
import {
  authorize,
  addRoutinesToCart,
  getcarts,
  addRecommendedRoutine,
} from '../request.index';
import { InitApp, initSignUp } from '../config';

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

    const res = await initSignUp(httpServer);

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
        const res = await getcarts(httpServer, accessToken);

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
      const routineId1 = {
        routineId: firstRoutineId,
      };

      const routineId2 = {
        routineId: secondRoutineId,
      };

      await addRoutinesToCart(httpServer, accessToken, routineId1);
      await addRoutinesToCart(httpServer, accessToken, routineId2);
    });
  });

  describe('GET v1/carts after add routines to cart', () => {
    describe('try get carts', () => {
      it('should return carts', async () => {
        const res = await getcarts(httpServer, accessToken);

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
