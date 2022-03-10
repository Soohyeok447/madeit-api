import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { setTimeOut } from '../e2e-env';
import { AppModule } from '../../../src/ioc/AppModule';
import { DatabaseService } from 'src/ioc/DatabaseModule';
import { HttpExceptionFilter } from '../../../src/domain/common/filters/HttpExceptionFilter';
import { searchVideoByKeyword } from './request';
import { initSignUp } from '../config';

describe('searchVideoByKeyword e2e test', () => {
  let app: INestApplication;
  let httpServer: any;
  let dbConnection;

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

    const res = await initSignUp(httpServer);

    accessToken = res.body.accessToken;
  });

  afterAll(async () => {
    await dbConnection.collection('users').deleteMany({});

    await app.close();
  });

  describe('GET v1/videos/:keyword', () => {
    describe('call Api without keyword', () => {
      it('InvalidKeywordException should be return', async () => {
        const res = await searchVideoByKeyword(
          httpServer,
          accessToken,
          null,
          5,
        );

        expect(res.statusCode).toBe(400);
        expect(res.body.errorCode).toEqual(3);
      });
    });

    describe('call Api using invalid maxResults query parameter', () => {
      describe('maxResults = 0', () => {
        it('InvalidMaxResultsException should be return', async () => {
          const res = await searchVideoByKeyword(
            httpServer,
            accessToken,
            '프로미스나인',
            0,
          );

          expect(res.statusCode).toBe(400);
          expect(res.body.errorCode).toEqual(1);
        });
      });

      describe('maxResults = -1', () => {
        it('InvalidMaxResultsException should be return', async () => {
          const res = await searchVideoByKeyword(
            httpServer,
            accessToken,
            '프로미스나인',
            -1,
          );

          expect(res.statusCode).toBe(400);
          expect(res.body.errorCode).toEqual(1);
        });
      });
    });

    describe('try get using keyword "황희찬"', () => {
      it('video list should be return', async () => {
        const res = await searchVideoByKeyword(
          httpServer,
          accessToken,
          '황희찬',
          5,
        );

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
