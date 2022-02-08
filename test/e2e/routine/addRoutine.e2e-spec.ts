import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { setTimeOut } from '../e2e-env';
import { AppModule } from '../../../src/ioc/AppModule';
import * as request from 'supertest';
import { DatabaseService } from 'src/ioc/DatabaseModule';
import { SignInRequestDto } from 'src/adapter/auth/sign-in/SignInRequestDto';



describe('addRoutine e2e test', () => {
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

  describe('POST v1/routines', () => {

    describe('before getting admin authorization...', () => {
      describe('tyr add routine', () => {
        describe('using not intact request body', () => {
          it('BadRequestException should be thrown', async () => {
            const addRoutineParam = {};

            const res = await addRoutine(httpServer, accessToken, addRoutineParam);

            expect(res.statusCode).toBe(400);
          });
        })

        describe('using intact request body', () => {
          it('UserNotAdminException should be thrown', async () => {
            const addRoutineParam = {
              name: "e2eTest",
              category: "Health",
              type: "Embeded",
              introductionScript: "e2eTest",
              motivation: "e2eTest",
              price: "0"
            };

            const res = await addRoutine(httpServer, accessToken, addRoutineParam);

            expect(res.statusCode).toBe(401);
          });
        })

      })
    })


    describe('after getting admin authorization...', () => {
      describe('try add routine', () => {
        describe('using not intact request body', () => {
          it('BadRequestException should be thrown', async () => {
            await authorize(httpServer, accessToken);

            const addRoutineParam = {};

            const res = await addRoutine(httpServer, accessToken, addRoutineParam);

            expect(res.statusCode).toBe(400);
          });
        })

        describe('using intact request body', () => {
          it('should return an RoutineModel', async () => {
            await authorize(httpServer, accessToken);

            const addRoutineParam = {
              name: "e2eTest",
              category: "Health",
              type: "Embeded",
              introductionScript: "e2eTest",
              motivation: "e2eTest",
              price: "0"
            };

            const res = await addRoutine(httpServer, accessToken, addRoutineParam);

            expect(res.statusCode).toBe(201);
          });
        })

        describe('using intact request body that contains duplicated routine name', () => {
          it('RoutineNameConflictException should be thrown', async () => {
            await authorize(httpServer, accessToken);

            const addRoutineParam = {
              name: "e2eTest",
              category: "Health",
              type: "Embeded",
              introductionScript: "e2eTest",
              motivation: "e2eTest",
              price: "0"
            };

            const res = await addRoutine(httpServer, accessToken, addRoutineParam);

            expect(res.statusCode).toBe(409);
          });
        })

        describe('using intact request body that contains not duplicated routine name', () => {
          it('should return an RoutineModel', async () => {
            await authorize(httpServer, accessToken);

            const addRoutineParam = {
              name: "e2eTestTestTest",
              category: "Health",
              type: "Embeded",
              introductionScript: "e2eTest",
              motivation: "e2eTest",
              price: "0"
            };

            const res = await addRoutine(httpServer, accessToken, addRoutineParam);

            expect(res.statusCode).toBe(201);
          });
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

async function addRoutine(httpServer: any, accessToken: string, addRoutineParam: any) {
  return await request(httpServer)
    .post('/v1/routines')
    .set('Authorization', `Bearer ${accessToken}`)
    .set('Accept', 'application/json')
    .type('application/json')
    .send(addRoutineParam);
}

async function onboard(httpServer: any, accessToken: string, reqParam: { username: string; birth: string; job: string; gender: string; }) {
  return await request(httpServer)
    .post('/v1/users/onboard')
    .set('Authorization', `Bearer ${accessToken}`)
    .set('Accept', 'application/json')
    .type('application/json')
    .send(reqParam);
}

/***
 * 어드민이 아님
 * 온전치 못한 request body
 * 루틴 추가
 * 중복된 이름을 가진 루틴 추가 시도
 * 다른 루틴이름을 가진 루틴 추가 시도
 */
