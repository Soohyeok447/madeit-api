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



describe('addAlarm e2e test', () => {
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

  describe('POST v1/alarms', () => {
    describe('try add alarm', () => {
      describe('using unintact request body', () => {
        it('BadRequestException should be thrown', async () => {
          const addAlarmParams = {
            label: "TestAlarm",
            wrongKey: 'test'
          }

          const res = await addAlarm(httpServer, accessToken, addAlarmParams)

          expect(res.statusCode).toBe(400);
        })
      })

      describe('using invalid mongo object id', () => {
        it('InvalidMongoObjectIdException should be thrown', async () => {
          const addAlarmParams = {
            label: "TestAlarm",
            time: "0820",
            day: [
              "Monday",
              "Tuesday"
            ],
            routineId: "123"
          }

          const res = await addAlarm(httpServer, accessToken, addAlarmParams)

          expect(res.statusCode).toBe(400);
        })
      })

      describe('using nonexistent routine id', () => {
        it('RoutineNotFoundException should be thrown', async () => {
          const addAlarmParams = {
            label: "TestAlarm",
            time: "0820",
            day: [
              "Monday",
              "Tuesday"
            ],
            routineId: "61f28d9b1ead82c6e3db36c8"
          }

          const res = await addAlarm(httpServer, accessToken, addAlarmParams)

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

  describe('POST v1/alarms after add routines', () => {
    describe('try add alarm', () => {
      describe('using invalid time', () => {
        describe('time is 0000', () => {
          it('InvalidTimeException should be thrown', async () => {
            const addAlarmParams = {
              label: "TestAlarm",
              time: "0000",
              day: [
                "Monday",
                "Tuesday"
              ],
              routineId: secondRoutineId
            }

            const res = await addAlarm(httpServer, accessToken, addAlarmParams)

            expect(res.statusCode).toBe(400);
          })
        })

        describe('time is 2401', () => {
          it('InvalidTimeException should be thrown', async () => {
            const addAlarmParams = {
              label: "TestAlarm",
              time: "2401",
              day: [
                "Monday",
                "Tuesday"
              ],
              routineId: secondRoutineId
            }

            const res = await addAlarm(httpServer, accessToken, addAlarmParams)

            expect(res.statusCode).toBe(400);
          })
        })

        describe('time is 300', () => {
          it('InvalidTimeException should be thrown', async () => {
            const addAlarmParams = {
              label: "TestAlarm",
              time: "300",
              day: [
                "Monday",
                "Tuesday"
              ],
              routineId: firstRoutineId
            }

            const res = await addAlarm(httpServer, accessToken, addAlarmParams)

            expect(res.statusCode).toBe(400);
          })
        })

        describe('time is -1', () => {
          it('InvalidTimeException should be thrown', async () => {
            const addAlarmParams = {
              label: "TestAlarm",
              time: "-1",
              day: [
                "Monday",
                "Tuesday"
              ],
              routineId: firstRoutineId
            }

            const res = await addAlarm(httpServer, accessToken, addAlarmParams)

            expect(res.statusCode).toBe(400);
          })
        })

        describe('time is 1360', () => {
          it('InvalidTimeException should be thrown', async () => {
            const addAlarmParams = {
              label: "TestAlarm",
              time: "1360",
              day: [
                "Monday",
                "Tuesday"
              ],
              routineId: firstRoutineId
            }

            const res = await addAlarm(httpServer, accessToken, addAlarmParams)

            expect(res.statusCode).toBe(400);
          })
        })
      })

      describe('using valid request body', () => {
        it('success to add alarm', async () => {
          const addAlarmParams = {
            label: "TestAlarm",
            time: "0820",
            day: [
              "Monday",
              "Tuesday"
            ],
            routineId: secondRoutineId
          }

          const res = await addAlarm(httpServer, accessToken, addAlarmParams)

          expect(res.statusCode).toBe(201);
        })
      })

      describe('using valid request body that included duplicated alarm', () => {
        describe('Monday is duplicated', () => {
          it('ConflictAlarmException should be thrown', async () => {
            const addAlarmParams = {
              label: "TestAlarm",
              time: "0820",
              day: [
                "Monday",
              ],
              routineId: secondRoutineId
            }

            const res = await addAlarm(httpServer, accessToken, addAlarmParams)

            expect(res.statusCode).toBe(409);
          })
        })
      })


      describe('using valid request body that included not duplicated alarm', () => {
        it('success to add alarm', async () => {
          const addAlarmParams = {
            label: "TestAlarm",
            time: "1700",
            day: [
              "Monday",
              "Tuesday"
            ],
            routineId: secondRoutineId
          }

          const res = await addAlarm(httpServer, accessToken, addAlarmParams)

          expect(res.statusCode).toBe(201);
        })
      })
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

/***
 * 완전치 않은 request body
 * 유효하지 않은 mongo object id 로 추가시도
 * 없는 루틴을 추가시도
 * 유효하지 않은 시간
 * 루틴 2개 추가
 * 알람추가 성공
 * 중복된 알람 추가시도
 */

