import { Test } from '@nestjs/testing';
import { UserRepository } from '../../../src/domain/repositories/users.repository';
import { AlarmService } from 'src/domain/services/interfaces/alarm.service';
import { AlarmServiceImpl } from 'src/domain/services/alarm.service';
import { AddInput } from 'src/domain/dto/alarm/add.input';
import { Day } from 'src/domain/models/enum/day.enum';
import { InvalidTimeException } from 'src/domain/exceptions/alarm/invalid_time.exception';
import { AlarmRepository } from 'src/domain/repositories/alarm.repository';

const mockUserRepository = {
  findOne: jest.fn(),

};

const mockAlarmRepository = {
  create : jest.fn(),
}

describe('AlarmService', () => {
  let alarmService: AlarmService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: AlarmService,
          useClass: AlarmServiceImpl,
        },
        {
          provide: UserRepository,
          useValue: mockUserRepository,
        },
        {
          provide: AlarmRepository,
          useValue: mockAlarmRepository,
        },
      ],
    }).compile();

    alarmService = moduleRef.get<AlarmService>(AlarmService);
  });

  it('should be defined', async () => {
    expect(alarmService).toBeDefined();
  });

  describe('add()', () => {

    describe('about time property', () => {
      it('should throw InvalidTimeException (time: 0)', async () => {
        const input: AddInput = {
          userId: 'id',
          time: 0,
          day: [Day.monday,Day.tuesday],
          routineId: 'routineId'
        }

        mockUserRepository.findOne.mockResolvedValue('user');
        mockAlarmRepository.create.mockResolvedValue(undefined);
  
        expect(alarmService.add(input)).rejects.toThrow(InvalidTimeException);
      })

      it('should throw InvalidTimeException (time: 2401)', async () => {
        const input: AddInput = {
          userId: 'id',
          time: 2401,
          day: [Day.monday,Day.tuesday],
          routineId: 'routineId'
        }

        mockUserRepository.findOne.mockResolvedValue('user');
        mockAlarmRepository.create.mockResolvedValue(undefined);
  
        expect(alarmService.add(input)).rejects.toThrow(InvalidTimeException);
      })

      it('should throw InvalidTimeException (time: 123)', async () => {
        const input: AddInput = {
          userId: 'id',
          time: 123,
          day: [Day.monday,Day.tuesday],
          routineId: 'routineId'
        }

        mockUserRepository.findOne.mockResolvedValue('user');
        mockAlarmRepository.create.mockResolvedValue(undefined);
  
        expect(alarmService.add(input)).rejects.toThrow(InvalidTimeException);
      })

      it('should throw InvalidTimeException (time: 1290)', async () => {
        const input: AddInput = {
          userId: 'id',
          time: 1290,
          day: [Day.monday,Day.tuesday],
          routineId: 'routineId'
        }

        mockUserRepository.findOne.mockResolvedValue('user');
        mockAlarmRepository.create.mockResolvedValue(undefined);
  
        expect(alarmService.add(input)).rejects.toThrow(InvalidTimeException);
      })

      it('should return nothing', async () => {
        const input: AddInput = {
          userId: 'id',
          time: 1230,
          day: [Day.monday,Day.tuesday],
          routineId: 'routineId'
        }

        mockUserRepository.findOne.mockResolvedValue('user');
        mockAlarmRepository.create.mockResolvedValue(undefined);
  
        expect(alarmService.add(input)).resolves;
      })
    })

    

  })

  
});
