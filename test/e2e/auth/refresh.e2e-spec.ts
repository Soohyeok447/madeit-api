import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { refreshtoken } from '../refreshtoken';
import { AppModule } from '../../../src/ioc/AppModule';
import * as request from 'supertest';
import mongoose from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseService } from 'src/ioc/DatabaseModule';



describe('refresh e2e test', () => {
  let app: INestApplication;
  let httpServer: any;
  let dbConnection;

  beforeEach(async () => {
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
  });

  afterAll(async () => {
    

    await app.close();
  });

  describe('POST v1/auth/refresh', () => {
    let accessToken: string;
    let refreshToken: string = refreshtoken;

    describe('try reissue accessToken with wrong refreshToken', () => {
      it('should throw unauthorization exception', async () => {
        const res = await request(httpServer)
          .post('v1/auth/refresh')
          .set('Authorization', `Bearer wrongToken`);
  
        expect(res.statusCode).toBe(401);
      });

      it('should return accessToken', async () => {
        const res = await request(httpServer)
          .post('/auth/refresh')
          .set('Authorization', `Bearer ${refreshToken}`);
  
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
