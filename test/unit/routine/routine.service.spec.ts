import { Test } from '@nestjs/testing';
import { UserRepository } from 'src/domain/common/repositories/user/users.repository';
import { RoutineService } from 'src/domain/routine/service/interface/routine.service';
import { RoutineServiceImpl } from 'src/domain/routine/service/routine.service';
import { CreateRoutineDto } from 'src/domain/common/repositories/routine/dtos/create.dto';
import { RoutineType } from 'src/domain/common/enums/routine_type.enum';
import { RoutineRepository } from 'src/domain/common/repositories/routine/routine.repsotiroy';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { RoutineNotFoundException } from 'src/domain/common/exceptions/routine_not_found.exception';
import { InvalidTokenException } from 'src/domain/common/exceptions/invalid_token.exception';
import { InvalidRoutineIdException } from 'src/domain/routine/use-cases/get-routine-detail/exceptions/invalid_routine_id.exception';
import { Category } from 'src/domain/common/enums/category.enum';

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
};

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
          useValue: mockRoutineRepository,
        },
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
      category: Category.yoga,
      type: RoutineType.embeded,
      thumbnailUrl: 'url',
      introductionScript: 'script',
      introductionImageUrl: 'url',
      motivation: '아자아자',
      price: 0,
    };

    it('should return routineId', async () => {
      mockUserRepository.findOne.mockResolvedValue({
        isAdmin: true,
      });
      mockRoutineRepository.findOneByRoutineName.mockResolvedValue(undefined);

      mockRoutineRepository.create.mockResolvedValue('routinId');

      expect(await routineService.addRoutine({
        userId: 'asda',
        routine: newRoutine,
      }));
    });

    it('should throw UnauthorizedException', async () => {
      mockUserRepository.findOne.mockResolvedValue({
        isAdmin: false,
      });

      expect(
        routineService.addRoutine({
          userId: 'asda',
          routine: newRoutine,
        }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException', async () => {
      mockUserRepository.findOne.mockResolvedValue({
        isAdmin: true,
      });

      expect(
        routineService.addRoutine({
          userId: 'asda',
          routine: newRoutine,
        }),
      ).rejects.toThrow(InvalidTokenException);
    });

    it('should throw ConflictException', async () => {
      mockUserRepository.findOne.mockResolvedValue({
        isAdmin: true,
      });

      mockRoutineRepository.findOneByRoutineName.mockResolvedValue('exist');

      expect(
        routineService.addRoutine({
          userId: 'asda',
          routine: newRoutine,
        }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('getRoutineDetail()', () => {
    it('should return an routine data', async () => {
      mockRoutineRepository.findOne.mockResolvedValue('routine');

      expect(await routineService.getRoutineDetail({ routineId: 'id' }));
    });

    it('should throw RoutineNotFoundException', async () => {
      mockRoutineRepository.findOne.mockResolvedValue(undefined);

      expect(
        routineService.getRoutineDetail({ routineId: 'id' }),
      ).rejects.toThrow(RoutineNotFoundException);
    });

    it('should throw InvalidRoutineIdException', async () => {
      mockRoutineRepository.findOne.mockRejectedValue(
        InvalidRoutineIdException,
      );

      expect(
        routineService.getRoutineDetail({ routineId: 'wrongId' }),
      ).rejects.toThrow(InvalidRoutineIdException);
    });
  });
});
