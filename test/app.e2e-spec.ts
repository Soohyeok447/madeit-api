import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app/app.module';
import { UserRepository } from '../src/app/modules/users/users.repository';
import * as request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';

describe('e2e test', () => {
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
    await userRepository.cleanUp();

    await app.close();
  });

  it('/health (GET) should return "I am healthy"', async () => {
    const res = await request(app.getHttpServer())
      .get('/health')

      expect(res.statusCode).toBe(200);
      expect(res.text).toEqual('I am healthy');
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

  it('/auth/signin (POST) expect bad request error (wrong email validation)', async () => {
    const res =  await request(app.getHttpServer())
    .post('/auth/signin')
    .send({ email: 'this is email', password: 'password1' })
    
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toEqual("Bad Request");
  });

  
  it('/auth/signin (POST) expect bad request error (only number password)', async () => {
    const res =  await request(app.getHttpServer())
    .post('/auth/signin')
    .send({ email: 'email@email.com', password: '12345678' })
    
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toEqual("Bad Request");
  });
  
  it('/auth/signin (POST) expect bad request error (only string password)', async () => {
    const res =  await request(app.getHttpServer())
    .post('/auth/signin')
    .send({ email: 'email@email.com', password: 'abcdefgh' })
    
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toEqual("Bad Request");
  });
  
  it('/auth/signin (POST) expect bad request error (too short password)', async () => {
    const res =  await request(app.getHttpServer())
    .post('/auth/signin')
    .send({ email: 'email@email.com', password: 'pw1' })
    
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toEqual("Bad Request");
  });
  
  it('/auth/signin (POST) expect bad request error (too long password)', async () => {
    const res =  await request(app.getHttpServer())
    .post('/auth/signin')
    .send({ email: 'email@email.com', password: 'password1password1password1password1password1password1' })
    
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toEqual("Bad Request");
  });
  
  it('/auth/signin (POST) expect Unauthorized error (wrong password)', async () => {
    const res =  await request(app.getHttpServer())
    .post('/auth/signin')
    .send({ email: 'email@email.com', password: 'password2' })
    
    expect(res.statusCode).toBe(401);
    expect(res.body.error).toEqual("Unauthorized");
  });
  
  it('/auth/signin (POST) should return JSON included accessToken and refreshToken', async () => {
    const res =  await request(app.getHttpServer())
    .post('/auth/signin')
    .send({ email: 'email@email.com', password: 'password1' })

    accessToken = res.body.accessToken;
    refreshToken = res.body.refreshToken;
    
    expect(res.statusCode).toBe(200);
    expect(res.body.accessToken).toBeDefined();
    expect(res.body.refreshToken).toBeDefined();
  });

  it('/auth/signOut (POST) should return response.status success', async () => {
    const res =  await request(app.getHttpServer())
    .post('/auth/signout')
    .set('Authorization', `Bearer ${accessToken}`)
    .send({ email: 'email@email.com', password: 'password1' })
    
    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe('success');
  });


})

/***
회원가입 실패 (잘못된 이메일) ㅇ 
회원가입 실패 (잘못된 유저네임) ㅇ
회원가입 실패 (잘못된 패스워드) ㅇ
회원가입 성공 ㅇ
중복 회원가입 시도 ㅇ
로그인 실패 (잘못된 이메일) ㅇ
로그인 실패 (잘못된 패스워드) ㅇ
로그인 실패 (다른 패스워드) ㅇ
로그인 성공 (토큰반환) ㅇ
로그아웃 성공 (user DB refreshToken null로 변경)
 */