import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { setTimeOut } from '../e2e-env';
import { AppModule } from '../../../src/ioc/AppModule';
import { DatabaseService } from 'src/ioc/DatabaseModule';
import { addRoutine } from '../request.index';
import { InitApp, initSignUp } from '../config';

describe('addRoutine e2e test', () => {
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

  describe('POST v1/routines', () => {
    describe('tyr add routine', () => {
      describe('using not intact request body', () => {
        it('BadRequestException should be thrown', async () => {
          const addRoutineParam = {};

          const res = await addRoutine(
            httpServer,
            accessToken,
            addRoutineParam,
          );

          expect(res.statusCode).toBe(400);
        });
      });

      describe('using invalid days [1,2,3,5,6,7,8,9,9,1,2,3]', () => {
        it('BadRequestException should be thrown', async () => {
          const addRoutineParam = {
            title: '타이틀',
            hour: 0,
            minute: 0,
            days: [1, 2, 3, 5, 6, 7, 8, 9, 9, 1, 2, 3],
          };

          const res = await addRoutine(
            httpServer,
            accessToken,
            addRoutineParam,
          );

          expect(res.statusCode).toBe(400);
        });
      });

      describe('using invalid days []', () => {
        it('BadRequestException should be thrown', async () => {
          const addRoutineParam = {
            title: '타이틀',
            hour: 0,
            minute: 0,
            days: [],
          };

          const res = await addRoutine(
            httpServer,
            accessToken,
            addRoutineParam,
          );

          expect(res.statusCode).toBe(400);
        });
      });

      describe('using invalid hour 24', () => {
        it('BadRequestException should be thrown', async () => {
          const addRoutineParam = {
            title: '타이틀',
            hour: 24,
            minute: 0,
            days: [1],
          };

          const res = await addRoutine(
            httpServer,
            accessToken,
            addRoutineParam,
          );

          expect(res.statusCode).toBe(400);
          expect(res.body.errorCode).toBe(1);
        });
      });

      describe('using invalid hour -1', () => {
        it('BadRequestException should be thrown', async () => {
          const addRoutineParam = {
            title: '타이틀',
            hour: -1,
            minute: 0,
            days: [1],
          };

          const res = await addRoutine(
            httpServer,
            accessToken,
            addRoutineParam,
          );

          expect(res.statusCode).toBe(400);
          expect(res.body.errorCode).toBe(1);
        });
      });

      describe('using invalid minute 60', () => {
        it('BadRequestException should be thrown', async () => {
          const addRoutineParam = {
            title: '타이틀',
            hour: 0,
            minute: 60,
            days: [1],
          };

          const res = await addRoutine(
            httpServer,
            accessToken,
            addRoutineParam,
          );

          expect(res.statusCode).toBe(400);
          expect(res.body.errorCode).toBe(1);
        });
      });

      describe('using valid request [1, 2, 3, 4, 5, 6, 7]', () => {
        describe('expect days to "매일"', () => {
          it('routine model should be return', async () => {
            const addRoutineParam = {
              title: '타이틀',
              hour: 11,
              minute: 11,
              days: [1, 2, 3, 4, 5, 6, 7],
            };

            const res = await addRoutine(
              httpServer,
              accessToken,
              addRoutineParam,
            );

            expect(res.statusCode).toBe(201);
            expect(res.body.days).toEqual([1, 2, 3, 4, 5, 6, 7]);
          });
        });

        describe('expect days to [6, 7]', () => {
          it('routine model should be return', async () => {
            const addRoutineParam = {
              title: '타이틀',
              hour: 11,
              minute: 12,
              days: [6, 7],
            };

            const res = await addRoutine(
              httpServer,
              accessToken,
              addRoutineParam,
            );

            expect(res.statusCode).toBe(201);
            expect(res.body.days).toEqual([6, 7]);
          });
        });

        describe('expect days to [1, 2, 3, 4, 5]', () => {
          it('routine model should be return', async () => {
            const addRoutineParam = {
              title: '타이틀',
              hour: 11,
              minute: 13,
              days: [1, 2, 3, 4, 5],
            };

            const res = await addRoutine(
              httpServer,
              accessToken,
              addRoutineParam,
            );

            expect(res.statusCode).toBe(201);
            expect(res.body.days).toEqual([1, 2, 3, 4, 5]);
          });
        });

        describe('expect days to [1, 2, 5 ,7]', () => {
          it('routine model should be return', async () => {
            const addRoutineParam = {
              title: '타이틀',
              hour: 11,
              minute: 14,
              days: [1, 2, 5, 7],
            };

            const res = await addRoutine(
              httpServer,
              accessToken,
              addRoutineParam,
            );

            expect(res.statusCode).toBe(201);
            expect(res.body.days).toEqual([1, 2, 5, 7]);
          });
        });
      });

      describe('try duplicated routine', () => {
        it('ConflictRoutineAlarmException should be thrown', async () => {
          const addRoutineParam = {
            title: '타이틀',
            hour: 11,
            minute: 14,
            days: [1, 2, 5, 7],
          };

          const res = await addRoutine(
            httpServer,
            accessToken,
            addRoutineParam,
          );

          expect(res.statusCode).toBe(409);
          expect(res.body.errorCode).toBe(2);
        });
      });

      describe('try add routine with full request body', () => {
        it('ConflictRoutineAlarmException should be thrown', async () => {
          const addRoutineParam = {
            title: '타이틀',
            hour: 11,
            minute: 15,
            days: [1, 2, 5, 7],
            alarmVideoId: 'asdfasdf',
            contentVideoId: 'asdfasdf',
            timerDuration: 3000,
          };

          const res = await addRoutine(
            httpServer,
            accessToken,
            addRoutineParam,
          );

          expect(res.statusCode).toBe(201);
          expect(res.body.alarmVideoId).toEqual('asdfasdf');
          expect(res.body.contentVideoId).toEqual('asdfasdf');
          expect(res.body.timerDuration).toEqual(3000);
        });
      });
    });
  });
});

/***
 * 완전치 않은 request body
 * 유효하지 않은 시간
 * 알람추가 성공
 * 중복된 알람 추가시도
 * 유튜브 id, 타이머 추가한 새로운 알람 성공
 */
