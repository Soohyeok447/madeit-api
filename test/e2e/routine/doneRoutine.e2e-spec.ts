import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { setTimeOut } from '../e2e-env';
import { AppModule } from '../../../src/ioc/AppModule';
import { DatabaseService } from 'src/ioc/DatabaseModule';
import { addRoutine, findUser } from '../request.index';
import { InitApp, initSignUp } from '../config';
import { doneRoutine } from './request';
import { Level } from '../../../src/domain/common/enums/Level';

describe('doneRoutine e2e test', () => {
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

  describe('POST v1/routines (point = 0, exp = 0)', () => {
    describe('try add routine', () => {
      it('success to add routine', async () => {
        const addRoutineParam = {
          title: '테스트',
          hour: 1,
          minute: 1,
          days: [1, 2, 5, 7],
          alarmVideoId: 'asdfasdf',
          contentVideoId: 'asdfasdf',
          timerDuration: 3000,
        };

        const res = await addRoutine(httpServer, accessToken, addRoutineParam);

        routineId = res.body.id;
      });
    });
  });

  describe('PATCH v1/routines/:id/done (exp, point이 각각 0) ', () => {
    describe('try call with nonexistent routineId', () => {
      it('RoutineNotFoundException should be thrown', async () => {
        const res = await doneRoutine(
          httpServer,
          accessToken,
          '621807f8955beba4b95f77f8',
        );

        expect(res.statusCode).toBe(404);
        expect(res.body.errorCode).toBe(71);
      });
    });

    describe('try call with valid routineId', () => {
      it('{} should be thrown', async () => {
        const res = await doneRoutine(httpServer, accessToken, routineId);

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({});
      });
    });

    describe('GET v1/users/me', () => {
      it('didRoutinesInTotal, didRoutinesInMonth should be increased', async () => {
        const res = await findUser(httpServer, accessToken);

        expect(res.statusCode).toBe(200);
        expect(res.body.didRoutinesInTotal).toEqual(1);
        expect(res.body.didRoutinesInMonth).toEqual(1);
        expect(res.body.level).toEqual(Level.bronze);
        expect(res.body.exp).toEqual(0);
        expect(res.body.point).toEqual(0);
      });
    });
  });

  describe('POST v1/routines (point = 100, exp = 1000)', () => {
    describe('try add routine', () => {
      it('success to add routine', async () => {
        const addRoutineParam = {
          title: '테스트',
          hour: 1,
          minute: 2,
          days: [1, 2, 5, 7],
          alarmVideoId: 'asdfasdf',
          contentVideoId: 'asdfasdf',
          timerDuration: 3000,
          exp: 1000,
          point: 100,
        };

        const res = await addRoutine(httpServer, accessToken, addRoutineParam);
        routineId = res.body.id;
      });
    });
  });

  describe('PATCH v1/routines/:id/done (exp가 1000, point가 100) ', () => {
    describe('try call with valid routineId', () => {
      it('{} should be thrown', async () => {
        const res = await doneRoutine(httpServer, accessToken, routineId);

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({});
      });
    });

    describe('GET v1/users/me', () => {
      it('didRoutinesInTotal, didRoutinesInMonth, point, exp should be increased', async () => {
        const res = await findUser(httpServer, accessToken);

        expect(res.statusCode).toBe(200);
        expect(res.body.didRoutinesInTotal).toEqual(2);
        expect(res.body.didRoutinesInMonth).toEqual(2);
        expect(res.body.level).not.toEqual(Level.bronze);
        expect(res.body.exp).toEqual(1000);
        expect(res.body.point).toEqual(100);
      });
    });
  });
});

/***
 * point, exp이 각각 0인 루틴 추가
 * 존재하지 않는 아이디로 doneRoutine 호출 시도
 * doneRoutine 호출
 * 유저 point, exp는 0이고 완료횟수가 늘었는지 확인
 * point, exp이 100, 1000인 루틴 추가
 * doneRoutine 호출
 * 유저 point, exp가 100, 1000이고 완료횟수가 늘었고 레벨이 변했는지 확인
 */
