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



describe('patchThumbnailCardnews e2e test', () => {
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
    await dbConnection.collection('images').deleteMany({});

    await app.close();
  });

  describe('Patch v1/routines/:id/thumbnail', () => {
    describe('before getting admin authorization...', () => {
      describe('try patch thumbnail', () => {
        describe('using valid mongoose object id with thumbnail', () => {
          it('UserNotAdminException should be thrown', async () => {
            const res = await patchThumbnail(httpServer, accessToken, 'test/e2e/routine/thumbnail.jpg', '123456789101112131415161');

            expect(res.statusCode).toBe(401);
          })
        })

        describe('using invalid mongoose object id with thumbnail', () => {
          it('InvalidMongoObjectIdException should be thrown', async () => {
            const res = await patchThumbnail(httpServer, accessToken, 'test/e2e/routine/thumbnail.jpg', '123');

            expect(res.statusCode).toBe(400);
          })
        })
      })
    })

    describe('after getting admin authorization...', () => {
      describe('try patch thumbnail', () => {
        describe('using wrong id with thumbnail', () => {
          it('RoutineNotFoundException should be thrown', async () => {
            await authorize(httpServer, accessToken)

            const res = await patchThumbnail(httpServer, accessToken, 'test/e2e/routine/thumbnail.jpg', '123456789101112131415161');

            expect(res.statusCode).toBe(404);
          })
        })

        describe('using invalid mongoose object id with thumbnail', () => {
          it('InvalidMongoObjectIdException should be thrown', async () => {
            const res = await patchThumbnail(httpServer, accessToken, 'test/e2e/routine/thumbnail.jpg', '123');

            expect(res.statusCode).toBe(400);
          })
        })
      })
    })
  })

  let routineId: string;

  describe('POST v1/routines', () => {
    it.todo('루틴 하나 생성')

  })

  describe('PATCH v1/routines/:id/thumbnail after add routine', () => {
    it.todo('유효하지 않은 mongoose object id')
    it.todo('thumbnail 수정')

  })

  describe('PATCH v1/routines/:id/cardnews after add routine', () => {
    it.todo('유효하지 않은 mongoose object id')
    it.todo('cardnews 수정')

  })

  describe('GET v1/routines/:id', () => {
    it.todo('유효하지 않은 mongoose object id')
    it.todo('find Routine')
    it.todo('routine에 thumbnail_id, routine_id 생겼나 확인')
    it.todo('키값 파일이름 확인')

  })

  describe('PATCH v1/routines/:id', () => {
    it.todo('루틴 수정')

  })

  describe('PATCH v1/routines/:id/thumbnail after modify routine', () => {
    it.todo('thumbnail 수정')

  })

  describe('PATCH v1/routines/:id/cardnews after modify routine', () => {
    it.todo('cardnews 수정')

  })

  describe('GET v1/routines/:id', () => {
    it.todo('find Routine')
    it.todo('바뀐 key 확인')
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

async function patchThumbnail(httpServer: any, accessToken: string, thumbnail: string, id: string) {
  return await request(httpServer)
    .patch(`/v1/routines/${id}/thumbnail`)
    .set('Authorization', `Bearer ${accessToken}`)
    .set('Content-Type', 'multipart/form-data')
    .attach('thumbnail', thumbnail);
}

async function patchCardnews(httpServer: any, accessToken: string, cardnews: string, id: string) {
  return await request(httpServer)
    .patch(`/v1/routines/${id}/cardnews`)
    .set('Authorization', `Bearer ${accessToken}`)
    .set('Content-Type', 'multipart/form-data')
    .attach('cardnews', cardnews);
}

/***
 * 어드민이 아님
 * 어드민 권한 부여
 * routine이 없음
 * 루틴 하나 생성
 * 유효하지 않은 mongoose object id
 * thumbnail 수정
 * cardnews 수정
 * findRoutine
 * 루틴 수정
 * thumbnail 수정
 * cardnews 수정
 * findRoutine
 */
