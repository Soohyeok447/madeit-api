import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { setTimeOut } from '../e2e-env';
import { AppModule } from '../../../src/ioc/AppModule';
import { DatabaseService } from 'src/ioc/DatabaseModule';
import { Connection } from 'mongoose';
import * as request from 'supertest';
import { SignUpRequestDto } from '../../../src/adapter/auth/sign-up/SignUpRequestDto';
import { AddRoutineRequestDto } from '../../../src/adapter/routine/add-routine/AddRoutineRequestDto';

describe('getRoutines e2e test', () => {
  let app: INestApplication;
  let httpServer: any;
  let dbConnection: Connection;

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
    dbConnection = moduleRef
      .get<DatabaseService>(DatabaseService)
      .getConnection();
    httpServer = app.getHttpServer();

    const signUpParam: SignUpRequestDto = {
      thirdPartyAccessToken: 'asdfasdfasdfasdf',
      username: '테스트입니다',
      age: 1,
      goal: 'e2e테스트중',
      statusMessage: '모든게 잘 될거야',
    };

    const res: request.Response = await request(httpServer)
      .post(`/v1/e2e/auth/signup?provider=kakao`)
      .set('Accept', 'application/json')
      .type('application/json')
      .send(signUpParam);

    accessToken = res.body.accessToken;
  });

  afterAll(async () => {
    await dbConnection.collection('users').deleteMany({});
    await dbConnection.collection('routines').deleteMany({});

    await app.close();
  });

  describe('GET v1/routines when there is no routine yet', () => {
    it('should return []', async () => {
      const res: request.Response = await request(httpServer)
        .get(`/v1/routines`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.body).toEqual([]);
      expect(res.statusCode).toBe(200);
    });
  });

  describe('POST v1/routines', () => {
    it('add routine 10 times', async () => {
      let i: number;
      for (i = 0; i < 10; i++) {
        const addRoutineParam: AddRoutineRequestDto = {
          title: `e2eTEST${i}`,
          hour: 11,
          minute: i,
          days: [1, 2, 5, 7],
          alarmVideoId: 'asdfasdf',
          contentVideoId: 'asdfasdf',
          timerDuration: 3000,
        };

        await request(httpServer)
          .post('/v1/routines')
          .set('Authorization', `Bearer ${accessToken}`)
          .set('Accept', 'application/json')
          .type('application/json')
          .send(addRoutineParam);
      }
    });
  });

  describe('GET v1/routines', () => {
    describe('get routines', () => {
      it('routines should be return ', async () => {
        const res: request.Response = await request(httpServer)
          .get(`/v1/routines`)
          .set('Authorization', `Bearer ${accessToken}`);

        expect(res.body).toHaveLength(10);
        expect(res.statusCode).toBe(200);
      });
    });
  });
});

/***
 * 루틴 아무것도 없을 때 찾기 시도
 * 루틴 10개 생성
 * 루틴 찾고 10개 있는지 확인
 * */
