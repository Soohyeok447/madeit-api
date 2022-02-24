import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { setTimeOut } from '../e2e-env';
import { AppModule } from '../../../src/ioc/AppModule';
import { DatabaseService } from 'src/ioc/DatabaseModule';
import { SignInRequestDto } from 'src/adapter/auth/sign-in/SignInRequestDto';
import { onboard, addRoutine, signIn, authorize, getRoutineDetail } from '../request.index';
import { InitApp, initOnboarding } from '../config';


describe('getRoutineDetail e2e test', () => {
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

    dbConnection = moduleRef.get<DatabaseService>(DatabaseService).getConnection();
    httpServer = app.getHttpServer();

    const signInParam: SignInRequestDto = {
      thirdPartyAccessToken: 'asdfasdfasdfasdf'
    }

    const res = await signIn(httpServer, signInParam)

    accessToken = res.body.accessToken;
    refreshToken = res.body.refreshToken;

    await initOnboarding(httpServer, accessToken);
  });

  afterAll(async () => {
    await dbConnection.collection('users').deleteMany({});
    await dbConnection.collection('routines').deleteMany({});

    await app.close();
  });

  describe('GET v1/routines/:id (unknown)', () => {
    describe('try get an routine ', () => {
      describe('using invalid mongoose object id', () => {
        it('InvalidMongoObjectIdException should be thrown', async () => {
          const res = await getRoutineDetail(httpServer, accessToken, 'wrongId');

          expect(res.statusCode).toBe(400);
        })
      })

      describe('using nonexistent id', () => {
        it('RoutineNotFoundException should be thrown', async () => {
          const res = await getRoutineDetail(httpServer, accessToken, '123456789101112131415161');

          expect(res.statusCode).toBe(404);
        })
      })
    })
  })

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
            timerDuration: 3000
          };

          const res = await addRoutine(httpServer, accessToken, addRoutineParam);
          routineId = res.body.id;

          expect(res.statusCode).toBe(201);
        });
      })
    })
  })


  describe('GET v1/routines/:id', () => {
    describe('try get an routine using id', () => {
      it('should return an RoutineModel', async () => {
        const res = await getRoutineDetail(httpServer, accessToken, routineId);

        expect(res.statusCode).toBe(200);
        expect(res.body).toBeDefined();
      })
    })
  })
});



/***
 * 유효하지 않은 몽구스 id로 get 시도
 * 없는 루틴 id로 get 시도
 * 루틴 하나 생성
 * 루틴 찾기
 */
