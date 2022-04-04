import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { setTimeOut } from '../e2e-env';
import { AppModule } from '../../../src/ioc/AppModule';
import { DatabaseService } from '../../../src/ioc/CoreModule';
import { InitApp } from '../config';
import { Category } from '../../../src/domain/common/enums/Category';
import { FixedField } from '../../../src/domain/common/enums/FixedField';
import { Connection } from 'mongoose';
import * as request from 'supertest';
import { AddRecommendedRoutineRequestDto } from '../../../src/adapter/recommended-routine/add-recommended-routine/AddRecommendedRoutineRequestDto';
import { SignUpRequestDto } from '../../../src/adapter/auth/sign-up/SignUpRequestDto';

describe('getRecommendedRoutine e2e test', () => {
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

  describe('GET v1/recommended-routines/:id before add an recommended routine', () => {
    it('RecommendedRoutineNotFoundException should be thrown', async () => {
      //TODO fix it
      await request(httpServer)
        .patch('/v1/e2e/user')
        .set('Authorization', `Bearer ${accessToken}`);

      const res: request.Response = await request(httpServer)
        .get(`/v1/recommended-routines/621a6ec7e4490f5c4f189409`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.statusCode).toBe(404);
    });
  });

  let routineId: string;

  describe('POST v1/recommended-routines', () => {
    it('add an recommended routine', async () => {
      //TODO fix it
      await request(httpServer)
        .patch('/v1/e2e/user')
        .set('Authorization', `Bearer ${accessToken}`);

      const addRoutineParam: AddRecommendedRoutineRequestDto = {
        title: '테스트',
        introduction: '소개글',
        category: Category.Health,
        fixedFields: [FixedField.Title, FixedField.ContentVideoId],
        hour: 3,
        minute: 30,
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

  describe('GET v1/recommended-routines/:id after add an recommended routine', () => {
    it('RecommendedRoutineModel should be thrown', async () => {
      //TODO fix it
      await request(httpServer)
        .patch('/v1/e2e/user')
        .set('Authorization', `Bearer ${accessToken}`);

      const res: request.Response = await request(httpServer)
        .get(`/v1/recommended-routines/${routineId}`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.title).toEqual('테스트');
      expect(res.body.howToProveScript).toBeDefined();
      expect(res.body.howToProveImageUrl).toBeDefined();
    });
  });
});

/***
 * 없는 routineId로 찾기 시도
 * 추천 루틴 하나 생성
 * get 성공 (howToProve필드있나 확인)
 */
