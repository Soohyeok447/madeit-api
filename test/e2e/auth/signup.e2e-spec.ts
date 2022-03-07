import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { setTimeOut } from '../e2e-env';
import { AppModule } from '../../../src/ioc/AppModule';
import { DatabaseService } from 'src/ioc/DatabaseModule';
import { InitApp } from '../config';
import { signUp } from './request';
import { SignUpRequestDto } from '../../../src/adapter/auth/sign-up/SignUpRequestDto';
import { Provider } from '../../../src/domain/use-cases/auth/common/types/provider';

describe('signup e2e test', () => {
  let app: INestApplication;
  let httpServer: any;
  let dbConnection;

  let accessToken: string;

  setTimeOut();

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = await InitApp(app, moduleRef);

    dbConnection = moduleRef
      .get<DatabaseService>(DatabaseService)
      .getConnection();
    httpServer = app.getHttpServer();
  });

  afterAll(async () => {
    await dbConnection.collection('users').deleteMany({});

    await app.close();
  });

  describe('POST v1/e2e/auth/signup', () => {
    describe('try signup using wrong provider', () => {
      describe('provider=dfadfdasfsadfasfda', () => {
        const signUpParam: SignUpRequestDto = {
          thirdPartyAccessToken: 'asdfasdfasdfasdf',
          username: 'e2eTesting..',
          age: 3,
          goal: 'e2e 테스트를 완벽하게합시다',
          statusMessage: '화이팅중',
        };

        it('InvalidProviderException should be thrown', async () => {
          const res = await signUp(httpServer, null, signUpParam);

          expect(res.statusCode).toBe(400);
          expect(res.body.errorCode).toEqual(1);
        });
      });
    });

    describe('try signup using valid provider', () => {
      describe('provider=kakao', () => {
        describe('using wrong thirdPartyAccessToken', () => {
          const signUpParam: SignUpRequestDto = {
            thirdPartyAccessToken: 'wrongToken',
            username: 'e2eTesting..',
            age: 3,
            goal: 'e2e 테스트를 완벽하게합시다',
            statusMessage: '화이팅중',
          };

          it('InvalidKakaoToken should be thrown', async () => {
            const res = await signUp(httpServer, Provider.kakao, signUpParam);

            expect(res.statusCode).toBe(400);
            expect(res.body.errorCode).toEqual(3);
          });
        });

        describe('using valid thirdPartyAccessToken', () => {
          describe('using not intact request form', () => {
            const signUpParam = {
              thirdPartyAccessToken: 'SUPPOSETHISISVALIDTOKEN',
              // username: 'e2eTesting..',
              // age: 3,
              goal: 'e2e 테스트를 완벽하게합시다',
              statusMessage: '화이팅중',
            };

            it('BadRequestExceptiont should be thrown', async () => {
              const res = await signUp(httpServer, Provider.kakao, signUpParam);

              expect(res.statusCode).toBe(400);
            });
          });

          describe('using intact request form', () => {
            const signUpParam = {
              thirdPartyAccessToken: 'SUPPOSETHISISVALIDTOKEN',
              username: 'e2eTesting..',
              age: 3,
              goal: 'e2e 테스트를 완벽하게합시다',
              statusMessage: '화이팅중',
            };

            it('expect to the successful signup', async () => {
              const res = await signUp(httpServer, Provider.kakao, signUpParam);

              expect(res.statusCode).toBe(201);
            });
          });

          describe('retry signup already registered', () => {
            const signUpParam = {
              thirdPartyAccessToken: 'SUPPOSETHISISVALIDTOKEN',
              username: 'e2eTesting..',
              age: 3,
              goal: 'e2e 테스트를 완벽하게합시다',
              statusMessage: '화이팅중',
            };

            it('UserAlreadyRegisteredException should be thrown', async () => {
              const res = await signUp(httpServer, Provider.kakao, signUpParam);

              expect(res.statusCode).toBe(409);
              expect(res.body.errorCode).toEqual(7);
            });
          });
        });
      });
    });
  });
});

/***
 * 잘못된 프로바이더 (kakao, google)
 * 잘못된 토큰 (kakao, google)
 * 잘못된 request form
 * 회원가입
 * 회원가입 재시도 (이미 가입한 유저)
 */
