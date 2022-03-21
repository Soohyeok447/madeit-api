import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { setTimeOut } from '../e2e-env';
import { AppModule } from '../../../src/ioc/AppModule';
import { DatabaseService } from 'src/ioc/DatabaseModule';
import { addRoutine, modifyRoutine } from '../request.index';
import { InitApp, initSignUp } from '../config';

describe('modifyRoutine e2e test', () => {
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

  describe('PATCH v1/routines/:id', () => {
    let routineId: string;

    describe('add routine', () => {
      it('success to add routine', async () => {
        const addRoutineParamForTestDuplication = {
          title: '테스트',
          hour: 15,
          minute: 30,
          days: [1, 2, 3],
          alarmVideoId: 'asdfasdf',
          contentVideoId: 'asdfasdf',
          timerDuration: 3000,
        };

        await addRoutine(
          httpServer,
          accessToken,
          addRoutineParamForTestDuplication,
        );

        const addRoutineParam = {
          title: '테스트',
          hour: 15,
          minute: 50,
          days: [1, 2, 3],
          alarmVideoId: 'asdfasdf',
          contentVideoId: 'asdfasdf',
          timerDuration: 3000,
        };

        const res = await addRoutine(httpServer, accessToken, addRoutineParam);

        routineId = res.body.id;

        expect(res.statusCode).toBe(201);
      });
    });

    describe('try modify routine', () => {
      describe('using invalid days [1,2,3,5,6,7,8,9,9,1,2,3]', () => {
        it('BadRequestException should be thrown', async () => {
          const modifyRoutineParam = {
            title: '타이틀',
            hour: 0,
            minute: 0,
            days: [1, 2, 3, 5, 6, 7, 8, 9, 9, 1, 2, 3],
          };

          const res = await modifyRoutine(
            httpServer,
            accessToken,
            modifyRoutineParam,
            routineId,
          );

          expect(res.statusCode).toBe(400);
        });
      });

      describe('using invalid days []', () => {
        it('BadRequestException should be thrown', async () => {
          const modifyRoutineParam = {
            title: '타이틀',
            hour: 0,
            minute: 0,
            days: [],
          };

          const res = await modifyRoutine(
            httpServer,
            accessToken,
            modifyRoutineParam,
            routineId,
          );

          expect(res.statusCode).toBe(400);
        });
      });

      describe('using invalid hour 24', () => {
        it('BadRequestException should be thrown', async () => {
          const modifyRoutineParam = {
            title: '타이틀',
            hour: 24,
            minute: 0,
            days: [1],
          };

          const res = await modifyRoutine(
            httpServer,
            accessToken,
            modifyRoutineParam,
            routineId,
          );

          expect(res.statusCode).toBe(400);
          expect(res.body.errorCode).toBe(1);
        });
      });

      describe('using invalid hour -1', () => {
        it('BadRequestException should be thrown', async () => {
          const modifyRoutineParam = {
            title: '타이틀',
            hour: -1,
            minute: 0,
            days: [1],
          };

          const res = await modifyRoutine(
            httpServer,
            accessToken,
            modifyRoutineParam,
            routineId,
          );

          expect(res.statusCode).toBe(400);
          expect(res.body.errorCode).toBe(1);
        });
      });

      describe('using invalid minute 60', () => {
        it('BadRequestException should be thrown', async () => {
          const modifyRoutineParam = {
            title: '타이틀',
            hour: 0,
            minute: 60,
            days: [1],
          };

          const res = await modifyRoutine(
            httpServer,
            accessToken,
            modifyRoutineParam,
            routineId,
          );

          expect(res.statusCode).toBe(400);
          expect(res.body.errorCode).toBe(1);
        });
      });

      describe('using invalid minute 60', () => {
        it('BadRequestException should be thrown', async () => {
          const modifyRoutineParam = {
            title: '타이틀',
            hour: 0,
            minute: 60,
            days: [1],
          };

          const res = await modifyRoutine(
            httpServer,
            accessToken,
            modifyRoutineParam,
            routineId,
          );

          expect(res.statusCode).toBe(400);
          expect(res.body.errorCode).toBe(1);
        });
      });

      describe('try duplicated routine', () => {
        it('ConflictRoutineAlarmException should be thrown', async () => {
          const modifyRoutineParam = {
            title: '타이틀',
            hour: 15,
            minute: 30,
            days: [1, 2, 3],
          };

          const res = await modifyRoutine(
            httpServer,
            accessToken,
            modifyRoutineParam,
            routineId,
          );

          expect(res.statusCode).toBe(409);
          expect(res.body.errorCode).toBe(2);
        });
      });

      describe('using valid request form without youtube id, timerDuration field', () => {
        it('ConflictRoutineAlarmException should be thrown', async () => {
          const modifyRoutineParam = {
            title: '타이틀',
            hour: 11,
            minute: 11,
            days: [6, 7],
          };

          const res = await modifyRoutine(
            httpServer,
            accessToken,
            modifyRoutineParam,
            routineId,
          );

          expect(res.statusCode).toBe(200);
          expect(res.body.alarmVideoId).toEqual('asdfasdf');
          expect(res.body.contentVideoId).toEqual('asdfasdf');
          expect(res.body.timerDuration).toEqual(3000);
        });
      });
    });
  });
});

/***
 * 유튜브 id, 타이머 추가한 알람추가 성공
 * 유효하지 않은 시간
 * 중복된 알람 추가시도
 * 유튜브 id, 타이머 없는 알람으로 수정 성공
 */
