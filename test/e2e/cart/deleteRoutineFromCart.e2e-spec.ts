import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { setTimeOut } from '../e2e-env';
import { AppModule } from '../../../src/ioc/AppModule';
import { DatabaseService } from 'src/ioc/DatabaseModule';
import { SignInRequestDto } from 'src/adapter/auth/sign-in/SignInRequestDto';
import { Category } from 'src/domain/enums/Category';
import { RoutineType } from 'src/domain/enums/RoutineType';
import { onboard, signIn, authorize, addRoutinesToCart, getcarts, deleteRoutineFromCart, addRecommendedRoutine } from '../request.index';
import { InitApp } from '../config';


describe('deleteRoutineFromCart e2e test', () => {
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

  let firstCartsId: string;
  let secondCartsId: string;


  describe('DELETE v1/carts/:id', () => {
    describe('try delete routine from empty cart', () => {
      describe('using nonexistence routineId', () => {
        it('CartNotFoundException should be thrown', async () => {
          const res = await deleteRoutineFromCart(httpServer, accessToken, '123456789101112131415161');

          expect(res.statusCode).toBe(404);
        })
      })

      describe('using invlid mongo object id', () => {
        it('InvalidMongoObjectIdException should be thrown', async () => {
          const res = await deleteRoutineFromCart(httpServer, accessToken, '123');

          expect(res.statusCode).toBe(400);
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
    
      firstRoutineId = res1.body.id;
      secondRoutineId = res2.body.id;
    });
  })

  describe('POST v1/carts', () => {
    it('add routine to cart two times', async () => {
      const routineId1 = {
        routineId: firstRoutineId
      }

      const routineId2 = {
        routineId: secondRoutineId
      }

      await addRoutinesToCart(httpServer, accessToken, routineId1)
      await addRoutinesToCart(httpServer, accessToken, routineId2)
    })
  })

  describe('GET v1/carts', () => {
    it('get carts that length is 2', async () => {
      const res = await getcarts(httpServer, accessToken);

      firstCartsId = res.body[0].cartId;
      secondCartsId = res.body[1].cartId;

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveLength(2);
    })
  })

  describe('DELETE v1/carts/:id after put routine into cart', () => {
    describe('try delete routine from cart', () => {
      describe('using nonexistence routineId', () => {
        it('CartNotFoundException should be thrown', async () => {
          const res = await deleteRoutineFromCart(httpServer, accessToken, '123456789101112131415161');

          expect(res.statusCode).toBe(404);
        })
      })

      describe('using valid routineId', () => {
        it('success to delete', async () => {
          const res = await deleteRoutineFromCart(httpServer, accessToken, firstCartsId);

          expect(res.statusCode).toBe(204);
        })
      })
    })
  })

  describe('GET v1/carts after delete once', () => {
    it('get carts that length is 1', async () => {
      const res = await getcarts(httpServer, accessToken);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveLength(1);
    })
  })

  describe('DELETE v1/carts/:id after delete once', () => {
    describe('try delete routine from cart', () => {
      describe('using valid routineId', () => {
        it('success to delete', async () => {
          const res = await deleteRoutineFromCart(httpServer, accessToken, secondCartsId);

          expect(res.statusCode).toBe(204);
        })
      })
    })
  })

  describe('GET v1/carts after delete two times', () => {
    it('get carts that length is 0', async () => {
      const res = await getcarts(httpServer, accessToken);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveLength(0);
    })
  })
});

/***
 * 빈 장바구니에서 없는 id로 삭제 시도
 * 빈 장바구니에서 유효하지 않은 mongo object id로 삭제 시도
 * 루틴 2개 추가
 * 장바구니 get
 * 없는 id로 삭제 시도
 * 장바구니에서 삭제
 * 장바구니 get
 * 장바구니에서 삭제
 * 장바구니 get
 */
