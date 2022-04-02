import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { setTimeOut } from '../e2e-env';
import { AppModule } from '../../../src/ioc/AppModule';
import { DatabaseService } from 'src/ioc/DatabaseModule';
import { InitApp } from '../config';
import { Connection } from 'mongoose';
import * as request from 'supertest';
import { SignUpRequestDto } from '../../../src/adapter/auth/sign-up/SignUpRequestDto';
import { AddRoutineRequestDto } from '../../../src/adapter/routine/add-routine/AddRoutineRequestDto';

describe('getRoutine e2e test', () => {
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
    await dbConnection.collection('routines').deleteMany({});

    await app.close();
  });

  describe('GET v1/routines/:id (unknown)', () => {
    describe('try get an routine ', () => {
      describe('using invalid mongoose object id', () => {
        it('InvalidMongoObjectIdException should be thrown', async () => {
          const res: request.Response = await request(httpServer)
            .get(`/v1/routines/InvalidId`)
            .set('Authorization', `Bearer ${accessToken}`);

          expect(res.statusCode).toBe(400);
        });
      });

      describe('using nonexistent id', () => {
        it('RoutineNotFoundException should be thrown', async () => {
          const res: request.Response = await request(httpServer)
            .get(`/v1/routines/123456789101112131415161`)
            .set('Authorization', `Bearer ${accessToken}`);

          expect(res.statusCode).toBe(404);
        });
      });
    });
  });

  let routineId: string;

  describe('POST v1/routines', () => {
    describe('try add routine', () => {
      describe('using intact request body that contains not duplicated routine name', () => {
        it('should return an RoutineModel', async () => {
          const addRoutineParam: AddRoutineRequestDto = {
            title: '타이틀',
            hour: 11,
            minute: 15,
            days: [1, 2, 5, 7],
            alarmVideoId: 'asdfasdf',
            contentVideoId: 'asdfasdf',
            timerDuration: 3000,
          };

          const res: request.Response = await request(httpServer)
            .post('/v1/routines')
            .set('Authorization', `Bearer ${accessToken}`)
            .set('Accept', 'application/json')
            .type('application/json')
            .send(addRoutineParam);

          routineId = res.body.id;

          expect(res.statusCode).toBe(201);
        });
      });
    });
  });

  describe('GET v1/routines/:id', () => {
    describe('try get an routine using id', () => {
      it('should return an RoutineModel', async () => {
        const res: request.Response = await request(httpServer)
          .get(`/v1/routines/${routineId}`)
          .set('Authorization', `Bearer ${accessToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body).toBeDefined();
      });
    });
  });

  describe('POST v1/routines (included fixedFields property)', () => {
    describe('try add routine ', () => {
      describe('using intact request body with valid fixedFields', () => {
        it('should return an RoutineModel', async () => {
          const addRoutineParam: AddRoutineRequestDto = {
            title: '타이틀',
            hour: 23,
            minute: 55,
            days: [1, 2, 5, 7],
            alarmVideoId: 'asdfasdf',
            contentVideoId: 'asdfasdf',
            timerDuration: 3000,
          };

          const res: request.Response = await request(httpServer)
            .post('/v1/routines')
            .set('Authorization', `Bearer ${accessToken}`)
            .set('Accept', 'application/json')
            .type('application/json')
            .send(addRoutineParam);

          routineId = res.body.id;

          expect(res.statusCode).toBe(201);
        });
      });
    });

    describe('GET v1/routines/:id (after add another routine included fixedFields property)', () => {
      describe('try get an routine using id', () => {
        it('should return an RoutineModel that included fixedFields', async () => {
          const res: request.Response = await request(httpServer)
            .get(`/v1/routines/${routineId}`)
            .set('Authorization', `Bearer ${accessToken}`);

          expect(res.statusCode).toBe(200);
          expect(res.body.fixedFields).toEqual([]);
        });
      });
    });
  });
});

/***
 * 유효하지 않은 몽구스 id로 get 시도
 * 없는 루틴 id로 get 시도
 * 루틴 하나 생성
 * 루틴 찾기
 * fixedFields 추가된 루틴 하나 생성
 * 추가됐는지 찾고 확인
 */
