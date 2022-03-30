import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { setTimeOut } from '../e2e-env';
import { AppModule } from '../../../src/ioc/AppModule';
import { DatabaseService } from 'src/ioc/DatabaseModule';
import { Category } from 'src/domain/common/enums/Category';
import {
  authorize,
  addRecommendedRoutineToCart,
  addRecommendedRoutine,
} from '../request.index';
import { InitApp, initSignUp } from '../config';
import * as request from 'supertest';
import { AddPostRequestDto } from '../../../src/adapter/information-board/add-post/AddPostRequestDto';

describe('addBoard(information) e2e test', () => {
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

  describe('POST v1/info-boards', () => {
    describe('Add post', () => {
      it('board entity should be return', async () => {
        await request(httpServer)
          .patch('/v1/e2e/user')
          .set('Authorization', `Bearer ${accessToken}`)
          .set('Accept', 'application/json');

        const dto: AddPostRequestDto = {
          title: '테스트게시글',
        };

        const res = await request(httpServer)
          .post('/v1/info-boards')
          .set('Authorization', `Bearer ${accessToken}`)
          .set('Accept', 'application/json')
          .type('application/json')
          .send(dto);

        expect(res.statusCode).toEqual(201);
        expect(res.body.title).toEqual('테스트게시글');
      });
    });
  });
});

/***
 * 게시글 추가
 * 추가된 게시글 확인
 */
