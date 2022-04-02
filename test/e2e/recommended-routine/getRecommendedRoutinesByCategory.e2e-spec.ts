import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { setTimeOut } from '../e2e-env';
import { AppModule } from '../../../src/ioc/AppModule';
import { DatabaseService } from 'src/ioc/DatabaseModule';
import { InitApp } from '../config';
import { Category } from '../../../src/domain/common/enums/Category';
import { FixedField } from '../../../src/domain/common/enums/FixedField';
import { Connection } from 'mongoose';
import * as request from 'supertest';
import { SignUpRequestDto } from '../../../src/adapter/auth/sign-up/SignUpRequestDto';
import { AddRecommendedRoutineRequestDto } from '../../../src/adapter/recommended-routine/add-recommended-routine/AddRecommendedRoutineRequestDto';

describe('getRecommendedRoutinesByCategory e2e test', () => {
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

    await app.close();
  });

  describe('GET v1/recommended-routines using invalid category', () => {
    it('[] should be thrown', async () => {
      const res: request.Response = await request(httpServer)
        .get(`/v1/recommended-routines?size=5&category=invalid`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.statusCode).toBe(400);
      expect(res.body.errorCode).toEqual(1);
    });
  });

  describe('GET v1/recommended-routines before add an recommended routine', () => {
    it('[] should be thrown', async () => {
      const res: request.Response = await request(httpServer)
        .get(`/v1/recommended-routines?size=5&category=Health`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.items).toHaveLength(0);
    });
  });

  describe('POST v1/recommended-routines', () => {
    it('add recommended routine 3 times', async () => {
      //TODO fix it
      await request(httpServer)
        .patch('/v1/e2e/user')
        .set('Authorization', `Bearer ${accessToken}`);

      let i: number;
      for (i = 0; i < 3; i++) {
        const addRoutineParam: AddRecommendedRoutineRequestDto = {
          title: `테스트${i}`,
          introduction: '소개글',
          category: Category.Health,
          fixedFields: [FixedField.Title, FixedField.ContentVideoId],
          hour: 3,
          minute: 30,
        };

        await request(httpServer)
          .post('/v1/recommended-routines')
          .set('Authorization', `Bearer ${accessToken}`)
          .set('Accept', 'application/json')
          .type('application/json')
          .send(addRoutineParam);
      }
    });
  });

  describe('GET v1/recommended-routines after add recommended routine 3 times', () => {
    it('RecommendedRoutineModel list should be thrown', async () => {
      //TODO fix it
      await request(httpServer)
        .patch('/v1/e2e/user')
        .set('Authorization', `Bearer ${accessToken}`);

      const res: request.Response = await request(httpServer)
        .get(`/v1/recommended-routines?size=5&category=Health`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.items).toHaveLength(3);
      expect(res.body.hasMore).toEqual(false);
      expect(res.body.nextCursor).toEqual(null);
    });
  });

  describe('POST v1/recommended-routines already called 3 times', () => {
    it('add recommended routine 3 times', async () => {
      //TODO fix it
      await request(httpServer)
        .patch('/v1/e2e/user')
        .set('Authorization', `Bearer ${accessToken}`);

      let i: number;
      for (i = 3; i < 7; i++) {
        const addRoutineParam: AddRecommendedRoutineRequestDto = {
          title: `테스트${i}`,
          introduction: '소개글',
          category: Category.Health,
          fixedFields: [FixedField.Title, FixedField.ContentVideoId],
          hour: 3,
          minute: 30,
        };

        await request(httpServer)
          .post('/v1/recommended-routines')
          .set('Authorization', `Bearer ${accessToken}`)
          .set('Accept', 'application/json')
          .type('application/json')
          .send(addRoutineParam);
      }
    });
  });

  let nextCursor: string;

  describe('GET v1/recommended-routines after add recommended routine 9 times', () => {
    it('RecommendedRoutineModel list should be thrown', async () => {
      //TODO fix it
      await request(httpServer)
        .patch('/v1/e2e/user')
        .set('Authorization', `Bearer ${accessToken}`);

      const res: request.Response = await request(httpServer)
        .get(`/v1/recommended-routines?size=5&category=Health`)
        .set('Authorization', `Bearer ${accessToken}`);
      nextCursor = res.body.nextCursor;

      expect(res.statusCode).toBe(200);
      expect(res.body.items).toHaveLength(5);
      expect(res.body.hasMore).toEqual(true);
    });
  });

  describe('GET v1/recommended-routines using paging', () => {
    it('RecommendedRoutineModel list should be thrown', async () => {
      //TODO fix it
      await request(httpServer)
        .patch('/v1/e2e/user')
        .set('Authorization', `Bearer ${accessToken}`);

      const res: request.Response = await request(httpServer)
        .get(
          `/v1/recommended-routines?size=5&category=Health&next=${nextCursor}`,
        )
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.items).toHaveLength(2);
      expect(res.body.hasMore).toEqual(false);
    });
  });
});

/***
 * [size는 5]
 * 유효하지 않은 카테고리로 검색 시도
 * 아무것도 없을 때 getAll 해서 [] 받기
 * 루틴 3개 생성
 * getALl해서 3개 받아졌나 확인 + nextCursor null인지 확인
 * 루틴 4개 생성
 * getAll해서 5개 받아졌나 확인 + nextCursor 존재하고 hasMore true인지 확인
 * nextCursor로 페이징
 * nextCursor null인지 확인 hasMore false인지 확인
 * 카테고리 한정해서 getAll하고 모든 item들의 category가 한정한 카테고리인지확인
 */
