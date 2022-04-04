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
import { SignUpRequestDto } from '../../../src/adapter/auth/sign-up/SignUpRequestDto';
import { AddRecommendedRoutineRequestDto } from '../../../src/adapter/recommended-routine/add-recommended-routine/AddRecommendedRoutineRequestDto';
import { ModifyRecommendedRoutineRequestDto } from '../../../src/adapter/recommended-routine/modify-recommended-routine/ModifyRecommendedRoutineRequestDto';

describe('modifyRecommendedRoutine e2e test', () => {
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

  let routineId: string;

  describe('POST v1/recommended-routines', () => {
    describe('try add an recommended routine', () => {
      it('success to add recommded routine', async () => {
        //TODO fix it
        await request(httpServer)
          .patch('/v1/e2e/user')
          .set('Authorization', `Bearer ${accessToken}`);

        const addRoutineParam: AddRecommendedRoutineRequestDto = {
          title: '타이틀',
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

        const addRoutineParam2: AddRecommendedRoutineRequestDto = {
          title: '중복되지 않은 타이틀',
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
          .send(addRoutineParam2);

        routineId = res.body.id;
      });
    });
  });

  describe('PATCH v1/recommended-routines/:id', () => {
    describe('try modify an recommended routine', () => {
      describe('using invalid request body', () => {
        it('BadRequestException should be return', async () => {
          const modifyRoutineParam: any = {
            category: '잘못된 카테고리',
          };

          const res: request.Response = await request(httpServer)
            .patch(`/v1/recommended-routines/${routineId}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .set('Accept', 'application/json')
            .type('application/json')
            .send(modifyRoutineParam);

          expect(res.statusCode).toBe(400);
        });
      });

      describe('using valid request body that include duplicated title', () => {
        it('ConflictTitleException should be return', async () => {
          const modifyRoutineParam: ModifyRecommendedRoutineRequestDto = {
            title: '타이틀',
            introduction: '소개글',
            category: Category.Health,
          };

          const res: request.Response = await request(httpServer)
            .patch(`/v1/recommended-routines/${routineId}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .set('Accept', 'application/json')
            .type('application/json')
            .send(modifyRoutineParam);

          expect(res.statusCode).toBe(409);
        });
      });

      describe('using valid request body', () => {
        it('recommended routine model should be return', async () => {
          //TODO fix it
          await request(httpServer)
            .patch('/v1/e2e/user')
            .set('Authorization', `Bearer ${accessToken}`);

          const modifyRoutineParam: ModifyRecommendedRoutineRequestDto = {
            title: '이거 괜찮습니다~~',
            introduction: '수정된 소개글',
            category: Category.Health,
          };

          const res: request.Response = await request(httpServer)
            .patch(`/v1/recommended-routines/${routineId}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .set('Accept', 'application/json')
            .type('application/json')
            .send(modifyRoutineParam);

          expect(res.statusCode).toBe(200);
          expect(res.body.introduction).toEqual('수정된 소개글');
          expect(res.body.cardnews).toEqual(null);
        });
      });
    });
  });
});

/***
 * 추천 루틴 2개 추가 -> 그 중 1개의 routineId 저장
 * 잘못된 form (category, fixedFields)
 * 중복된 이름으로 수정시도
 * 수정 성공
 * 수정된 것 확인
 */
