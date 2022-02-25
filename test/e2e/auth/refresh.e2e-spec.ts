import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { setTimeOut } from '../e2e-env';
import { AppModule } from '../../../src/ioc/AppModule';
import { DatabaseService } from 'src/ioc/DatabaseModule';
import { SignInRequestDto } from 'src/adapter/auth/sign-in/SignInRequestDto';
import { signIn, refresh } from '../request.index';
import { HttpExceptionFilter } from '../../../src/domain/common/filters/HttpExceptionFilter';



describe('refresh e2e test', () => {
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

    app.useGlobalFilters(new HttpExceptionFilter);

    await app.init();
    dbConnection = moduleRef.get<DatabaseService>(DatabaseService).getConnection();
    httpServer = app.getHttpServer();

    const reqParam: SignInRequestDto = {
      thirdPartyAccessToken: 'asdfasdfasdfasdf'
    }

    const res = await signIn(httpServer, reqParam);

    accessToken = res.body.accessToken;
    refreshToken = res.body.refreshToken;
  });

  afterAll(async () => {
    await dbConnection.collection('users').deleteMany({});

    await app.close();
  });


  describe('POST v1/auth/refresh', () => {
    describe('try reissue accessToken with wrong refreshToken', () => {
      it('should throw unauthorization exception', async () => {
        const res = await refresh(httpServer, 'wrongToken');

        expect(res.statusCode).toBe(401);
      });

    })
    describe('try reissue accessToken with correct refreshToken', () => {
      it('should return accessToken', async () => {
        const res = await refresh(httpServer, refreshToken);

        expect(res.statusCode).toBe(201);
        expect(res.body.accessToken).toBeDefined();
      });

    })
  })
});



/***
리프레쉬 실패(유효하지 않은 토큰) ㅇ
리프레쉬 받기(토큰 반환) ㅇ
 */
