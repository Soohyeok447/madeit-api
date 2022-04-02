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

describe('addRecommendedRoutine e2e test', () => {
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

  describe('POST v1/recommended-routines', () => {
    describe('try add an recommended routine', () => {
      describe('using not intact request body', () => {
        it('BadRequestException should be return', async () => {
          const addRoutineParam: any = {
            title: '타이틀',
          };

          const res: request.Response = await request(httpServer)
            .post('/v1/recommended-routines')
            .set('Authorization', `Bearer ${accessToken}`)
            .set('Accept', 'application/json')
            .type('application/json')
            .send(addRoutineParam);

          expect(res.statusCode).toBe(400);
        });
      });

      describe('using valid request body', () => {
        describe('before get authorization', () => {
          it('UserNotAdminException should be return', async () => {
            const addRoutineParam: AddRecommendedRoutineRequestDto = {
              title: '타이틀',
              introduction: '소개글',
              category: Category.Health,
            };

            const res: request.Response = await request(httpServer)
              .post('/v1/recommended-routines')
              .set('Authorization', `Bearer ${accessToken}`)
              .set('Accept', 'application/json')
              .type('application/json')
              .send(addRoutineParam);

            expect(res.statusCode).toBe(401);
          });
        });
      });

      describe('using valid request body after get authorization', () => {
        it('recommended routine model should be return', async () => {
          //TODO fix it
          await request(httpServer)
            .patch('/v1/e2e/user')
            .set('Authorization', `Bearer ${accessToken}`);

          const addRoutineParam: AddRecommendedRoutineRequestDto = {
            title: '타이틀',
            introduction: '소개글',
            category: Category.Health,
          };

          const res: request.Response = await request(httpServer)
            .post('/v1/recommended-routines')
            .set('Authorization', `Bearer ${accessToken}`)
            .set('Accept', 'application/json')
            .type('application/json')
            .send(addRoutineParam);

          expect(res.statusCode).toBe(201);
        });
      });

      describe('try add recommended routine that has duplicated title ', () => {
        it('TitleConflictException should be thrown', async () => {
          //TODO fix it
          await request(httpServer)
            .patch('/v1/e2e/user')
            .set('Authorization', `Bearer ${accessToken}`);

          const addRoutineParam: AddRecommendedRoutineRequestDto = {
            title: '타이틀',
            introduction: '소개글',
            category: Category.Health,
          };

          const res: request.Response = await request(httpServer)
            .post('/v1/recommended-routines')
            .set('Authorization', `Bearer ${accessToken}`)
            .set('Accept', 'application/json')
            .type('application/json')
            .send(addRoutineParam);

          expect(res.statusCode).toBe(409);
          expect(res.body.errorCode).toBe(1);
        });
      });

      describe('using valid request body without duplicated title', () => {
        it('recommended routine model should be return', async () => {
          //TODO fix it
          await request(httpServer)
            .patch('/v1/e2e/user')
            .set('Authorization', `Bearer ${accessToken}`);

          const addRoutineParam: AddRecommendedRoutineRequestDto = {
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
            .send(addRoutineParam);

          expect(res.statusCode).toBe(201);
          expect(res.body.fixedFields).toEqual([
            FixedField.Title,
            FixedField.ContentVideoId,
          ]);
          expect(res.body.hour).toEqual(3);
          expect(res.body.minute).toEqual(30);
        });
      });
    });
  });
});

/***
 * 완전치 않은 request body
 * 어드민이 아님
 * 추천 루틴 추가
 * 중복된 이름으로 추가시도
 * 새 추천 루틴 추가
 */
