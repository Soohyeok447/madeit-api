import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { setTimeOut } from '../e2e-env';
import { AppModule } from '../../../src/ioc/AppModule';
import { DatabaseService } from 'src/ioc/DatabaseModule';
import { SignInRequestDto } from 'src/adapter/auth/sign-in/SignInRequestDto';
import {
  onboard,
  signIn,
  addRecommendedRoutine,
  authorize,
  getRecommendedRoutine,
} from '../request.index';
import { InitApp } from '../config';
import { Category } from '../../../src/domain/enums/Category';
import { FixedField } from '../../../src/domain/enums/FixedField';

describe('getRecommendedRoutine e2e test', () => {
  let app: INestApplication;
  let httpServer: any;
  let dbConnection;

  let accessToken: string;

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

    const onboardParam = {
      username: '테스트',
      birth: '0000-00-00',
      job: 'student',
      gender: 'male',
    };

    await onboard(httpServer, accessToken, onboardParam);
  });

  afterAll(async () => {
    await dbConnection.collection('users').deleteMany({});
    await dbConnection.collection('recommended-routines').deleteMany({});
    await dbConnection.collection('images').deleteMany({});

    await app.close();
  });

  describe('GET v1/recommended-routines/:id before add an recommended routine', () => {
    it('RecommendedRoutineNotFoundException should be thrown', async () => {
      await authorize(httpServer, accessToken);

      const res = await getRecommendedRoutine(
        httpServer,
        accessToken,
        '621a6ec7e4490f5c4f189409',
      );

      expect(res.statusCode).toBe(404);
    });
  });

  let routineId: string;

  describe('POST v1/recommended-routines', () => {
    it('add an recommended routine', async () => {
      await authorize(httpServer, accessToken);

      const addRoutineParam = {
        title: '테스트',
        introduction: '소개글',
        category: Category.Health,
        fixedFields: [FixedField.Title, FixedField.ContentVideoId],
        hour: 3,
        minute: 30,
      };

      const res = await addRecommendedRoutine(
        httpServer,
        accessToken,
        addRoutineParam,
      );
      routineId = res.body.id;
    });
  });

  describe('GET v1/recommended-routines/:id after add an recommended routine', () => {
    it('RecommendedRoutineModel should be thrown', async () => {
      await authorize(httpServer, accessToken);

      const res = await getRecommendedRoutine(
        httpServer,
        accessToken,
        routineId,
      );

      expect(res.statusCode).toBe(200);
      expect(res.body.title).toEqual('테스트');
    });
  });
});

/***
 * 없는 routineId로 찾기 시도
 * 추천 루틴 하나 생성
 * get 성공
 */
