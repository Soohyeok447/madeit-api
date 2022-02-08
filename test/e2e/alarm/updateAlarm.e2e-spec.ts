import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { setTimeOut } from '../e2e-env';
import { AppModule } from '../../../src/ioc/AppModule';
import * as request from 'supertest';
import { DatabaseService } from 'src/ioc/DatabaseModule';
import { SignInRequestDto } from 'src/adapter/auth/sign-in/SignInRequestDto';
import { AddRoutineToCartRequestDto } from 'src/adapter/cart/add-routine-to-cart/AddRoutineToCartRequestDto';
import { AddRoutineRequestDto } from 'src/adapter/routine/add-routine/AddRoutineRequestDto';
import { Category } from 'src/domain/enums/Category';
import { RoutineType } from 'src/domain/enums/RoutineType';



describe('updateAlarm e2e test', () => {
  let app: INestApplication;
  let httpServer: any;
  let dbConnection;

  let accessToken: string;
  let refreshToken: string;

  setTimeOut();

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    await app.init();
    dbConnection = moduleRef.get<DatabaseService>(DatabaseService).getConnection();
    httpServer = app.getHttpServer();

    const signInParam: SignInRequestDto = {
      thirdPartyAccessToken: 'asdfasdfasdfasdf'
    }

    const res = await signIn(httpServer, signInParam)

    accessToken = res.body.accessToken;
    refreshToken = res.body.refreshToken;

    const onboardParam = {
      username: "테스트",
      birth: "0000-00-00",
      job: "student",
      gender: "male"
    };

    await onboard(httpServer, accessToken, onboardParam);

  });

  afterAll(async () => {
    await dbConnection.collection('users').deleteMany({});
    await dbConnection.collection('routines').deleteMany({});
    await dbConnection.collection('alarms').deleteMany({});

    await app.close();
  });

  let firstRoutineId: string;
  let secondRoutineId: string;
  let anAlarmId: string;
  let originTime: string;

  describe('PUT v1/alarms/:id', () => {
    describe('try modify an alarm', () => {
      describe('using invalid mongo object id', () => {
        it('InvalidMongoObjectIdException should be thrown', async () => {
          const updateAlarmParams = {
            label: "TestAlarm",
            time: "0820",
            day: [
              "Monday",
              "Tuesday"
            ],
            routineId: "61f28d9b1ead82c6e3db36c8"
          }
          const res = await updateAlarm(httpServer, accessToken, 'invalidId', updateAlarmParams);

          expect(res.statusCode).toBe(400);
        })
      })

      describe('using unexistence alarm id', () => {
        it('AlarmNotFoundException should be thrown', async () => {
          const updateAlarmParams = {
            label: "TestAlarm",
            time: "0820",
            day: [
              "Monday",
              "Tuesday"
            ],
            routineId: "61f28d9b1ead82c6e3db36c8"
          }

          const res = await updateAlarm(httpServer, accessToken, '61f28d9b1ead82c6e3db36c8', updateAlarmParams);

          expect(res.statusCode).toBe(404);
        })
      })
    })
  })

  describe('POST v1/routines', () => {
    it('add routine two times', async () => {
      await authorize(httpServer, accessToken);

      for (let i = 0; i < 2; i++) {
        let addRoutineParam: AddRoutineRequestDto = {
          name: `e2eTEST${i}`,
          category: Category.Health,
          type: RoutineType.Embeded,
          introductionScript: 'e2eTEST',
          motivation: 'e2eTEST',
          price: "0"
        }

        const res = await addRoutine(httpServer, accessToken, addRoutineParam);

        if (i === 0) {
          firstRoutineId = res.body.id;
        } else {
          secondRoutineId = res.body.id;
        }
      }
    })
  })

  describe('POST v1/alarms', () => {
    it('add alarm two times', async () => {
      const addAlarmParams = {
        label: "TestAlarm",
        time: "1700",
        day: [
          "Monday",
          "Tuesday"
        ],
        routineId: secondRoutineId
      }

      const addAlarmParams2 = {
        label: "TestAlarm2",
        time: "1800",
        day: [
          "Monday",
          "Tuesday"
        ],
        routineId: secondRoutineId
      }

      await addAlarm(httpServer, accessToken, addAlarmParams)
      await addAlarm(httpServer, accessToken, addAlarmParams2)
    })
  })

  describe('GET v1/alarms to get an alarm id', () => {
    it('get alarm id', async () => {
      const res = await getAllAlarms(httpServer, accessToken);

      anAlarmId = res.body[0].alarmId;
    })
  })

  describe('GET v1/alarms/:id to get origin time before update', () => {
    it('get origin time before update', async () => {
      const res = await getAlarm(httpServer, accessToken, anAlarmId);

      originTime = res.body.time;
    })
  })

  describe('PUT v1/alarms:/id after add an alarm to update', () => {
    describe('try update an alarm', () => {
      describe('using unexistence routine id', () => {
        it('RoutineNotFoundException should be thrown', async () => {
          const updateAlarmParams = {
            label: "TestAlarm",
            time: "0820",
            day: [
              "Monday",
              "Tuesday"
            ],
            routineId: "61f28d9b1ead82c6e3db36c8"
          }

          const res = await updateAlarm(httpServer, accessToken, anAlarmId, updateAlarmParams);

          expect(res.statusCode).toBe(404);
        })
      })

      describe('using invalid time', () => {
        describe('time is 0000', () => {
          it('InvalidTimeException should be thrown', async () => {
            const updateAlarmParams = {
              label: "TestAlarm",
              time: "0000",
              day: [
                "Monday",
                "Tuesday"
              ],
              routineId: firstRoutineId
            }

            const res = await updateAlarm(httpServer, accessToken, anAlarmId, updateAlarmParams)

            expect(res.statusCode).toBe(400);
          })
        })

        describe('time is 2401', () => {
          it('InvalidTimeException should be thrown', async () => {
            const updateAlarmParams = {
              label: "TestAlarm",
              time: "2401",
              day: [
                "Monday",
                "Tuesday"
              ],
              routineId: secondRoutineId
            }

            const res = await updateAlarm(httpServer, accessToken, anAlarmId, updateAlarmParams)

            expect(res.statusCode).toBe(400);
          })
        })

        describe('time is 300', () => {
          it('InvalidTimeException should be thrown', async () => {
            const updateAlarmParams = {
              label: "TestAlarm",
              time: "300",
              day: [
                "Monday",
                "Tuesday"
              ],
              routineId: firstRoutineId
            }

            const res = await updateAlarm(httpServer, accessToken, anAlarmId, updateAlarmParams)

            expect(res.statusCode).toBe(400);
          })
        })

        describe('time is -1', () => {
          it('InvalidTimeException should be thrown', async () => {
            const updateAlarmParams = {
              label: "TestAlarm",
              time: "-1",
              day: [
                "Monday",
                "Tuesday"
              ],
              routineId: firstRoutineId
            }

            const res = await updateAlarm(httpServer, accessToken, anAlarmId, updateAlarmParams)

            expect(res.statusCode).toBe(400);
          })
        })

        describe('time is 1360', () => {
          it('InvalidTimeException should be thrown', async () => {
            const updateAlarmParams = {
              label: "TestAlarm",
              time: "1360",
              day: [
                "Monday",
                "Tuesday"
              ],
              routineId: firstRoutineId
            }

            const res = await updateAlarm(httpServer, accessToken, anAlarmId, updateAlarmParams)

            expect(res.statusCode).toBe(400);
          })
        })
      })

      describe('using valid request body that included self duplicated time', () => {
        it('success to modify alarm', async () => {
          const updateAlarmParams = {
            label: "TestAlarm",
            time: "1700",
            day: [
              "Monday",
              "Tuesday"
            ],
            routineId: secondRoutineId
          }

          const res = await updateAlarm(httpServer, accessToken, anAlarmId, updateAlarmParams)

          expect(res.statusCode).toBe(200);
        })
      })

      describe('using valid request body that not duplicated time', () => {
        it('success to modify alarm', async () => {
          const updateAlarmParams = {
            label: "TestAlarm",
            time: "2000",
            day: [
              "Monday",
              "Tuesday"
            ],
            routineId: secondRoutineId
          }

          const res = await updateAlarm(httpServer, accessToken, anAlarmId, updateAlarmParams)

          expect(res.statusCode).toBe(200);
        })
      })

      describe('using valid request body that included duplicated alarm', () => {
        it('ConflictAlarmException should be thrown', async () => {
          const updateAlarmParams = {
            label: "TestAlarm",
            time: "1800",
            day: [
              "Monday",
            ],
            routineId: secondRoutineId
          }

          const res = await updateAlarm(httpServer, accessToken, anAlarmId, updateAlarmParams)

          expect(res.statusCode).toBe(409);
        })

      })
    })
  })

  describe('GET v1/alarms to get an alarm id after update alarm', () => {
    it('get alarmId', async () => {
      const res = await getAllAlarms(httpServer, accessToken);

      anAlarmId = res.body[0].alarmId;
    })
  })

  describe('GET v1/alarms/:id to check it\'s fixed', () => {
    it('should not equal updated time to origin time', async () => {
      const res = await getAlarm(httpServer, accessToken, anAlarmId);

      expect(res.body.time).not.toEqual(originTime);
    })
  })
});


