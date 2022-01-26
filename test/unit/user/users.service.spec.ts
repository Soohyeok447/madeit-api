import { Test } from '@nestjs/testing';
import { UserServiceImpl } from 'src/domain/use-cases/user/service/UserServiceImpl';
import { UserRepository } from 'src/domain/common/repository/user/users.repository';
import { Job } from 'src/domain/enums/Job';
import { Gender } from 'src/domain/enums/Gender';
import { UserNotRegisteredException } from 'src/domain/use-cases/user/use-cases/find-user/exceptions/UserNotRegisteredException';
import { UserService } from 'src/domain/use-cases/user/service/interface/UserService';
import { InvalidUsernameException } from 'src/domain/use-cases/user/use-cases/do-user-onboarding/exceptions/InvalidUsernameException';
import { UsernameConflictException } from 'src/domain/use-cases/user/use-cases/do-user-onboarding/exceptions/UsernameConflictException';

const mockUserRepository = {
  findOne: jest.fn(),
  findOneByEmail: jest.fn(),
  findOneByUsername: jest.fn(),
  update: jest.fn(),
};

describe('UsersService', () => {
  let userServcie: UserService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: UserService,
          useClass: UserServiceImpl,
        },
        {
          provide: UserRepository,
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    userServcie = moduleRef.get<UserService>(UserService);
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

    it("should throw UserNotRegisteredException if didn't registrated", async () => {
      const input = {
        id: 'definitelyExist',
      };

      mockUserRepository.findOne.mockResolvedValue({
        gender: Gender.male,
        job: Job.entertainer,
        username: 'test',
        birth: '1111-11-11',
      });

      expect(userServcie.findUser(input)).rejects.toThrow(
        UserNotRegisteredException,
      );
    });
  });
});
