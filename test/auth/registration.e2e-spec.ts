import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../src/infrastructure/ioc/app.module';
import { UserRepository } from '../../src/app/modules/users/users.repository';
import * as request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getConnection } from 'typeorm';

describe('registration e2e test', () => {
  let app: INestApplication;
  let userRepository: UserRepository;

  let accessToken: string;
  let refreshToken: string;


  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forFeature([UserRepository]),
        AppModule,
      ],
      providers: [
        {
          provide: UserRepository,
          useValue: UserRepository,
        }
      ]
    }).compile();

    app = moduleRef.createNestApplication();
    
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    userRepository = moduleRef.get<UserRepository>(UserRepository);

    await app.init();
  });

  afterAll(async () => {
    await getConnection().dropDatabase();

    await app.close();
  });

  it('/users (POST) expect bad reqeust Error (too short username)', async () => {
    const res =  await request(app.getHttpServer())
      .post('/users')
      .send({ username: '1', email: 'email@email.com', password: 'password' })
      
      expect(res.statusCode).toBe(400);
      expect(res.body.error).toEqual("Bad Request");
  });

  it('/users (POST) expect bad reqeust Error (too long username)', async () => {
    const res =  await request(app.getHttpServer())
      .post('/users')
      .send({ username: '123456789', email: 'email@email.com', password: 'password' })

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toEqual("Bad Request");
  });

  it('/users (POST) expect bad reqeust Error (wrong email validation)', async () => {
    const res =  await request(app.getHttpServer())
      .post('/users')
      .send({ username: 'testuser', email: 'this is email', password: 'password' })
      
      expect(res.statusCode).toBe(400);
      expect(res.body.error).toEqual("Bad Request");
  });

  it('/users (POST) expect bad reqeust Error (too short password)', async () => {
    const res =  await request(app.getHttpServer())
      .post('/users')
      .send({ username: 'testuser', email: 'email@email.com', password: '1' })
      
      expect(res.statusCode).toBe(400);
      expect(res.body.error).toEqual("Bad Request");
  });

  it('/users (POST) expect bad reqeust Error (too long password)', async () => {
    const res = await request(app.getHttpServer())
      .post('/users')
      .send({ username: 'testuser', email: 'email@email.com', password: '1234567891011121314151617181920' })
      
      expect(res.statusCode).toBe(400);
      expect(res.body.error).toEqual("Bad Request");
  });

  it('/users (POST) expect bad reqeust Error (only number password)', async () => {
    const res = await request(app.getHttpServer())
      .post('/users')
      .send({ username: 'testuser', email: 'email@email.com', password: '123456789' })
      

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toEqual("Bad Request");
    });
    
    it('/users (POST) expect bad reqeust Error (only string password)', async () => {
      const res =  await request(app.getHttpServer())
      .post('/users')
      .send({ username: 'testuser', email: 'email@email.com', password: 'abcdefgasdf' })
      
      expect(res.statusCode).toBe(400);
      expect(res.body.error).toEqual("Bad Request");
  });

  it('/users (POST) registeration success', async () => {
    const res = await request(app.getHttpServer())
      .post('/users')
      .send({ username: 'testuser', email: 'email@email.com', password: 'password1' })

      expect(res.statusCode).toBe(201);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body).toBeDefined();
  });

  it('/users (POST) expect email conflict error',async()=>{
    const res = await request(app.getHttpServer())
      .post('/users')
      .send({ username: 'testuser', email: 'email@email.com', password: 'password1' })

      expect(res.status).toBe(409);
      expect(res.body.message).toEqual('이미 가입된 이메일입니다.');
      expect(res.body.error).toEqual('Conflict');
  });
})

/***
회원가입 실패 (잘못된 이메일) ㅇ 
회원가입 실패 (잘못된 유저네임) ㅇ
회원가입 실패 (잘못된 패스워드) ㅇ
회원가입 성공 ㅇ
중복 회원가입 시도 ㅇ
 */

