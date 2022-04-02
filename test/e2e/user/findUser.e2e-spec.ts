import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { setTimeOut } from '../e2e-env';
import { AppModule } from '../../../src/ioc/AppModule';
import { DatabaseService } from 'src/ioc/DatabaseModule';
import { HttpExceptionFilter } from '../../../src/domain/common/filters/HttpExceptionFilter';
import * as request from 'supertest';
import { Connection } from 'mongoose';
import { SignUpRequestDto } from '../../../src/adapter/auth/sign-up/SignUpRequestDto';

describe('findUser e2e test', () => {
  let app: INestApplication;
  let httpServer: any;
  let dbConnection: Connection;

  let accessToken: string;

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

    app.useGlobalFilters(new HttpExceptionFilter());

    await app.init();
    dbConnection = moduleRef
      .get<DatabaseService>(DatabaseService)
      .getConnection();
    httpServer = app.getHttpServer();

    const signUpParam: SignUpRequestDto = {
      thirdPartyAccessToken: 'asdfasdfasdfasdf',
      username: '테스트입니다',
      age: 1,
      goal: 'e2e테스트중',
      statusMessage: '모든게 잘 될거야',
    };

    //TODO fixit
    const res: request.Response = await request(httpServer)
      .post(`/v1/e2e/auth/signup?provider=kakao`)
      .set('Accept', 'application/json')
      .type('application/json')
      .send(signUpParam);

    accessToken = res.body.accessToken;
  });

  afterAll(async () => {
    await dbConnection.collection('users').deleteMany({});
    await dbConnection.collection('images').deleteMany({});

    await app.close();
  });

  describe('GET v1/users/me', () => {
    describe('try find user after onboard', () => {
      // const reqParam: SignUpRequestDto = {
      //   username: '테스트',
      //   age: 33,
      //   goal: '공중 3회전 돌기',
      //   statusMessage: '피곤한상태',
      //   thirdPartyAccessToken: 'accessToken',
      // };

      describe('before patchAvatar', () => {
        it('should return an UserModel', async () => {
          // //TODO fixit
          // await request(httpServer)
          //   .post(`/v1/e2e/auth/signup?provider=kakao`)
          //   .set('Accept', 'application/json')
          //   .type('application/json')
          //   .send(reqParam);

          const res: request.Response = await request(httpServer)
            .get('/v1/users/me')
            .set('Authorization', `Bearer ${accessToken}`);

          expect(res.statusCode).toBe(200);
        });
      });

      describe('after patchAvatar', () => {
        it('should return an UserModel', async () => {
          await request(httpServer)
            .put('/v1/users/me/avatar')
            .set('Authorization', `Bearer ${accessToken}`)
            .set('Content-Type', 'multipart/form-data')
            .attach('avatar', 'test/e2e/user/avatar.jpg');

          const res: request.Response = await request(httpServer)
            .get('/v1/users/me')
            .set('Authorization', `Bearer ${accessToken}`);

          expect(res.statusCode).toBe(200);
          expect(res.body.avatar).toBeDefined();
        });
      });
    });
  });
});

/***
 * patchAvatar전 findUser 호출
 * patchAvatar후 findUser 호출
 */
