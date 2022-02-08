import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { collections, refreshtoken, setTimeOut } from '../e2e-env';
import { AppModule } from '../../../src/ioc/AppModule';
import * as request from 'supertest';
import { DatabaseService } from 'src/ioc/DatabaseModule';
import { SignInRequestDto } from 'src/adapter/auth/sign-in/SignInRequestDto';
import path from 'path';



describe('findUser e2e test', () => {
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

    const reqParam: SignInRequestDto = {
      thirdPartyAccessToken: 'asdfasdfasdfasdf'
    }

    const res = await request(httpServer)
      .post('/v1/e2e/auth/signin?provider=kakao&id=test')
      .set('Accept', 'application/json')
      .type('application/json')
      .send(reqParam)

    accessToken = res.body.accessToken;
    refreshToken = res.body.refreshToken;

  });

  afterAll(async () => {
    await dbConnection.collection('users').deleteMany({});
    await dbConnection.collection('images').deleteMany({});

    await app.close();
  });


  describe('GET v1/users/me', () => {
    describe('try find user before onboard', () => {
      it('UserNotRegisteredException should be thrown', async () => {
        const res = await findUser(httpServer, accessToken);

        expect(res.statusCode).toBe(403);
      });
    })

    describe('try find user after onboard', () => {
      const reqParam = {
        username: "테스트",
        birth: "0000-00-00",
        job: "student",
        gender: "male"
      };


      describe('before patchAvatar', () => {
        it('should return an UserModel', async () => {
          await onboard(httpServer, accessToken, reqParam);

          const res = await findUser(httpServer, accessToken);

          expect(res.statusCode).toBe(200);
        });
      })

      describe('after patchAvatar', () => {
        it('should return an UserModel', async () => {
          await onboard(httpServer, accessToken, reqParam);

          await patchAvatar(httpServer, accessToken, 'test/e2e/user/avatar.jpg');

          const res = await findUser(httpServer, accessToken);
          
          expect(res.statusCode).toBe(200);
          expect(res.body.avatar).toBeDefined();
          
          await patchAvatar(httpServer, accessToken, null);

          const deleteResult = await findUser(httpServer, accessToken);
          expect(deleteResult.body.avatar).toBeUndefined();
        });
      })
    })
  })
});


async function findUser(httpServer: any, accessToken: string) {
  return await request(httpServer)
    .get('/v1/users/me')
    .set('Authorization', `Bearer ${accessToken}`);
}

async function patchAvatar(httpServer: any, accessToken: string, avatar: string) {
  if(!avatar){
    return await request(httpServer)
    .patch('/v1/users/me/avatar')
    .set('Authorization', `Bearer ${accessToken}`)
  }

  return await request(httpServer)
    .patch('/v1/users/me/avatar')
    .set('Authorization', `Bearer ${accessToken}`)
    .set('Content-Type', 'multipart/form-data')
    .attach('avatar', avatar);
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
onboard전 findUser 호출
onboard후 findUser 호출
patchAvatar전 findUser 호출
patchAvatar후 findUser 호출
 */
