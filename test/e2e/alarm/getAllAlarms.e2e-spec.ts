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



describe('getAllAlarms e2e test', () => {
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

  describe('GET v1/alarms', () => {
    describe('try get empty alarms list', () => {
      it('should return []', async () => {
        const res = await getAllAlarms(httpServer, accessToken);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveLength(0);
        expect(res.body).toEqual([]);
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

  describe('POST v1/alarms two times', () => {
    it('add alarm', async () => {
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
    describe('try get alarms that have length 2', () => {
      it('should return alarms', async () => {
        const res = await getAllAlarms(httpServer, accessToken);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveLength(2);
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

async function getAllAlarms(httpServer: any, accessToken: string) {
  return await request(httpServer)
    .get('/v1/alarms')
    .set('Authorization', `Bearer ${accessToken}`)
}

/***
 * 빈 알람 리스트 get
 * 알람 2개 추가
 * 알람 2개 추가됐는지 확인
 */

