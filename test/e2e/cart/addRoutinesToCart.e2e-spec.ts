import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { setTimeOut } from '../e2e-env';
import { AppModule } from '../../../src/ioc/AppModule';
import { DatabaseService } from 'src/ioc/DatabaseModule';
import { SignInRequestDto } from 'src/adapter/auth/sign-in/SignInRequestDto';
import { Category } from 'src/domain/enums/Category';
import { RoutineType } from 'src/domain/enums/RoutineType';
import { onboard, signIn, authorize, addRoutinesToCart, addRecommendedRoutine } from '../request.index';
import { InitApp } from '../config';

describe('addRoutinesToCart e2e test', () => {
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
    await dbConnection.collection('recommended-routines').deleteMany({});
    await dbConnection.collection('carts').deleteMany({});

    await app.close();
  });

  let firstRoutineId: string;
  let secondRoutineId: string;


  describe('POST v1/carts', () => {
    describe('try add routine to cart', () => {
      describe('using invalid mongo object id', () => {
        it('BadRequestException should be thrown', async () => {
          const addRoutineToCartParams = {
            routineId: '123'
          }

          const res = await addRoutinesToCart(httpServer, accessToken, addRoutineToCartParams);

          expect(res.statusCode).toBe(400);
        })
      })

      describe('using unintact request body', () => {
        it('BadRequestException should be thrown', async () => {
          const addRoutineToCartParams = {
            wrongKey: '123456789101112131415161'
          }

          const res = await addRoutinesToCart(httpServer, accessToken, addRoutineToCartParams);

          expect(res.statusCode).toBe(400);
        })
      })

      describe('using nonexistent routine id', () => {
        it('RoutineNotFoundException should be thrown', async () => {
          const addRoutineToCartParams = {
            routineId: '123456789101112131415161'
          }

          const res = await addRoutinesToCart(httpServer, accessToken, addRoutineToCartParams);

          expect(res.statusCode).toBe(404);
        })
      })
    })
  })

  describe('POST v1/routines', () => {
    it('add routine two times', async () => {
      await authorize(httpServer, accessToken);

      let addRoutineParam1 = {
        title: `e2eTEST1`,
        category: Category.Health,
        introduction: 'e2eTEST',
      }

      let addRoutineParam2 = {
        title: `e2eTEST2`,
        category: Category.Health,
        introduction: 'e2eTEST',
      }

      const res1 = await addRecommendedRoutine(httpServer, accessToken, addRoutineParam1);
      const res2 = await addRecommendedRoutine(httpServer, accessToken, addRoutineParam2);
    
      firstRoutineId = res1.body.id
      secondRoutineId = res2.body.id
    });
  })

  describe('POST v1/carts after add routines', () => {
    describe('try add routine to cart', () => {
      describe('using intact request body include valid existent routineId', () => {
        it('success to add routine to cart', async () => {
          const addRoutineToCartParams = {
            routineId: firstRoutineId
          }

          const res = await addRoutinesToCart(httpServer, accessToken, addRoutineToCartParams)
          expect(res.statusCode).toBe(201);
        })
      })

      describe('using intact request body that include duplicated routineId from cart', () => {
        it('CartConflictException should be thrown', async () => {
          const addRoutineToCartParams = {
            routineId: firstRoutineId
          }

          const res = await addRoutinesToCart(httpServer, accessToken, addRoutineToCartParams)
        
          expect(res.statusCode).toBe(409);
        })
      })

      describe('using intact request body that include not duplicated routineId from cart', () => {
        it('success to add routine to cart', async () => {
          const addRoutineToCartParams = {
            routineId: secondRoutineId
          }

          const res = await addRoutinesToCart(httpServer, accessToken, addRoutineToCartParams)
        
          expect(res.statusCode).toBe(201);
        })
      })
    })
  })
});



/***
 * 유효하지 않은 routineId
 * 온전하지 않은 request body
 * 없는 루틴 추가 시도
 * 루틴 2개 추가
 * 장바구니에 루틴 추가
 * 이미 장바구니에 존재중인 루틴 추가시도
 * 장바구니에 없는 루틴 추가 시도
 */
