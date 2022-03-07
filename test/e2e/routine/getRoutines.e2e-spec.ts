import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { setTimeOut } from '../e2e-env';
import { AppModule } from '../../../src/ioc/AppModule';
import { DatabaseService } from 'src/ioc/DatabaseModule';
import { Category } from 'src/domain/enums/Category';
import { addRoutine, authorize, getAllRoutinesByCateogory, getRoutines } from '../request.index';
import { initSignUp } from '../config';

describe('getRoutines e2e test', () => {
  let app: INestApplication;
  let httpServer: any;
  let dbConnection;

  let accessToken: string;

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

    const res = await initSignUp(httpServer);

    accessToken = res.body.accessToken;
  });

  afterAll(async () => {
    await dbConnection.collection('users').deleteMany({});
    await dbConnection.collection('routines').deleteMany({});

    await app.close();
  });

  describe('GET v1/routines when there is no routine yet', () => {
    it('should return []', async () => {
      const res = await getRoutines(httpServer, accessToken)

      expect(res.body).toEqual([]);
      expect(res.statusCode).toBe(200);
    })
  })

  describe('POST v1/routines', () => {
    it('add routine 10 times', async () => {
      await authorize(httpServer, accessToken)

      for (let i = 0; i < 10; i++) {
        let addRoutineParam = {
          title: `e2eTEST${i}`,
          hour: 11,
          minute: i,
          days: [1, 2, 5, 7],
          alarmVideoId: 'asdfasdf',
          contentVideoId: 'asdfasdf',
          timerDuration: 3000
        };

        await addRoutine(httpServer, accessToken, addRoutineParam);
      }
    })
  })

  describe('GET v1/routines', () => {
    describe('get routines', () => {
      it('routines should be return ', async () => {
        const res = await getRoutines(httpServer, accessToken)

        expect(res.body).toHaveLength(10);
        expect(res.statusCode).toBe(200);
      })
    })
  })
});

/***
 * 루틴 아무것도 없을 때 찾기 시도
 * 루틴 10개 생성
 * 루틴 찾고 10개 있는지 확인
 * */