async function authorize(httpServer: any, accessToken: string) {
  await request(httpServer)
    .patch('/v1/e2e/user')
    .set('Authorization', `Bearer ${accessToken}`)
    .set('Accept', 'application/json');
}

async function signIn(httpServer: any, signInParam: SignInRequestDto) {
  return await request(httpServer)
    .post('/v1/e2e/auth/signin?provider=kakao&id=test')
    .set('Accept', 'application/json')
    .type('application/json')
    .send(signInParam);
}

async function addRoutine(httpServer: any, accessToken: string, addRoutineParam: any) {
  return await request(httpServer)
    .post('/v1/routines')
    .set('Authorization', `Bearer ${accessToken}`)
    .set('Accept', 'application/json')
    .type('application/json')
    .send(addRoutineParam);
}

async function onboard(httpServer: any, accessToken: string, reqParam: { username: string; birth: string; job: string; gender: string; }) {
  return await request(httpServer)
    .post('/v1/users/onboard')
    .set('Authorization', `Bearer ${accessToken}`)
    .set('Accept', 'application/json')
    .type('application/json')
    .send(reqParam);
}

async function addAlarm(httpServer: any, accessToken: string, addAlarmParams) {
  return await request(httpServer)
    .post('/v1/alarms')
    .set('Authorization', `Bearer ${accessToken}`)
    .set('Accept', 'application/json')
    .type('application/json')
    .send(addAlarmParams);
}

async function getAllAlarms(httpServer: any, accessToken: string) {
  return await request(httpServer)
    .get('/v1/alarms')
    .set('Authorization', `Bearer ${accessToken}`)
}

async function updateAlarm(httpServer: any, accessToken: string, id: string, updateAlarmParams) {
  return await request(httpServer)
    .put(`/v1/alarms/${id}`)
    .set('Authorization', `Bearer ${accessToken}`)
    .set('Accept', 'application/json')
    .type('application/json')
    .send(updateAlarmParams);
}

async function getAlarm(httpServer: any, accessToken: string, id: string) {
  return await request(httpServer)
    .get(`/v1/alarms/${id}`)
    .set('Authorization', `Bearer ${accessToken}`)
}

/***
 * 유효하지 않은 mongo object id로 수정시도
 * 없는 알람 id로 수정시도
 * 루틴 추가
 * 알람추가
 * 유효하지 않은 시간으로 수정시도
 * 유효한 request body로 알람수정
 * 중복된 알람으로 수정시도
 * 알람 find해서 잘 바뀌었나 테스트
 */

