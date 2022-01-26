import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { Gender } from 'src/domain/enums/Gender';
import { Job } from 'src/domain/enums/Job';
import { UserService } from 'src/domain/use-cases/user/service/interface/UserService';
import { UserController } from '../../../src/adapter/controllers/UserController';
const mockUserService = {
  create: jest.fn(),
  doUserOnboarding: jest.fn(),
  findUser: jest.fn(),
};

describe('UserController', () => {
  let userController: UserController;
  let moduleRef: TestingModule;

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [ConfigModule.forRoot()],
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    userController = moduleRef.get<UserController>(UserController);
  });

  describe('doUserOnboarding()', () => {
    const id = 'id';
    const body = {
      username: 'username',
      birth: '1111-11-11',
      job: Job.student,
      gender: Gender.male,
    };

    it('should return nothing', async () => {
      mockUserService.doUserOnboarding.mockResolvedValue(undefined);

      expect(await userController.doUserOnboarding(id, body)).resolves;
    });
  });

  describe('findUser()', () => {
    it('should return user data', async () => {
      mockUserService.findUser.mockResolvedValue('user');

      expect(await userController.findUser({ id: 'id' })).resolves;
    });
  });
});
