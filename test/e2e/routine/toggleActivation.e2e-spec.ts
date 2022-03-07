import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { setTimeOut } from '../e2e-env';
import { AppModule } from '../../../src/ioc/AppModule';
import { DatabaseService } from 'src/ioc/DatabaseModule';
import { addRoutine } from '../request.index';
import { InitApp, initSignUp } from '../config';
import { activateRoutine, getRoutines, inactivateRoutine } from './request';

describe('toggleActivation e2e test', () => {
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
    await dbConnection.collection('routines').deleteMany({});

    await app.close();
  });

  let routineId: string;

  describe('POST v1/routines', () => {
    describe('try add routine', () => {
      it('success to add routine', async () => {
        const addRoutineParam = {
          title: '테스트',
          hour: 11,
          minute: 15,
          days: [1, 2, 5, 7],
          alarmVideoId: 'asdfasdf',
          contentVideoId: 'asdfasdf',
          timerDuration: 3000,
        };

        const res = await addRoutine(httpServer, accessToken, addRoutineParam);
        routineId = res.body.id;

        expect(res.statusCode).toBe(201);
      });
    });
  });

  describe('PATCH v1/routines/:id/inactivate already activation is false ', () => {
    describe('try patch activation field', () => {
      it('RoutineAlreadyInactivatedException should be thrown', async () => {
        const res = await inactivateRoutine(httpServer, accessToken, routineId);

        expect(res.statusCode).toBe(409);
        expect(res.body.errorCode).toBe(1);
      });
    });
  });

  describe('PATCH v1/routines/:id/activate', () => {
    describe('try patch activation field', () => {
      it('activation should be toggled', async () => {
        const res = await activateRoutine(httpServer, accessToken, routineId);

        expect(res.statusCode).toBe(200);
      });
    });
  });

  describe('PATCH v1/routines/:id/activate already activation is true ', () => {
    describe('try patch activation field', () => {
      it('RoutineAlreadyActivatedException should be thrown', async () => {
        const res = await activateRoutine(httpServer, accessToken, routineId);

        expect(res.statusCode).toBe(409);
        expect(res.body.errorCode).toBe(1);
      });
    });
  });

  describe('PATCH v1/routines/:id/inactivate', () => {
    describe('try patch activation field', () => {
      it('activation should be toggled', async () => {
        const res = await inactivateRoutine(httpServer, accessToken, routineId);

        expect(res.statusCode).toBe(200);
      });
    });
  });

  describe('GET v1/routines', () => {
    describe('try get routines', () => {
      it("body[0]'s activation should be changed", async () => {
        const res = await getRoutines(httpServer, accessToken);

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
