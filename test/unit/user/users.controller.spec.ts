import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { Gender } from 'src/domain/models/enum/gender.enum';
import { Job } from 'src/domain/models/enum/job.enum';
import { UsersService } from 'src/domain/services/interfaces/users.service';
import { UsersController } from '../../../src/adapter/controllers/users.controller';
const mockUserService = {
  create: jest.fn(),
  doUserOnboarding: jest.fn(),
  findUser: jest.fn(),
};

describe('UserController', () => {
  let userController: UsersController;
  let moduleRef: TestingModule;

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [ConfigModule.forRoot()],
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    userController = moduleRef.get<UsersController>(UsersController);
  });

  describe('doUserOnboarding()', () => {
    const id= 'id';
    const body = {
      username: 'username',
      birth: '1111-11-11',
      job: Job.student,
      gender: Gender.male
    }

    it('should return nothing', async () => {
      mockUserService.doUserOnboarding.mockResolvedValue(undefined);
  
      

      expect(await userController.doUserOnboarding(id, body)).resolves;
    });
  })

  describe('findUser()', ()=>{
    it('should return user data', async () => {
      mockUserService.findUser.mockResolvedValue('user');

      expect(await userController.findUser({id:'id'}))
      .resolves
    })
  })
  
});
