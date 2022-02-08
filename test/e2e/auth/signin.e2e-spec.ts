import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { collections, refreshtoken, setTimeOut } from '../e2e-env';
import { AppModule } from '../../../src/ioc/AppModule';
import * as request from 'supertest';
import { DatabaseService } from 'src/ioc/DatabaseModule';
import { SignInRequestDto } from 'src/adapter/auth/sign-in/SignInRequestDto';

describe('signin e2e test', () => {
  let app: INestApplication;
  let httpServer: any;
  let dbConnection;

  setTimeOut();

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

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
  });

  afterAll(async () => {
    await dbConnection.collection('users').deleteMany({});

    await app.close();
  });

  describe('POST v1/e2e/auth/signin?provider=kakao&id=test', () => {

    describe('try signin user with wrong 3rd party accessToken', () => {
      const reqParam: SignInRequestDto = {
        thirdPartyAccessToken: "wrongToken"
      }

      it('should throw unauthorization exception', async () => {
        const res = await request(httpServer)
          .post('/v1/e2e/auth/signin?provider=kakao&id=test')
          .set('Accept', 'application/json')
          .type('application/json')
          .send(reqParam)

        expect(res.statusCode).toBe(400);
      });

    })

    describe('try signin user with reliable 3rd party accessToken to issue api tokens', () => {
      const reqParam: SignInRequestDto = {
        thirdPartyAccessToken: 'reliableToken'
      }

      it('should return accessToken, refreshToken', async () => {
        const res = await request(httpServer)
          .post('/v1/e2e/auth/signin?provider=kakao&id=test')
          .set('Accept', 'application/json')
          .type('application/json')
          .send(reqParam)

        expect(res.statusCode).toBe(201);
        expect(res.body.accessToken).toBeDefined();
      });

    })
  })
});

/***
잘못된 토큰으로 signin 시도
유효한 토큰으로 signin 시도
 */