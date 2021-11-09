import { ConflictException } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UserController', () => {
  let controller: UsersController;
  let service: UsersService;
  let moduleRef: TestingModule;

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
        TypeOrmModule.forRootAsync({
          useFactory: () => ({
            type: 'mysql',
            host: process.env.DATABASE_HOST,
            port: parseInt(process.env.DATABASE_PORT, 10),
            username: process.env.DATABASE_USER,
            password: process.env.DATABASE_PASSWORD,
            database: process.env.DATABASE_NAME_TEST,
            entities: [User],
            synchronize: true,
          }),
        }),
        TypeOrmModule.forFeature([User]),
      ],
      controllers: [UsersController],
      providers: [UsersService],
    }).compile();

    service = moduleRef.get<UsersService>(UsersService);
    controller = moduleRef.get<UsersController>(UsersController);
  });

  afterAll(async () => {
    await service.cleanUp();

    moduleRef.close();
  });

  const username = 'jinsu';
  const email = 'sample@sample.com';
  const password = 'password1';

  let createdUserId: number;

  const createUserDto = {
    email,
    password,
    username,
  };

  it('should validate an username', async () => {
    await controller.validate(username);
  });

  it('should create an user', async () => {
    const result = await controller.create(createUserDto);

    expect(result).toBeDefined();

    createdUserId = result.id;

    expect(result.username).toEqual(username);
    expect(result.email).toEqual(email);
  });

  it('should validate an username', async () => {
    expect(controller.validate(username)).rejects.toThrow(ConflictException);
  });

  it('should throw an error by conflict', async () => {
    expect(controller.create(createUserDto)).rejects.toThrow(ConflictException);
  });

  it('should find an user', async () => {
    const result = await controller.findOne(createdUserId);

    expect(result).toBeDefined();

    expect(result.username).toEqual(username);
    expect(result.email).toEqual(email);
  });
});
