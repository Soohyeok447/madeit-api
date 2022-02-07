import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { setTimeOut } from '../e2e-env';
import { AppModule } from '../../../src/ioc/AppModule';
import * as request from 'supertest';
import { DatabaseService } from 'src/ioc/DatabaseModule';
import { SignInRequestDto } from 'src/adapter/auth/sign-in/SignInRequestDto';
import { AddRoutineRequestDto } from 'src/adapter/routine/add-routine/AddRoutineRequestDto';
import { Category } from 'src/domain/enums/Category';
import { RoutineType } from 'src/domain/enums/RoutineType';



describe('modifyRoutine e2e test', () => {
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

  describe('PATCH v1/routines/:id', () => {
    describe('before getting admin authorization...', () => {
      describe('try modify routine', () => {
        describe('using invalid mongoose object id', () => {
          it('InvalidMongoObjectIdException should be thrown', async () => {
            const modifyRoutineParam = {};

            const res = await modifyRoutine(httpServer, accessToken, modifyRoutineParam, 'asdf');

            expect(res.statusCode).toBe(400);
          })
        })

        describe('using not intact request body', () => {
          it('UserNotAdminException should be thrown', async () => {
            const modifyRoutineParam = {};

            const res = await modifyRoutine(httpServer, accessToken, modifyRoutineParam, '123456789101112131415161');

            expect(res.statusCode).toBe(401);
          })
        })

        describe('using intact request body', () => {
          it('UserNotAdminException should be thrown', async () => {
            const modifyRoutineParam = {
              name: "e2eTest",
              category: "Health",
              type: "Embeded",
              introductionScript: "e2eTest",
              motivation: "e2eTest",
              price: "0"
            };

            const res = await modifyRoutine(httpServer, accessToken, modifyRoutineParam, '123456789101112131415161');

            expect(res.statusCode).toBe(401);
          })
        })
      })
    })



    describe('after getting admin authorization...', () => {
      describe('try modify routine', () => {
        describe('using intact request body', () => {
          it('NotFoundRoutineException should be thrown', async () => {
            await authorize(httpServer, accessToken)

            const modifyRoutineParam = {
              name: "e2eTest",
              category: "Health",
              type: "Embeded",
              introductionScript: "e2eTest",
              motivation: "e2eTest",
              price: "0"
            };

            const res = await modifyRoutine(httpServer, accessToken, modifyRoutineParam, '111111111111111111111111');

            expect(res.statusCode).toBe(404);
          });
        })
      })

    })
  })

  let routineId: string;
  let name: string;

  describe('POST v1/routines', () => {
    it('add routine 2 times', async () => {
      await authorize(httpServer, accessToken)

      for (let i = 0; i < 2; i++) {
        let addRoutineParam: AddRoutineRequestDto = {
          name: `e2eTEST${i}`,
          category: Category.Health,
          type: RoutineType.Embeded,
          introductionScript: 'e2eTEST',
          motivation: 'e2eTEST',
          price: "0"
        }

        const res = await addRoutine(httpServer, accessToken, addRoutineParam);
        routineId = res.body.id;
        name = res.body.name;
      }
    })
  })

  describe('PATCH v1/routines/:id after add routines',() => {
    describe('try modify routine',()=>{
      describe('using request body that contains self duplicated routine name',() => {
        it('should return RoutineModel', async () => {
          await authorize(httpServer, accessToken)

          const modifyRoutineParam = {
            name,
            price: "0"
          }

          const res = await modifyRoutine(httpServer, accessToken, modifyRoutineParam, routineId)
        
          expect(res.statusCode).toBe(200);
          expect(res.body).toBeDefined();
        })
      })

      describe('using request body that contains duplicated routine name',() => {
        it('RoutineNameConflictException should be thrown', async () => {
          await authorize(httpServer, accessToken)

          const modifyRoutineParam = {
            name: 'e2eTEST0',
            price: "0"
          }

          const res = await modifyRoutine(httpServer, accessToken, modifyRoutineParam, routineId)

          expect(res.statusCode).toBe(409);
        })
      })

      describe('using request body that contains not duplicated routine name',() => {
        it('should return RoutineModel', async () => {
          await authorize(httpServer, accessToken)

          const modifyRoutineParam = {
            name: 'e2eTEST99999',
            price: "0"
          }

          const res = await modifyRoutine(httpServer, accessToken, modifyRoutineParam, routineId)
          
          expect(res.statusCode).toBe(200);
        })
      })
    })
  })

});


async function authorize(httpServer: any, accessToken: string) {
  await request(httpServer)
    .patch('/v1/e2e/user')
    .set('Authorization', `Bearer ${accessToken}`)
    .set('Accept', 'application/json');
}

async function signIn(httpServer: any, signInParam: SignInRequestDto) {
  return await request(httpServer)
    .post('/v1/e2e/auth/signin?provider=kakao&id=test')
    .set('Accept', 'application/json')
    .type('application/json')
    .send(signInParam);
}

async function modifyRoutine(httpServer: any, accessToken: string, modifyRoutineParam: any, id: string) {
  return await request(httpServer)
    .patch(`/v1/routines/${id}`)
    .set('Authorization', `Bearer ${accessToken}`)
    .set('Accept', 'application/json')
    .type('application/json')
    .send(modifyRoutineParam);
}

async function onboard(httpServer: any, accessToken: string, reqParam: { username: string; birth: string; job: string; gender: string; }) {
  return await request(httpServer)
    .post('/v1/users/onboard')
    .set('Authorization', `Bearer ${accessToken}`)
    .set('Accept', 'application/json')
    .type('application/json')
    .send(reqParam);
}

async function addRoutine(httpServer: any, accessToken: string, addRoutineParam: any) {
  return await request(httpServer)
    .post('/v1/routines')
    .set('Authorization', `Bearer ${accessToken}`)
    .set('Accept', 'application/json')
    .type('application/json')
    .send(addRoutineParam);
}

/***
 * 어드민이 아님
 * 유효하지 않은 mongoose object id
 * 유효한 mongoose object id인데 어드민권한이 없음
 * 온전한 request body인데 어드민 권한이 없음
 * 어드민 받음
 * 온전한 request body인데 루틴이 없음
 * 루틴 2개 추가
 * 현재 이름과 똑같은 이름을 가진 루틴으로 수정
 * 중복된 이름을 가진 루틴으로 수정
 * 다른 루틴이름을 가진 루틴 추가 시도
 */
