import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { setTimeOut } from '../e2e-env';
import { AppModule } from '../../../src/ioc/AppModule';
import { DatabaseService } from 'src/ioc/DatabaseModule';
import { SignInRequestDto } from 'src/adapter/auth/sign-in/SignInRequestDto';
import { addRoutine, signIn, getRoutine } from '../request.index';
import { InitApp, initOnboarding } from '../config';
import { getRoutines, toggleActivation } from './request';

describe('toggleActivation e2e test', () => {
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

    app = await InitApp(app, moduleRef);

    dbConnection = moduleRef
      .get<DatabaseService>(DatabaseService)
      .getConnection();
    httpServer = app.getHttpServer();

    const signInParam: SignInRequestDto = {
      thirdPartyAccessToken: 'asdfasdfasdfasdf',
    };

    const res = await signIn(httpServer, signInParam);

    accessToken = res.body.accessToken;
    refreshToken = res.body.refreshToken;

    await initOnboarding(httpServer, accessToken);
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

  describe('PATCH v1/routines/toggle/:id ', () => {
    describe('try patch activation field', () => {
      it('should be succeed patching', async () => {
        const res = await toggleActivation(httpServer, accessToken, routineId);

        expect(res.statusCode).toBe(204);
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
 * activation toggle
 * toggle 됐나 확인
 */
