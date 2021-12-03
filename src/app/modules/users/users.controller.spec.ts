import { ConflictException } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './interfaces/users.service';
import { UsersController } from './users.controller';
import { UsersServiceImpl } from './users.service';

const mockUserService = {
  create: jest.fn(),
}

describe('UserController', () => {
  let userController: UsersController;
  let moduleRef: TestingModule;

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
      ],
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUserService,
        }
      ],
    }).compile();

    userController = moduleRef.get<UsersController>(UsersController);
  });

  const username = 'jinsu';
  const email = 'sample@sample.com';
  const password = 'password1';

  const createUserDto = {
    email,
    password,
    username,
  };

  it('should create an user', async () => {
    mockUserService.create.mockResolvedValue(createUserDto);

    expect(await userController.create(createUserDto)).resolves;
  });

  it('should throw an error by conflict', async () => {
    mockUserService.create.mockRejectedValue(new ConflictException);

    expect(userController.create(createUserDto)).rejects.toThrow(ConflictException);
  });
});
