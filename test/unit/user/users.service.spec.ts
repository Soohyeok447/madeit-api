import { Test } from '@nestjs/testing';
import { UsersServiceImpl } from 'src/domain/users/service/users.service';
import { UserRepository } from 'src/domain/users/users.repository';
import { Job } from 'src/domain/common/enums/job.enum';
import { Gender } from 'src/domain/common/enums/gender.enum';
import { UserNotRegisteredException } from 'src/domain/users/use-cases/find-user/exceptions/user_not_registered.exception';
import { UsersService } from 'src/domain/users/service/interface/users.service';
import { InvalidUsernameException } from 'src/domain/users/use-cases/do-user-onboarding/exceptions/invalid_username.exception';
import { UsernameConflictException } from 'src/domain/users/use-cases/do-user-onboarding/exceptions/username_conflict.exception';

const mockUserRepository = {
  findOne: jest.fn(),
  findOneByEmail: jest.fn(),
  findOneByUsername: jest.fn(),
  update: jest.fn(),
};

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

  describe('doUserOnboarding()', () => {
    it('should throw username conflict exception', async () => {
      mockUserRepository.findOneByUsername.mockResolvedValue(true);

      const input = {
        id: 'id',
        username: 'conflictName',
        job: Job.student,
        gender: Gender.male,
        birth: '2000-01-01',
      };

      expect(userServcie.doUserOnboarding(input)).rejects.toThrow(
        UsernameConflictException,
      );
    });

    it('should throw invalid username exception', async () => {
      mockUserRepository.findOneByUsername.mockResolvedValue(undefined);

      const input = {
        id: 'id',
        username: 'a',
        job: Job.student,
        gender: Gender.male,
        birth: '2000-01-01',
      };

      expect(userServcie.doUserOnboarding(input)).rejects.toThrow(
        InvalidUsernameException,
      );
    });

    it('should return null by success to updating', async () => {
      mockUserRepository.findOneByUsername.mockResolvedValue(undefined);

      const input = {
        id: 'id',
        username: 'test',
        job: Job.student,
        gender: Gender.male,
        birth: '2000-01-01',
      };

      mockUserRepository.update.mockResolvedValue('void');

      expect(await userServcie.doUserOnboarding(input)).toBe(undefined);
    });
  });

  describe('findUser()', () => {
    it('should throw UserNotRegisterdException', async () => {
      const input = {
        id: 'definitelyExist',
      };

      mockUserRepository.findOne.mockResolvedValue({
        gender: null,
        job: null,
        username: null,
        birth: null,
      });

      expect(userServcie.findUser(input)).rejects.toThrow(
        UserNotRegisteredException,
      );
    });

    it('should return user data', async () => {
      const input = {
        id: 'definitelyExist',
      };

      mockUserRepository.findOne.mockResolvedValue({
        gender: Gender.male,
        job: Job.entertainer,
        username: 'test',
        birth: '1111-11-11',
      });

      const result = await userServcie.findUser(input);

      expect(result).toBeDefined();
    });
  });
});
