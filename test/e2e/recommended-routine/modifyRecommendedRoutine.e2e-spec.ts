import { INestApplication, ValidationPipe } from '@nestjs/common';
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
  modifyRecommendedRoutine,
} from '../request.index';
import { InitApp } from '../config';
import { Category } from '../../../src/domain/enums/Category';
import { FixedField } from '../../../src/domain/enums/FixedField';

describe('modifyRecommendedRoutine e2e test', () => {
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

    await app.close();
  });

  let routineId: string;

  describe('POST v1/recommended-routines', () => {
    describe('try add an recommended routine', () => {
      it('success to add recommded routine', async () => {
        await authorize(httpServer, accessToken);

        const addRoutineParam = {
          title: '타이틀',
          introduction: '소개글',
          category: Category.Health,
          fixedFields: [FixedField.Title, FixedField.ContentVideoId],
          hour: 3,
          minute: 30,
        };

        await addRecommendedRoutine(httpServer, accessToken, addRoutineParam);

        const addRoutineParam2 = {
          title: '중복되지 않은 타이틀',
          introduction: '소개글',
          category: Category.Health,
          fixedFields: [FixedField.Title, FixedField.ContentVideoId],
          hour: 3,
          minute: 30,
        };

        const res = await addRecommendedRoutine(
          httpServer,
          accessToken,
          addRoutineParam2,
        );

        routineId = res.body.id;
      });
    });
  });

  describe('PATCH v1/recommended-routines/:id', () => {
    describe('try modify an recommended routine', () => {
      describe('using invalid request body', () => {
        it('BadRequestException should be return', async () => {
          const modifyRoutineParam = {
            category: '잘못된 카테고리',
          };

          const res = await modifyRecommendedRoutine(
            httpServer,
            accessToken,
            modifyRoutineParam,
            routineId,
          );

          expect(res.statusCode).toBe(400);
        });
      });

      describe('using valid request body that include duplicated title', () => {
        it('ConflictTitleException should be return', async () => {
          const modifyRoutineParam = {
            title: '타이틀',
            introduction: '소개글',
            category: Category.Health,
          };

          const res = await modifyRecommendedRoutine(
            httpServer,
            accessToken,
            modifyRoutineParam,
            routineId,
          );

          expect(res.statusCode).toBe(409);
        });
      });

      describe('using valid request body', () => {
        it('recommended routine model should be return', async () => {
          await authorize(httpServer, accessToken);

          const modifyRoutineParam = {
            title: '이거 괜찮습니다~~',
            introduction: '수정된 소개글',
            category: Category.Health,
          };

          const res = await modifyRecommendedRoutine(
            httpServer,
            accessToken,
            modifyRoutineParam,
            routineId,
          );

          expect(res.statusCode).toBe(200);
          expect(res.body.introduction).toEqual('수정된 소개글');
          expect(res.body.cardnews).toEqual(null);
        });
      });
    });
  });
});

/***
 * 추천 루틴 2개 추가 -> 그 중 1개의 routineId 저장
 * 잘못된 form (category, fixedFields)
 * 중복된 이름으로 수정시도
 * 수정 성공
 * 수정된 것 확인
 */
