import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { setTimeOut } from '../e2e-env';
import { AppModule } from '../../../src/ioc/AppModule';
import { DatabaseService } from 'src/ioc/DatabaseModule';
import {
  addRecommendedRoutine,
  authorize,
} from '../request.index';
import { InitApp, initSignUp } from '../config';
import { Category } from '../../../src/domain/enums/Category';
import { FixedField } from '../../../src/domain/enums/FixedField';
import { getRecommendedRoutines } from './request';

describe('getRecommendedRoutines e2e test', () => {
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

    await app.close();
  });

  describe('GET v1/recommended-routines/:id before add an recommended routine', () => {
    it('[] should be thrown', async () => {
      const res = await getRecommendedRoutines(httpServer, accessToken, 5);

      expect(res.statusCode).toBe(200);
      expect(res.body.items).toHaveLength(0);
    });
  });

  describe('POST v1/recommended-routines', () => {
    it('add recommended routine 3 times', async () => {
      await authorize(httpServer, accessToken);

      for (let i = 0; i < 3; i++) {
        const addRoutineParam = {
          title: `테스트${i}`,
          introduction: '소개글',
          category: Category.Health,
          fixedFields: [FixedField.Title, FixedField.ContentVideoId],
          hour: 3,
          minute: 30,
        };

        await addRecommendedRoutine(httpServer, accessToken, addRoutineParam);
      }
    });
  });

  describe('GET v1/recommended-routines after add recommended routine 3 times', () => {
    it('RecommendedRoutineModel list should be thrown', async () => {
      await authorize(httpServer, accessToken);

      const res = await getRecommendedRoutines(httpServer, accessToken, 5);

      expect(res.statusCode).toBe(200);
      expect(res.body.items).toHaveLength(3);
      expect(res.body.hasMore).toEqual(false);
      expect(res.body.nextCursor).toEqual(null);
    });
  });

  describe('POST v1/recommended-routines already called 3 times', () => {
    it('add recommended routine 3 times', async () => {
      await authorize(httpServer, accessToken);

      for (let i = 3; i < 7; i++) {
        const addRoutineParam = {
          title: `테스트${i}`,
          introduction: '소개글',
          category: Category.Health,
          fixedFields: [FixedField.Title, FixedField.ContentVideoId],
          hour: 3,
          minute: 30,
        };

        await addRecommendedRoutine(httpServer, accessToken, addRoutineParam);
      }
    });
  });

  let nextCursor: string;

  describe('GET v1/recommended-routines after add recommended routine 9 times', () => {
    it('RecommendedRoutineModel list should be thrown', async () => {
      await authorize(httpServer, accessToken);

      const res = await getRecommendedRoutines(httpServer, accessToken, 5);

      nextCursor = res.body.nextCursor;

      expect(res.statusCode).toBe(200);
      expect(res.body.items).toHaveLength(5);
      expect(res.body.hasMore).toEqual(true);
    });
  });

  describe('GET v1/recommended-routines using paging', () => {
    it('RecommendedRoutineModel list should be thrown', async () => {
      await authorize(httpServer, accessToken);

      const res = await getRecommendedRoutines(
        httpServer,
        accessToken,
        5,
        nextCursor,
      );

      expect(res.statusCode).toBe(200);
      expect(res.body.items).toHaveLength(2);
      expect(res.body.hasMore).toEqual(false);
    });
  });
});

/***
 * [size는 5]
 * 아무것도 없을 때 getAll 해서 [] 받기
 * 루틴 3개 생성
 * getALl해서 3개 받아졌나 확인 + nextCursor null인지 확인
 * 루틴 4개 생성
 * getAll해서 5개 받아졌나 확인 + nextCursor 존재하고 hasMore true인지 확인
 * nextCursor로 페이징
 * nextCursor null인지 확인 hasMore false인지 확인
 */
