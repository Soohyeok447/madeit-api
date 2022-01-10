import { Test } from '@nestjs/testing';
import { UserRepository } from '../../../src/domain/common/repositories/user/users.repository';

import { AddAlarmInput } from '../../../src/domain/alarm/use-cases/add-alarm/dtos/add_alarm.input';
import { AlarmRepository } from '../../../src/domain/common/repositories/alarm/alarm.repository';
import { UpdateAlarmInput } from '../../../src/domain/alarm/use-cases/update-alarm/dtos/update_alarm.input';
import { AlarmNotFoundException } from '../../../src/infrastructure/exceptions/alarm_not_found.exception';
import { ConflictAlarmException } from '../../../src/infrastructure/exceptions/conflict_alarm.exception';
import { GetAlarmInput } from '../../../src/domain/alarm/use-cases/get-alarm/dtos/get_alarm.input';
import { DeleteAlarmInput } from '../../../src/domain/alarm/use-cases/delete-alarm/dtos/delete_alarm.input';
import { GetAllAlarmsInput } from '../../../src/domain/alarm/use-cases/get-all-alarms/dtos/get_all_alarms.input';
import { AlarmService } from 'src/domain/alarm/service/interface/alarm.service';
import { AlarmServiceImpl } from 'src/domain/alarm/service/alarm.service';
import { RoutineRepository } from 'src/domain/common/repositories/routine/routine.repsotiroy';
import { Day } from 'src/domain/common/enums/day.enum';
import { UserNotFoundException } from 'src/domain/common/exceptions/user_not_found.exception';
import { InvalidTimeException } from 'src/domain/alarm/common/exceptions/invalid_time.exception';
import { RoutineNotFoundException } from 'src/domain/common/exceptions/routine_not_found.exception';


const mockUserRepository = {
  findOne: jest.fn(),
};

const mockAlarmRepository = {
  create: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  findAll: jest.fn(),
};

