import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { setTimeOut } from '../e2e-env';
import { AppModule } from '../../../src/ioc/AppModule';
import { DatabaseService } from 'src/ioc/DatabaseModule';
import { SignInRequestDto } from 'src/adapter/auth/sign-in/SignInRequestDto';
import { signIn } from '../request.index';
import { HttpExceptionFilter } from '../../../src/domain/common/filters/HttpExceptionFilter';
import { searchVideoByKeyword } from './request';

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

    const reqParam: SignInRequestDto = {
      thirdPartyAccessToken: 'asdfasdfasdfasdf',
    };

    const res = await signIn(httpServer, reqParam);

    accessToken = res.body.accessToken;
  });

  afterAll(async () => {
    await dbConnection.collection('users').deleteMany({});

    await app.close();
  });

  describe('GET v1/videos/:keyword', () => {
    describe('try get using keyword "황희찬"', () => {
      it('video list should be return', async () => {
        const res = await searchVideoByKeyword(
          httpServer,
          accessToken,
          '황희찬',
          5,
        );

        expect(res.statusCode).toBe(200);
        expect(res.body.items).toHaveLength(5);
        expect(res.body.nextpageToken).toBeDefined();
      });
    });
  });
});

/***
keyword로 검색
잘 검색됐나 확인 
maxResults의 length가 맞나 확인
 */
