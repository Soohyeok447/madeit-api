import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { setTimeOut } from '../e2e-env';
import { AppModule } from '../../../src/ioc/AppModule';
import { DatabaseService } from 'src/ioc/DatabaseModule';
import { SignInRequestDto } from 'src/adapter/auth/sign-in/SignInRequestDto';
import {
  addRoutine,
  signIn,
  authorize,
  getRoutine,
  deleteRoutine,
} from '../request.index';
import { InitApp, initOnboarding } from '../config';

describe('deleteRoutine e2e test', () => {
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
      describe('using intact request body that contains not duplicated routine name', () => {
        it('should return an RoutineModel', async () => {
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
          routineId = res.body.id;

          expect(res.statusCode).toBe(201);
        });
      });
    });
  });

  describe('DELETE v1/routines/:id', () => {
    describe('try delete routine', () => {
      describe('using intact request body that contains not duplicated routine name', () => {
        it('should return an RoutineModel', async () => {
          const res = await deleteRoutine(httpServer, accessToken, routineId);

          expect(res.statusCode).toBe(200);
        });
      });
    });
  });

  describe('GET v1/routines/:id', () => {
    describe('try get an routine using id', () => {
      it('should return an RoutineModel', async () => {
        const res = await getRoutine(httpServer, accessToken, routineId);

        expect(res.statusCode).toBe(404);
      });
    });
  });
});

/***
 * 루틴 하나 생성
 * 루틴 삭제
 * 루틴 찾기
 */
