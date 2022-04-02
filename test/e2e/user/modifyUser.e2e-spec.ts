import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { setTimeOut } from '../e2e-env';
import { AppModule } from '../../../src/ioc/AppModule';
import { DatabaseService } from 'src/ioc/DatabaseModule';
import { HttpExceptionFilter } from '../../../src/domain/common/filters/HttpExceptionFilter';
import { Connection } from 'mongoose';
import { SignUpRequestDto } from '../../../src/adapter/auth/sign-up/SignUpRequestDto';
import * as request from 'supertest';
import { ModifyUserRequestDto } from '../../../src/adapter/user/modify-user/ModifyUserRequestDto';

describe('modify e2e test', () => {
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

  describe('PATCH v1/users/me', () => {
    describe('try onboard with invalid username', () => {
      it('modify failed', async () => {
        const reqParam: ModifyUserRequestDto = {
          username: '1',
          age: 33,
          goal: '3옥 레 질러보기',
          statusMessage: '목상태안좋음',
        };

        const res: request.Response = await request(httpServer)
          .patch('/v1/users/me')
          .set('Authorization', `Bearer ${accessToken}`)
          .set('Accept', 'application/json')
          .type('application/json')
          .send(reqParam);

        expect(res.statusCode).toBe(400);
        expect(res.body.errorCode).toEqual(1);
      });
    });

    describe('try onboard with invalid username', () => {
      it('modify failed', async () => {
        const reqParam: ModifyUserRequestDto = {
          username: '9자를 넘겨버리는 닉네임입니다~',
          age: 33,
          goal: '3옥 레 질러보기',
          statusMessage: '목상태안좋음',
        };

        const res: request.Response = await request(httpServer)
          .patch('/v1/users/me')
          .set('Authorization', `Bearer ${accessToken}`)
          .set('Accept', 'application/json')
          .type('application/json')
          .send(reqParam);

        expect(res.statusCode).toBe(400);
        expect(res.body.errorCode).toEqual(1);
      });
    });

    describe('try onboard with intact request body', () => {
      it('modify success', async () => {
        const reqParam: ModifyUserRequestDto = {
          username: 'test',
          age: 33,
          goal: '3옥 레 질러보기',
          statusMessage: '목상태안좋음',
        };

        const res: request.Response = await request(httpServer)
          .patch('/v1/users/me')
          .set('Authorization', `Bearer ${accessToken}`)
          .set('Accept', 'application/json')
          .type('application/json')
          .send(reqParam);

        expect(res.statusCode).toBe(200);
      });
    });
  });

  describe('PATCH v1/users/me/avatar', () => {
    describe('try patch avatar', () => {
      it('expect to patch avatar', async () => {
        const res: request.Response = await request(httpServer)
          .put('/v1/users/me/avatar')
          .set('Authorization', `Bearer ${accessToken}`)
          .set('Content-Type', 'multipart/form-data')
          .attach('avatar', 'test/e2e/user/avatar.jpg');

        expect(res.statusCode).toBe(200);
      });
    });

    describe('try check patched avatar', () => {
      it('avatar has been defined', async () => {
        const res: request.Response = await request(httpServer)
          .get('/v1/users/me')
          .set('Authorization', `Bearer ${accessToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.avatar).toBeDefined();
      });
    });
  });
});

/***
 * 유효하지 않은 username
유효한 request body로 modifying
아바타 patching
patching된 아바타 확인
 */
