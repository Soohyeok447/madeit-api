import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { setTimeOut } from '../e2e-env';
import { AppModule } from '../../../src/ioc/AppModule';
import { DatabaseService } from 'src/ioc/DatabaseModule';
import { HttpExceptionFilter } from '../../../src/domain/common/filters/HttpExceptionFilter';
import { Connection } from 'mongoose';
import { SignUpRequestDto } from '../../../src/adapter/auth/sign-up/SignUpRequestDto';
import * as request from 'supertest';

describe('searchVideoByKeyword e2e test', () => {
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

    await app.close();
  });

  describe('GET v1/videos/:keyword', () => {
    describe('call Api without keyword', () => {
      it('InvalidKeywordException should be return', async () => {
        const res: request.Response = await request(httpServer)
          .get(encodeURI(`/v1/videos/?max=5`))
          .set('Authorization', `Bearer ${accessToken}`);

        expect(res.statusCode).toBe(400);
        expect(res.body.errorCode).toEqual(3);
      });
    });

    describe('call Api using invalid maxResults query parameter', () => {
      describe('maxResults = 0', () => {
        it('InvalidMaxResultsException should be return', async () => {
          const res: request.Response = await request(httpServer)
            .get(encodeURI(`/v1/videos/?max=0&keyword=프로미스나인`))
            .set('Authorization', `Bearer ${accessToken}`);

          expect(res.statusCode).toBe(400);
          expect(res.body.errorCode).toEqual(1);
        });
      });

      describe('maxResults = -1', () => {
        it('InvalidMaxResultsException should be return', async () => {
          const res: request.Response = await request(httpServer)
            .get(encodeURI(`/v1/videos/?max=-1&keyword=프로미스나인`))
            .set('Authorization', `Bearer ${accessToken}`);

          expect(res.statusCode).toBe(400);
          expect(res.body.errorCode).toEqual(1);
        });
      });
    });

    describe('try get using keyword "황희찬"', () => {
      it('video list should be return', async () => {
        const res: request.Response = await request(httpServer)
          .get(encodeURI(`/v1/videos/?max=5&keyword=황희찬`))
          .set('Authorization', `Bearer ${accessToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveLength(5);
        expect(res.body[0].title).toBeDefined();
        expect(res.body[0].channel).toBeDefined();
        expect(res.body[0].duration).toBeDefined();
        expect(res.body[0].thumbnail).toBeDefined();
        expect(res.body[0].videoId).toBeDefined();
      });
    });
  });
});

/***
 * 유효하지 않은 키워드로 검색시도 (null)
 * 유효하지 않은 maxLength로 검색시도 (-1, 0)
 * keyword로 검색
 * 잘 검색됐나 확인
 * maxResults의 length가 맞나 확인
 * response.body[0]에 videoId, title, duration, thumbnail, channel 프로퍼티가 전부 있나 확인
 */
