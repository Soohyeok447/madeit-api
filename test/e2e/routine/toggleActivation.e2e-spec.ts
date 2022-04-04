import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { setTimeOut } from '../e2e-env';
import { AppModule } from '../../../src/ioc/AppModule';
import { DatabaseService } from '../../../src/ioc/CoreModule';
import { InitApp } from '../config';
import { Connection } from 'mongoose';
import { SignUpRequestDto } from '../../../src/adapter/auth/sign-up/SignUpRequestDto';
import * as request from 'supertest';
import { AddRoutineRequestDto } from '../../../src/adapter/routine/add-routine/AddRoutineRequestDto';

describe('toggleActivation e2e test', () => {
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

  let routineId: string;

  describe('POST v1/routines', () => {
    describe('try add routine', () => {
      it('success to add routine', async () => {
        const addRoutineParam: AddRoutineRequestDto = {
          title: '테스트',
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

  describe('PATCH v1/routines/:id/inactivate already activation is false ', () => {
    describe('try patch activation field', () => {
      it('RoutineAlreadyInactivatedException should be thrown', async () => {
        const res: request.Response = await request(httpServer)
          .patch(`/v1/routines/${routineId}/inactivate`)
          .set('Authorization', `Bearer ${accessToken}`);

        expect(res.statusCode).toBe(409);
        expect(res.body.errorCode).toBe(1);
      });
    });
  });

  describe('PATCH v1/routines/:id/activate', () => {
    describe('try patch activation field', () => {
      it('activation should be toggled', async () => {
        const res: request.Response = await request(httpServer)
          .patch(`/v1/routines/${routineId}/activate`)
          .set('Authorization', `Bearer ${accessToken}`);

        expect(res.statusCode).toBe(200);
      });
    });
  });

  describe('PATCH v1/routines/:id/activate already activation is true ', () => {
    describe('try patch activation field', () => {
      it('RoutineAlreadyActivatedException should be thrown', async () => {
        const res: request.Response = await request(httpServer)
          .patch(`/v1/routines/${routineId}/activate`)
          .set('Authorization', `Bearer ${accessToken}`);

        expect(res.statusCode).toBe(409);
        expect(res.body.errorCode).toBe(1);
      });
    });
  });

  describe('PATCH v1/routines/:id/inactivate', () => {
    describe('try patch activation field', () => {
      it('activation should be toggled', async () => {
        const res: request.Response = await request(httpServer)
          .patch(`/v1/routines/${routineId}/inactivate`)
          .set('Authorization', `Bearer ${accessToken}`);

        expect(res.statusCode).toBe(200);
      });
    });
  });

  describe('GET v1/routines', () => {
    describe('try get routines', () => {
      it("body[0]'s activation should be changed", async () => {
        const res: request.Response = await request(httpServer)
          .get(`/v1/routines`)
          .set('Authorization', `Bearer ${accessToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body[0].activation).toEqual(false);
      });
    });
  });
});

/***
 * 루틴 하나 생성
 * 이미 비활성화중일 때 비활성화 시도
 * 알람 활성화
 * 이미 활성화중일 때 활성화 시도
 * 알람 비활성화
 * 비활성화 상태인지 확인
 */