const mockRoutineRepository = {
  findOne: jest.fn(),
};

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
        {
          provide: RoutineRepository,
          useValue: mockRoutineRepository,
        },
      ],
    }).compile();

    alarmService = moduleRef.get<AlarmService>(AlarmService);
  });

  it('should be defined', async () => {
    expect(alarmService).toBeDefined();
  });

  describe('add()', () => {
    describe('no user', () => {
      it('should throw UserNotFoundException', async () => {
        const input: AddAlarmInput = {
          userId: '123456789012345678901234',
          time: 0,
          day: [Day.monday, Day.tuesday],
          routineId: '123456789012345678901234',
        };

        mockUserRepository.findOne.mockResolvedValue(undefined);
        mockAlarmRepository.create.mockResolvedValue(undefined);
        mockRoutineRepository.findOne.mockResolvedValue('routine');

        expect(alarmService.addAlarm(input)).rejects.toThrow(UserNotFoundException);
      });
    });

    describe('received an wrong time property', () => {
      it('should throw InvalidTimeException (time: 0)', async () => {
        const input: AddAlarmInput = {
          userId: '123456789012345678901234',
          time: 0,
          day: [Day.monday, Day.tuesday],
          routineId: '123456789012345678901234',
        };

        mockUserRepository.findOne.mockResolvedValue('user');
        mockAlarmRepository.create.mockResolvedValue(undefined);
        mockRoutineRepository.findOne.mockResolvedValue('routine');

        expect(alarmService.addAlarm(input)).rejects.toThrow(InvalidTimeException);
      });

      it('should throw InvalidTimeException (time: 2401)', async () => {
        const input: AddAlarmInput = {
          userId: '123456789012345678901234',
          time: 2401,
          day: [Day.monday, Day.tuesday],
          routineId: '123456789012345678901234',
        };

        mockUserRepository.findOne.mockResolvedValue('user');
        mockAlarmRepository.create.mockResolvedValue(undefined);
        mockRoutineRepository.findOne.mockResolvedValue('routine');

        expect(alarmService.addAlarm(input)).rejects.toThrow(InvalidTimeException);
      });

      it('should throw InvalidTimeException (time: 123)', async () => {
        const input: AddAlarmInput = {
          userId: '123456789012345678901234',
          time: 123,
          day: [Day.monday, Day.tuesday],
          routineId: '123456789012345678901234',
        };

        mockUserRepository.findOne.mockResolvedValue('user');
        mockAlarmRepository.create.mockResolvedValue(undefined);
        mockRoutineRepository.findOne.mockResolvedValue('routine');

        expect(alarmService.addAlarm(input)).rejects.toThrow(InvalidTimeException);
      });

      it('should throw InvalidTimeException (time: 1290)', async () => {
        const input: AddAlarmInput = {
          userId: '123456789012345678901234',
          time: 1290,
          day: [Day.monday, Day.tuesday],
          routineId: '123456789012345678901234',
        };

        mockUserRepository.findOne.mockResolvedValue('user');
        mockAlarmRepository.create.mockResolvedValue(undefined);
        mockRoutineRepository.findOne.mockResolvedValue('routine');

        expect(alarmService.addAlarm(input)).rejects.toThrow(InvalidTimeException);
      });

      it('should return nothing', async () => {
        const input: AddAlarmInput = {
          userId: '123456789012345678901234',
          time: 1230,
          day: [Day.monday, Day.tuesday],
          routineId: '123456789012345678901234',
        };

        mockUserRepository.findOne.mockResolvedValue('user');
        mockAlarmRepository.create.mockResolvedValue(undefined);
        mockRoutineRepository.findOne.mockResolvedValue('routine');

        expect(alarmService.addAlarm(input)).resolves;
      });
    });
  });

  describe('update()', () => {
    describe('received an invalid userId', () => {


      it('should throw UserNotFoundException (invalid id)', async () => {
        const input: UpdateAlarmInput = {
          alarmId: '123456789012345678901234',
          userId: '123456789012345678901234',
          time: 1230,
          day: [Day.monday, Day.tuesday],
          routineId: '123456789012345678901234',
        };

        mockUserRepository.findOne.mockResolvedValue(undefined);
        mockAlarmRepository.create.mockResolvedValue(undefined);

        expect(alarmService.updateAlarm(input)).rejects.toThrow(
          UserNotFoundException,
        );
      });
    });

    describe('received an invalid routineId', () => {


      it('should throw RoutineNotFoundException', async () => {
        const input: UpdateAlarmInput = {
          alarmId: '123456789012345678901234',
          userId: '123456789012345678901234',
          time: 1230,
          day: [Day.monday, Day.tuesday],
          routineId: '123456789012345678901234',
        };

        mockUserRepository.findOne.mockResolvedValue('user');
        mockRoutineRepository.findOne.mockResolvedValue(undefined);

        expect(alarmService.updateAlarm(input)).rejects.toThrow(
          RoutineNotFoundException,
        );
      });
    });

    describe('received an invalid alarmId', () => {


      it('should throw AlarmNotFoundException', async () => {
        const input: UpdateAlarmInput = {
          alarmId: '123456789012345678901234',
          userId: '123456789012345678901234',
          time: 1230,
          day: [Day.monday, Day.tuesday],
          routineId: '123456789012345678901234',
        };

        mockUserRepository.findOne.mockResolvedValue('user');
        mockAlarmRepository.update.mockRejectedValue(
          new AlarmNotFoundException('test'),
        );
        mockRoutineRepository.findOne.mockResolvedValue('routine');

        expect(alarmService.updateAlarm(input)).rejects.toThrow(
          AlarmNotFoundException,
        );
      });

      it('should throw ConflictAlarmException', async () => {
        const input: UpdateAlarmInput = {
          alarmId: '123456789012345678901234',
          userId: '123456789012345678901234',
          time: 1230,
          day: [Day.monday, Day.tuesday],
          routineId: '123456789012345678901234',
        };
        mockUserRepository.findOne.mockResolvedValue('user');
        mockAlarmRepository.update.mockRejectedValue(
          new ConflictAlarmException('test'),
        );
        mockRoutineRepository.findOne.mockResolvedValue('routine');

        expect(alarmService.updateAlarm(input)).rejects.toThrow(
          ConflictAlarmException,
        );
      });
    });
  });

  describe('get()', () => {
    it('should throw UserNotFoundException', async () => {
      const input: GetAlarmInput = {
        userId: '123456789012345678901234',
        alarmId: '123456789012345678901234',
      };

      mockUserRepository.findOne.mockResolvedValue(undefined);

      expect(alarmService.getAlarm(input)).rejects.toThrow(UserNotFoundException);
    });

    it('should throw AlarmNotFoundException', async () => {
      const input: GetAlarmInput = {
        userId: '123456789012345678901234',
        alarmId: '123456789012345678901234',
      };

      mockUserRepository.findOne.mockResolvedValue('user');
      mockAlarmRepository.findOne.mockResolvedValue(undefined);

      expect(alarmService.getAlarm(input)).rejects.toThrow(AlarmNotFoundException);
    });

    it('should throw RoutineNotFoundException', async () => {
      const input: GetAlarmInput = {
        userId: '123456789012345678901234',
        alarmId: '123456789012345678901234',
      };

      mockUserRepository.findOne.mockResolvedValue('user');
      mockAlarmRepository.findOne.mockResolvedValue('alarm');
      mockRoutineRepository.findOne.mockResolvedValue(undefined);

      expect(alarmService.getAlarm(input)).rejects.toThrow(RoutineNotFoundException);
    });

    it('should return an alarm', async () => {
      const input: GetAlarmInput = {
        userId: '123456789012345678901234',
        alarmId: '123456789012345678901234',
      };

      mockUserRepository.findOne.mockResolvedValue('user');
      mockAlarmRepository.findOne.mockResolvedValue({ day: [1, 2, 3] });
      mockRoutineRepository.findOne.mockResolvedValue('routine');

      expect(await alarmService.getAlarm(input));
    });
  });

  describe('delete()', () => {
    it('should throw UserNotFoundException', async () => {
      const input: DeleteAlarmInput = {
        userId: '123456789012345678901234',
        alarmId: '123456789012345678901234',
      };

      mockUserRepository.findOne.mockResolvedValue(undefined);

      expect(alarmService.deleteAlarm(input)).rejects.toThrow(UserNotFoundException);
    });

    it('should throw AlarmNotFoundException', async () => {
      const input: DeleteAlarmInput = {
        userId: '123456789012345678901234',
        alarmId: '123456789012345678901234',
      };

      mockUserRepository.findOne.mockResolvedValue('user');
      mockAlarmRepository.findOne.mockResolvedValue(undefined);

      expect(alarmService.deleteAlarm(input)).rejects.toThrow(
        AlarmNotFoundException,
      );
    });

    it('should return nothing (success to delete)', async () => {
      const input: DeleteAlarmInput = {
        userId: '123456789012345678901234',
        alarmId: '123456789012345678901234',
      };

      mockUserRepository.findOne.mockResolvedValue('user');
      mockAlarmRepository.findOne.mockResolvedValue('alarm');
      mockAlarmRepository.delete.mockResolvedValue(undefined);

      expect(await alarmService.deleteAlarm(input));
    });
  });

  describe('getAll()', () => {
    it('should throw UserNotFoundException', async () => {
      const input: GetAllAlarmsInput = {
        userId: '123456789012345678901234',
      };

      mockUserRepository.findOne.mockResolvedValue(undefined);
      mockRoutineRepository.findOne.mockResolvedValue(undefined);

      expect(alarmService.getAllAlarms(input)).rejects.toThrow(UserNotFoundException);
    });

    it('should throw AlarmNotFoundException', async () => {
      const input: GetAllAlarmsInput = {
        userId: '123456789012345678901234',
      };

      mockUserRepository.findOne.mockResolvedValue('user');
      mockAlarmRepository.findAll.mockResolvedValue(undefined);

      expect(alarmService.getAllAlarms(input)).rejects.toThrow(
        AlarmNotFoundException,
      );
    });

    it('should return alarm list', async () => {
      const input: GetAllAlarmsInput = {
        userId: '123456789012345678901234',
      };

      mockUserRepository.findOne.mockResolvedValue('user');

      mockAlarmRepository.findAll.mockResolvedValue([
        {
          alarmId: '61d409ae62127c47db83991d',
          routineId: '61c96ade855f2be5c3a42288',
          time: 1430,
          day: ['monday', 'thursday'],
          routineName: '청소 하기',
        },
        {
          alarmId: '61d411c17473b51d99f06fbd',
          routineId: '61c96ade855f2be5c3a42288',
          time: 1430,
          day: ['friday'],
          routineName: '청소 하기',
        },
        {
          alarmId: '61d41778cdbab5d82d0919a1',
          routineId: '61c96ade855f2be5c3a42288',
          time: 1440,
          day: ['monday', 'wednesday'],
          routineName: '청소 하기',
        },
      ]);
      mockRoutineRepository.findOne.mockResolvedValue({ name: 'asdf' });

      expect(await alarmService.getAllAlarms(input));
    });
  });
});
