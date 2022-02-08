import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { collections, refreshtoken, setTimeOut } from '../e2e-env';
import { AppModule } from '../../../src/ioc/AppModule';
import * as request from 'supertest';
import { DatabaseService } from 'src/ioc/DatabaseModule';
import { SignInRequestDto } from 'src/adapter/auth/sign-in/SignInRequestDto';



describe('modify e2e test', () => {
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

    await app.close();
  });


  describe('PATCH v1/users/me', () => {

    describe('try onboard with invalid username', () => {
      it('InvalidUsername exception should be thrown due to too long username', async () => {
        const reqParam = {
          username: "잠깐만날바라봐줘널따라가고있어난온힘을다해비출게",
          birth: "0000-00-00",
          job: "student",
          gender: "male"
        };

        const res = await request(httpServer)
          .patch('/v1/users/me')
          .set('Authorization', `Bearer ${accessToken}`)
          .set('Accept', 'application/json')
          .type('application/json')
          .send(reqParam)

        expect(res.statusCode).toBe(400);
      });

      it('InvalidUsername exception should be thrown due to too short username', async () => {
        const reqParam = {
          username: "헉",
          birth: "0000-00-00",
          job: "student",
          gender: "male"
        };

        const res = await request(httpServer)
          .patch('/v1/users/me')
          .set('Authorization', `Bearer ${accessToken}`)
          .set('Accept', 'application/json')
          .type('application/json')
          .send(reqParam)

        expect(res.statusCode).toBe(400);
      });
    })

    describe('try onboard with duplicated username', () => {
      it('ConflictUsernameException should be thrown', async () => {
        const reqParam = {
          username: "테스트",
          birth: "0000-00-00",
          job: "student",
          gender: "male"
        };

        await request(httpServer)
          .post('/v1/users/onboard')
          .set('Authorization', `Bearer ${accessToken}`)
          .set('Accept', 'application/json')
          .type('application/json')
          .send(reqParam)

        const res = await request(httpServer)
          .patch('/v1/users/me')
          .set('Authorization', `Bearer ${accessToken}`)
          .set('Accept', 'application/json')
          .type('application/json')
          .send(reqParam)

        expect(res.statusCode).toBe(409);
      });
    })

    describe('try onboard with intact request body', () => {
      it('modify success', async () => {
        const reqParam = {
          username: "test",
          birth: "0000-00-00",
          job: "student",
          gender: "male"
        };

        const res = await request(httpServer)
          .patch('/v1/users/me')
          .set('Authorization', `Bearer ${accessToken}`)
          .set('Accept', 'application/json')
          .type('application/json')
          .send(reqParam)

        expect(res.statusCode).toBe(200);
      });
    })

  })
});

/***
유효하지 않은 name으로 인한 exception
중복된 닉네임으로 인한 exception
유효한 request body로 modifying
 */
