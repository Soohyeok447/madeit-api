import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { setTimeOut } from '../e2e-env';
import { AppModule } from '../../../src/ioc/AppModule';
import { DatabaseService } from 'src/ioc/DatabaseModule';
import { SignInRequestDto } from 'src/adapter/auth/sign-in/SignInRequestDto';
import { AddRoutineRequestDto } from 'src/adapter/routine/add-routine/AddRoutineRequestDto';
import { Category } from 'src/domain/enums/Category';
import { RoutineType } from 'src/domain/enums/RoutineType';
import { onboard, addRoutine, signIn, authorize, getAllAlarms, getAlarm, addAlarm } from '../request.index';


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
            days: [
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
            days: [
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
              days: [
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
              days: [
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
              days: [
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
              days: [
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
              days: [
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
            days: [
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
              days: [
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
            days: [
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


/***
 * 완전치 않은 request body
 * 유효하지 않은 mongo object id 로 추가시도
 * 없는 루틴을 추가시도
 * 유효하지 않은 시간
 * 루틴 2개 추가
 * 알람추가 성공
 * 중복된 알람 추가시도
 */

