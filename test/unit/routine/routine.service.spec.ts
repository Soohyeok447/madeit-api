import { Test } from '@nestjs/testing';
import { UserRepository } from 'src/domain/repositories/users.repository';
import { UserNotRegisteredException } from 'src/domain/exceptions/users/user_not_registered.exception';
import { RoutineService } from 'src/domain/services/interfaces/routine.service';
import { RoutineServiceImpl } from 'src/domain/services/routine.service';
import { CreateRoutineDto } from 'src/domain/repositories/dto/routine/create.dto';
import { RoutineType } from 'src/domain/models/enum/routine_type.enum';
import { RoutineRepository } from 'src/domain/repositories/routine.repsotiroy';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { RoutineNotFoundException } from 'src/domain/exceptions/routine/routine_not_found.exception';
import { InvalidRoutineIdException } from 'src/domain/exceptions/routine/invalid_routine_id.exception';
import { InvalidTokenException } from 'src/domain/exceptions/auth/invalid_token.exception';

const mockUserRepository = {
  findOne: jest.fn(),
  findOneByEmail: jest.fn(),
  findOneByUsername: jest.fn(),
  update: jest.fn(),
};

const mockRoutineRepository = {
  findOne: jest.fn(),
  findOneByRoutineName: jest.fn(),
  create: jest.fn(),
  findAll: jest.fn(),
}

describe('RoutineService', () => {
  let routineService: RoutineService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: RoutineService,
          useClass: RoutineServiceImpl,
        },
        {
          provide: UserRepository,
          useValue: mockUserRepository,
        },
        {
          provide: RoutineRepository,
          useValue: mockRoutineRepository
        }
      ],
    }).compile();

    routineService = moduleRef.get<RoutineService>(RoutineService);
  });

  it('should be defined', async () => {
    expect(routineService).toBeDefined();
  });

  describe('addRoutine()', () => {
    const newRoutine: CreateRoutineDto = {
      name: 'newRoutine',
      type: RoutineType.embeded,
      thumbnailUrl: 'url',
      introductionScript: 'script',
      introductionImageUrl: 'url',
      motivation: '아자아자',
      price: 0
    }

    it('should return routineId', async () => {
      mockUserRepository.findOne.mockResolvedValue({
        isAdmin: true,

      })
      mockRoutineRepository.findOneByRoutineName.mockResolvedValue(undefined);

      mockRoutineRepository.create.mockResolvedValue('routinId');

      const result = await routineService.addRoutine({
        userId: 'asda',
        routine: newRoutine,
        secret: 'token'
      })

      expect(result).toBeDefined();
    });

    it('should throw UnauthorizedException', async () => {
      mockUserRepository.findOne.mockResolvedValue({
        isAdmin: false,

      })

      expect(routineService.addRoutine({
        userId: 'asda',
        routine: newRoutine,
        secret: 'token'
      })).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException', async () => {
      mockUserRepository.findOne.mockResolvedValue({
        isAdmin: true,

      })

      expect(routineService.addRoutine({
        userId: 'asda',
        routine: newRoutine,
        secret: 'wrongToken'
      })).rejects.toThrow(InvalidTokenException);
    });

    it('should throw ConflictException', async () => {
      mockUserRepository.findOne.mockResolvedValue({
        isAdmin: true,

      })

      mockRoutineRepository.findOneByRoutineName.mockResolvedValue('exist');

      expect(routineService.addRoutine({
        userId: 'asda',
        routine: newRoutine,
        secret: 'token'
      })).rejects.toThrow(ConflictException);
    });
  });

  describe('getAllRoutines()', () => {
    it('should return routines data', async () => {
      mockRoutineRepository.findAll.mockResolvedValue('routines');

      const result = await routineService.getAllRoutines({nextCursor:'fadsfa'});
      expect(result).toBeDefined();
    })
  });

  describe('getRoutineDetail()', () => {
    it('should return an routine data', async () => {
      mockRoutineRepository.findOne.mockResolvedValue('routine');

      const result = await routineService.getRoutineDetail({routineId:'id'});

      expect(result).toBeDefined();
    })

    it('should throw RoutineNotFoundException', async () => {
      mockRoutineRepository.findOne.mockResolvedValue(undefined);

      expect(routineService.getRoutineDetail({routineId:'id'})).rejects.toThrow(RoutineNotFoundException);
    })

    it('should throw InvalidRoutineIdException', async () => {
      mockRoutineRepository.findOne.mockRejectedValue(InvalidRoutineIdException);

      expect(routineService.getRoutineDetail({routineId:'wrongId'})).rejects.toThrow(InvalidRoutineIdException);
    })
  })

  describe('buyRoutine()', () => {
    it('should ', async () => {
      
    })
  })

});
