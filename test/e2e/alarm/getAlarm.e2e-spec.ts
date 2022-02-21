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

describe('getAlarm e2e test', () => {
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
  let anAlarmId: string

  describe('GET v1/alarm/:id', () => {
    describe('try get an alarm', () => {
      describe('using invalid mongo object id', () => {
        it('InvalidMongoObjectIdException should be thrown', async () => {
          const res = await getAlarm(httpServer, accessToken, '123');

          expect(res.statusCode).toBe(400);
        })
      })

      describe('using unexistence alarm id', () => {
        it('AlarmNotFoundException should be thrown', async () => {
          const res = await getAlarm(httpServer, accessToken, '123456789101112131415161');

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

  describe('POST v1/alarms two times', () => {
    it('add alarm', async () => {
      const addAlarmParams = {
        label: "TestAlarm",
        time: "1700",
        days: [
          "Monday",
          "Tuesday"
        ],
        routineId: secondRoutineId
      }

      const addAlarmParams2 = {
        label: "TestAlarm2",
        time: "1800",
        days: [
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
      it('should return []', async () => {
        const res = await getAllAlarms(httpServer, accessToken);

        anAlarmId = res.body[0].alarmId;

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveLength(2);
      })
    })
  })

  describe('GET v1/alarm/:id after add alarms', () => {
    describe('try get alarm', () => {
      it('should return alarmModel', async () => {
        const res = await getAlarm(httpServer, accessToken, anAlarmId);

        expect(res.statusCode).toBe(200);
        expect(res.body.time).toBeDefined();
      })
    })
  })
});

/***
 * 유효하지 않은 mongo object id로 get
 * 없는 알람 id로 get
 * 루틴 추가
 * 루틴 리스트 get 후 알람 id 얻기
 * 얻은 알람 id로 get alarm
 */