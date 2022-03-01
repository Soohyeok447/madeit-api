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
} from '../request.index';
import { InitApp } from '../config';
import { Category } from '../../../src/domain/enums/Category';
import { FixedField } from '../../../src/domain/enums/FixedField';

describe('addRecommendedRoutine e2e test', () => {
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

  describe('POST v1/recommended-routines', () => {
    describe('try add an recommended routine', () => {
      describe('using not intact request body', () => {
        it('BadRequestException should be return', async () => {
          const addRoutineParam = {
            title: '타이틀',
          };

          const res = await addRecommendedRoutine(
            httpServer,
            accessToken,
            addRoutineParam,
          );

          expect(res.statusCode).toBe(400);
        });
      });

      describe('using valid request body', () => {
        describe('before get authorization', () => {
          it('UserNotAdminException should be return', async () => {
            const addRoutineParam = {
              title: '타이틀',
              introduction: '소개글',
              category: Category.Health,
            };

            const res = await addRecommendedRoutine(
              httpServer,
              accessToken,
              addRoutineParam,
            );

            expect(res.statusCode).toBe(401);
          });
        });
      });

      describe('using valid request body after get authorization', () => {
        it('recommended routine model should be return', async () => {
          await authorize(httpServer, accessToken);

          const addRoutineParam = {
            title: '타이틀',
            introduction: '소개글',
            category: Category.Health,
          };

          const res = await addRecommendedRoutine(
            httpServer,
            accessToken,
            addRoutineParam,
          );

          expect(res.statusCode).toBe(201);
        });
      });

      describe('try add recommended routine that has duplicated title ', () => {
        it('TitleConflictException should be thrown', async () => {
          await authorize(httpServer, accessToken);

          const addRoutineParam = {
            title: '타이틀',
            introduction: '소개글',
            category: Category.Health,
          };

          const res = await addRecommendedRoutine(
            httpServer,
            accessToken,
            addRoutineParam,
          );

          expect(res.statusCode).toBe(409);
          expect(res.body.errorCode).toBe(1);
        });
      });

      describe('using valid request body without duplicated title', () => {
        it('recommended routine model should be return', async () => {
          await authorize(httpServer, accessToken);

          const addRoutineParam = {
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
            addRoutineParam,
          );

          expect(res.statusCode).toBe(201);
          expect(res.body.fixedFields).toEqual([
            FixedField.Title,
            FixedField.ContentVideoId,
          ]);
          expect(res.body.hour).toEqual(3);
          expect(res.body.minute).toEqual(30);
        });
      });
    });
  });
});

/***
 * 완전치 않은 request body
 * 어드민이 아님
 * 추천 루틴 추가
 * 중복된 이름으로 추가시도
 * 새 추천 루틴 추가
 */
