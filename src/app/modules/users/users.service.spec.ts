import { Test } from '@nestjs/testing';
import { UsersService } from './interfaces/users.service';
import { UserRepository } from './users.repository';
import { UsersServiceImpl } from './users.service';

const mockUserRepository = {
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  findOneByEmail: jest.fn(),
}


describe('UsersService', () => {
  let userServcie: UsersService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: UsersService,
          useClass: UsersServiceImpl,
        },
        {
          provide: UserRepository,
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    userServcie = moduleRef.get<UsersService>(UsersService);
  });

  it('should be defined', async () => {
    expect(userServcie).toBeDefined();
  });

  it('should create a user', async () => {
    const createUserDto = {
      username: 'jinsu',
      email: 'email@email.email',
      password: 'password1',
    };

    const user = 'userDataObject';

    mockUserRepository.save.mockResolvedValue(user);

    const result = await userServcie.create(createUserDto);

    expect(result).toEqual(user);
  });

  it('should find a user', async () => {
    const user = 'an user';

    mockUserRepository.findOne.mockResolvedValue(user);

    const id = 1;

    const result = await mockUserRepository.findOne(id);

    expect(result).toEqual(user);
  });

  it('should find a user with an email', async () => {
    const user = 'an user';

    mockUserRepository.findOneByEmail.mockResolvedValue(user);

    const email = 'email@email.com';

    const result = await mockUserRepository.findOneByEmail(email);

    expect(result).toEqual(user);
  });

  it('should find a user with an username', async () => {
    const user = 'an user';

    mockUserRepository.findOneByEmail.mockResolvedValue(user);

    const username = 'jinsu';

    const result = await mockUserRepository.findOneByEmail(username);

    expect(result).toEqual(user);
  });
});
