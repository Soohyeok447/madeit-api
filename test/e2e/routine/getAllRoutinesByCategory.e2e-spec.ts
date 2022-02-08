import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { setTimeOut } from '../e2e-env';
import { AppModule } from '../../../src/ioc/AppModule';
import { DatabaseService } from 'src/ioc/DatabaseModule';
import { SignInRequestDto } from 'src/adapter/auth/sign-in/SignInRequestDto';
import { Category } from 'src/domain/enums/Category';
import { AddRoutineRequestDto } from 'src/adapter/routine/add-routine/AddRoutineRequestDto';
import { RoutineType } from 'src/domain/enums/RoutineType';
import { onboard, addRoutine, signIn, authorize, getAllRoutinesByCateogory } from '../request.index';


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

    await app.close();
  });

  describe('GET v1/routines when there is no routine yet', () => {
    it('should return []', async () => {
      const res = await getAllRoutinesByCateogory(httpServer, accessToken)

      expect(res.body.data).toEqual([]);
      expect(res.statusCode).toBe(200);
    })
  })

  describe('POST v1/routines', () => {
    it('add routine 10 times', async () => {
      await authorize(httpServer, accessToken)

      for (let i = 0; i < 10; i++) {
        let addRoutineParam: AddRoutineRequestDto = {
          name: `e2eTEST${i}`,
          category: Category.Health,
          type: RoutineType.Embeded,
          introductionScript: 'e2eTEST',
          motivation: 'e2eTEST',
          price: "0"
        }

        await addRoutine(httpServer, accessToken, addRoutineParam);
      }
    })
  })

  describe('GET v1/routines', () => {
    describe('get routines', () => {
      describe('without query params', () => {
        it('should return []', async () => {
          const res = await getAllRoutinesByCateogory(httpServer, accessToken)

          expect(res.body.data).toEqual([]);
          expect(res.body.hasMore).toEqual(false);
          expect(res.body.nextCursor).toEqual(null);
          expect(res.statusCode).toBe(200);
        })
      })

      describe('with query params', () => {
        describe('only category query', () => {
          it('should return routines', async () => {
            const res = await getAllRoutinesByCateogory(httpServer, accessToken, null, Category.Health)

            expect(res.body.data).toHaveLength(10);
            expect(res.statusCode).toBe(200);
          })
        })

        let nextCursor: string;

        describe('only size query', () => {
          it('should return []', async () => {
            const res = await getAllRoutinesByCateogory(httpServer, accessToken, 3, null)

            expect(res.body.hasMore).toEqual(false);
            expect(res.body.data).toEqual([]);
            expect(res.statusCode).toBe(200);
          })
        })

        describe('size, category together', () => {
          it('should return routines', async () => {
            const res = await getAllRoutinesByCateogory(httpServer, accessToken, 3, Category.Health)

            nextCursor = res.body.nextCursor;

            expect(res.body.hasMore).toEqual(true);
            expect(res.body.data).toBeDefined();
            expect(res.statusCode).toBe(200);
          })
        })

        describe('size, category together', () => {
          describe('using paging', () => {
            it('should return routines', async () => {
              const res = await getAllRoutinesByCateogory(httpServer, accessToken, 7, Category.Health, nextCursor)

              nextCursor = res.body.nextCursor;

              expect(res.body.hasMore).toEqual(true);
              expect(res.body.data).toBeDefined();
              expect(res.statusCode).toBe(200);
            })

            it('should return []', async () => {
              const res = await getAllRoutinesByCateogory(httpServer, accessToken, 10, Category.Health, nextCursor)

              expect(res.body.hasMore).toEqual(false);
              expect(res.body.data).toEqual([]);
              expect(res.statusCode).toBe(200);
            })
          })
        })

      })
    })
  })
});

/***
 * 루틴 아무것도 없을 때 찾기 시도
 * 루틴 10개 생성
 * 쿼리 파라미터 없이 루틴 찾기
 * 루틴 유효한 카테고리를 페이징 없이 찾기
 * 루틴 유효한 카테고리를 next값을 써서 페이징 하고 찾기
 * 루틴 유효한 카테고리를 이상한 next값을 써서 페이징 하고 찾기
 * hasMore속성이 false인데 더 찾아보려고 시도
 */
