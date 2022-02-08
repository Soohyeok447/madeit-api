import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { setTimeOut } from '../e2e-env';
import { AppModule } from '../../../src/ioc/AppModule';
import { DatabaseService } from 'src/ioc/DatabaseModule';
import { SignInRequestDto } from 'src/adapter/auth/sign-in/SignInRequestDto';
import { onboard, addRoutine, signIn, authorize, getRoutineDetail, patchThumbnail, patchCardnews } from '../request.index';


describe('patchThumbnailCardnews e2e test', () => {
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

    await app.init();
    dbConnection = moduleRef.get<DatabaseService>(DatabaseService).getConnection();
    httpServer = app.getHttpServer();

    const signInParam: SignInRequestDto = {
      thirdPartyAccessToken: 'asdfasdfasdfasdf'
    }

    const res = await signIn(httpServer, signInParam)

    accessToken = res.body.accessToken;
    refreshToken = res.body.refreshToken;

    const onboardParam = {
      username: "테스트",
      birth: "0000-00-00",
      job: "student",
      gender: "male"
    };

    await onboard(httpServer, accessToken, onboardParam);

  });

  afterAll(async () => {
    await dbConnection.collection('users').deleteMany({});
    await dbConnection.collection('routines').deleteMany({});
    await dbConnection.collection('images').deleteMany({});

    await app.close();
  });

  let routineId: string;
  let thumbnail: string;
  let cardnews: string;

  describe('PATCH v1/routines/:id/thumbnail', () => {
    describe('before getting admin authorization...', () => {
      describe('try patch thumbnail', () => {
        describe('using valid mongo object id with thumbnail', () => {
          it('UserNotAdminException should be thrown', async () => {
            const res = await patchThumbnail(httpServer, accessToken, 'test/e2e/routine/thumbnail.jpg', '123456789101112131415161');

            expect(res.statusCode).toBe(401);
          })
        })

        describe('using invalid mongo object id with thumbnail', () => {
          it('InvalidMongoObjectIdException should be thrown', async () => {
            const res = await patchThumbnail(httpServer, accessToken, 'test/e2e/routine/thumbnail.jpg', '123');

            expect(res.statusCode).toBe(400);
          })
        })
      })
    })

    describe('after getting admin authorization...', () => {
      describe('try patch thumbnail', () => {
        describe('using wrong id with thumbnail', () => {
          it('RoutineNotFoundException should be thrown', async () => {
            await authorize(httpServer, accessToken)

            const res = await patchThumbnail(httpServer, accessToken, 'test/e2e/routine/thumbnail.jpg', '123456789101112131415161');

            expect(res.statusCode).toBe(404);
          })
        })

        describe('using invalid mongo object id with thumbnail', () => {
          it('InvalidMongoObjectIdException should be thrown', async () => {
            const res = await patchThumbnail(httpServer, accessToken, 'test/e2e/routine/thumbnail.jpg', '123');

            expect(res.statusCode).toBe(400);
          })
        })
      })
    })
  })

  describe('POST v1/routines', () => {
    it('add an routine', async () => {
      await authorize(httpServer, accessToken);

      const addRoutineParam = {
        name: "e2eTest",
        category: "Health",
        type: "Embeded",
        introductionScript: "e2eTest",
        motivation: "e2eTest",
        price: "0"
      };

      const res = await addRoutine(httpServer, accessToken, addRoutineParam);
      routineId = res.body.id;
    })
  })

  describe('PATCH v1/routines/:id/thumbnail after add routine', () => {
    describe('try patch thumbnail', () => {
      describe('using invalid mongo object id with thumbnail', () => {
        it('InvalidMongoObjectIdException should be thrown', async () => {
          const res = await patchThumbnail(httpServer, accessToken, 'test/e2e/routine/thumbnail.jpg', '123');

          expect(res.statusCode).toBe(400);
        })
      })

      describe('using valid mongo object id with thumbnail', () => {
        it('should return routineModel', async () => {
          const res = await patchThumbnail(httpServer, accessToken, 'test/e2e/routine/thumbnail.jpg', routineId);

          expect(res.statusCode).toBe(200);
        })
      })

    })
  })



  describe('PATCH v1/routines/:id/cardnews after add routine', () => {
    describe('try patch cardnews', () => {
      describe('using invalid mongo object id with cardnews', () => {
        it('InvalidMongoObjectIdException should be thrown', async () => {
          const res = await patchCardnews(
            httpServer,
            accessToken,
            [
              'test/e2e/routine/1.jpg',
              'test/e2e/routine/2.jpg'
            ],
            '123');

          expect(res.statusCode).toBe(400);
        })
      })

      describe('using valid mongo object id with cardnews', () => {
        it('should return routineModel', async () => {
          const res = await patchCardnews(httpServer, accessToken, [
            'test/e2e/routine/1.jpg',
            'test/e2e/routine/2.jpg'
          ], routineId);

          expect(res.statusCode).toBe(200);
        })
      })
    })

  })

  describe('GET v1/routines/:id', () => {
    describe('try get an routine ', () => {
      describe('using invalid mongo object id', () => {
        it('InvalidMongoObjectIdException should be thrown', async () => {
          const res = await getRoutineDetail(httpServer, accessToken, '123');

          expect(res.statusCode).toBe(400);
        })

      })

      describe('using nonexistent id', () => {
        it('RoutineNotFoundException should be thrown', async () => {
          const res = await getRoutineDetail(httpServer, accessToken, '111111111111111111111111');

          expect(res.statusCode).toBe(404);
        })
      })

      describe('using existent id', () => {
        it('should be return RoutineModel', async () => {
          const res = await getRoutineDetail(httpServer, accessToken, routineId);

          thumbnail = res.body.thumbnail;
          cardnews = res.body.cardnews;

          expect(res.statusCode).toBe(200);
          expect(thumbnail).toBeDefined();
          expect(cardnews).toBeDefined();
        })
      })
    })
  })

  describe('PATCH v1/routines/:id/thumbnail after get an routine', () => {
    describe('patch thumbnail', () => {
      it('should return modified routineModel', async () => {
        const res = await patchThumbnail(httpServer, accessToken, 'test/e2e/routine/modifiedThumbnail.jpg', routineId);

        expect(res.statusCode).toBe(200);
      })
    })
  })

  describe('PATCH v1/routines/:id/cardnews after get an routine', () => {
    describe('patch cardnews', () => {
      it('should return modified routineModel', async () => {
        const res = await patchCardnews(
          httpServer,
          accessToken,
          [
            'test/e2e/routine/3.jpg',
            'test/e2e/routine/4.jpg'
          ],
          routineId
        );

        expect(res.statusCode).toBe(200);
      })
    })
  })

  describe('GET v1/routines/:id after patch images', () => {
    describe('try get an routine ', () => {
      it('should be have to different cardnews', async () => {
        const res = await getRoutineDetail(httpServer, accessToken, routineId);

        expect(res.statusCode).toBe(200);
        expect(res.body.cardnews).not.toEqual(cardnews);
      })
    })
  })
});


/***
 * 어드민이 아님
 * 어드민 권한 부여
 * routine이 없음
 * 루틴 하나 생성
 * 유효하지 않은 mongoose object id
 * thumbnail 수정
 * cardnews 수정
 * findRoutine
 * thumbnail 수정
 * cardnews 수정
 * findRoutine
 */
