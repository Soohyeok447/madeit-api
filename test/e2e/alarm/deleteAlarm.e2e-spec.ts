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



describe('deleteAlarm e2e test', () => {
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

  describe('DELETE v1/alarms/:id', () => {
    describe('try delete an alarm', () => {
      describe('using lnvalid mongo object id', () => {
        it('InvalidMongoObjectIdException should be thrown', async () => {
          const res = await deleteAlarm(httpServer, accessToken, 'invalidId');

          expect(res.statusCode).toBe(400);
        })
      })

      describe('using unexistence alarm id', () => {
        it('AlarmNotFoundException should be thrown', async () => {
          const res = await deleteAlarm(httpServer, accessToken, '61f28d9b1ead82c6e3db36c8');

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

  describe('GET v1/alarms after add alarms', () => {
    it('get an alarm id', async () => {
      const res = await getAllAlarms(httpServer, accessToken);

      anAlarmId = res.body[0].alarmId;
    })
  })

  describe('DELETE v1/alarms/:id after add alarms', () => {
    describe('try delete an alarm', () => {
      describe('using valid existence alarm id', () => {
        it('success to delete an alarm', async () => {
          const res = await deleteAlarm(httpServer, accessToken, anAlarmId);

          expect(res.statusCode).toBe(200);
        })
      })
    })
  })

  describe('GET v1/alarms after delete an alarm', () => {
    it('should alarms length to be 1', async () => {
      const res = await getAllAlarms(httpServer, accessToken);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveLength(1);
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

async function deleteAlarm(httpServer: any, accessToken: string, id: string) {
  return await request(httpServer)
    .delete(`/v1/alarms/${id}`)
    .set('Authorization', `Bearer ${accessToken}`)
}

/***
 * 유효하지 않은 mongo object id 로 삭제 시도
 * 없는 알람 id로 삭제시도
 * 알람 2개 추가
 * 알람 리스트 get 후 알람 id 얻기
 * 알람 삭제
 * 알람 삭제됐는지 확인
 */

