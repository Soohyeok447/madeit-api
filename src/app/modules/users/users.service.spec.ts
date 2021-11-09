import { BadRequestException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

const mockUserRepository = () => ({
  create: jest.fn(),
  save: jest.fn(),
  findOne: jest.fn(),
});

type MockUserRepository<T = any> = Partial<
  Record<keyof Repository<T>, jest.Mock>
>;

describe('UsersService', () => {
  let service: UsersService;
  let userRepository: MockUserRepository<User>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository(),
        },
      ],
    }).compile();

    service = moduleRef.get<UsersService>(UsersService);
    userRepository = moduleRef.get<MockUserRepository<User>>(
      getRepositoryToken(User),
    );
  });

  it('should be defined', async () => {
    expect(service).toBeDefined();
  });

  it('should create a user', async () => {
    const createUserDto = {
      username: 'jinsu',
      email: 'email@email.email',
      password: 'password1',
    };

    userRepository.save.mockResolvedValue(createUserDto);

    const result = await service.create(createUserDto);

    expect(result).toEqual(createUserDto);
  });

  it('should fail to validate an username', async () => {
    const createUserDto = {
      username: 'maybetoolongname',
      email: 'email@email.com',
      password: 'password1',
    };

    userRepository.save.mockResolvedValue(createUserDto);

    expect(service.create(createUserDto)).rejects.toThrow(BadRequestException);
  });

  it('should fail to validate an username', async () => {
    const createUserDto = {
      username: 'j',
      email: 'email@email.com',
      password: 'password1',
    };

    userRepository.save.mockResolvedValue(createUserDto);

    expect(service.create(createUserDto)).rejects.toThrow(BadRequestException);
  });

  it('should fail to validate an email', async () => {
    const createUserDto = {
      username: 'jinsu',
      email: 'an email',
      password: 'password1',
    };

    userRepository.save.mockResolvedValue(createUserDto);

    expect(service.create(createUserDto)).rejects.toThrow(BadRequestException);
  });

  it('should fail to validate', async () => {
    const createUserDto = {
      username: 'jinsu',
      email: 'email@email.com',
      password: 'short',
    };

    userRepository.save.mockResolvedValue(createUserDto);

    expect(service.create(createUserDto)).rejects.toThrow(BadRequestException);
  });

  it('should fail to validate', async () => {
    const createUserDto = {
      username: 'jinsu',
      email: 'email@email.com',
      password: 'thisismypasswordmaybetoolong',
    };

    userRepository.save.mockResolvedValue(createUserDto);

    expect(service.create(createUserDto)).rejects.toThrow(BadRequestException);
  });

  it('should find a user', async () => {
    const user = 'an user';

    userRepository.findOne.mockResolvedValue(user);

    const id = 1;

    const result = await service.findOne(id);

    expect(result).toEqual(user);
  });

  it('should find a user with an email', async () => {
    const user = 'an user';

    userRepository.findOne.mockResolvedValue(user);

    const email = 'email@email.com';

    const result = await service.findOneByEmail(email);

    expect(result).toEqual(user);
  });

  it('should find a user with an username', async () => {
    const user = 'an user';

    userRepository.findOne.mockResolvedValue(user);

    const username = 'jinsu';

    const result = await service.findOneByEmail(username);

    expect(result).toEqual(user);
  });
});
