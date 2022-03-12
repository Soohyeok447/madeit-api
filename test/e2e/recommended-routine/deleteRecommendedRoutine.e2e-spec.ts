import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { setTimeOut } from '../e2e-env';
import { AppModule } from '../../../src/ioc/AppModule';
import { DatabaseService } from 'src/ioc/DatabaseModule';
import {
  addRecommendedRoutine,
  authorize,
  deleteRecommendedRoutine,
} from '../request.index';
import { InitApp, initSignUp } from '../config';
import { Category } from '../../../src/domain/common/enums/Category';
import { FixedField } from '../../../src/domain/common/enums/FixedField';

describe('deleteRecommendedRoutine e2e test', () => {
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

  let routineId: string;

  describe('POST v1/recommended-routines', () => {
    describe('try add an recommended routine', () => {
      it('success to add recommded routine', async () => {
        await authorize(httpServer, accessToken);

        const addRoutineParam = {
          title: '타이틀',
          introduction: '소개글',
          category: Category.Health,
          fixedFields: [FixedField.Title, FixedField.ContentVideoId],
          hour: 3,
          minute: 30,
        };

        const res = await addRecommendedRoutine(
          httpServer,
          accessToken,
          addRoutineParam,
        );

        routineId = res.body.id;
      });
    });
  });

  describe('Delete v1/recommended-routines/:id', () => {
    describe('try delete an recommended routine', () => {
      it('expect to succeed remonvig an recommended routine', async () => {
        const res = await deleteRecommendedRoutine(
          httpServer,
          accessToken,
          routineId,
        );

        expect(res.statusCode).toBe(200);
      });
    });

    describe('try delete already deleted recommended routine', () => {
      it('NotFoundRecommededRoutineException should be thrown', async () => {
        const res = await deleteRecommendedRoutine(
          httpServer,
          accessToken,
          routineId,
        );

        expect(res.statusCode).toBe(404);
        expect(res.body.errorCode).toBe(72);
      });
    });
  });
});

/***
 * 추천 루틴 생성
 * 추천 루틴 삭제
 * 삭제된 것 확인
 */
