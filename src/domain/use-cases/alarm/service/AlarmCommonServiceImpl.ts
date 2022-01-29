import { Injectable } from '@nestjs/common';
import { AlarmCommonService } from './AlarmCommonService';
import { UserRepository } from '../../../repositories/user/UserRepository';
import { AlarmRepository } from '../../../repositories/alarm/AlarmRepository';
import { RoutineRepository } from '../../../repositories/routine/RoutineRepository';
import { AlarmModel } from '../../../models/AlarmModel';
import { AlarmNotFoundException } from '../common/exceptions/AlarmNotFoundException';
import { RoutineNotFoundException } from '../../../common/exceptions/RoutineNotFoundException';
import { UserNotFoundException } from '../../../common/exceptions/UserNotFoundException';
import { InvalidTimeException } from '../common/exceptions/InvalidTimeException';
import { ConflictAlarmException } from '../common/exceptions/ConflictAlarmException';
import { Day } from '../../../enums/Day';
import { CreateAlarmDto } from '../../../repositories/alarm/dtos/CreateAlarmDto';
import { UpdateAlarmDto } from '../../../repositories/alarm/dtos/UpdateAlarmDto';

@Injectable()
export class AlarmCommonServiceImpl implements AlarmCommonService {
  constructor(
    public readonly _userRepository: UserRepository,
    public readonly _alarmRepository: AlarmRepository,
    public readonly _routineRepository: RoutineRepository,
  ) {}

  public assertDuplicateDate(
    newAlarm: CreateAlarmDto | UpdateAlarmDto,
    alarms: AlarmModel[],
    alarmId?: string,
  ) {
    //중복 검사 결과
    let assertResult: boolean;

    //중복된 요일
    const conflictDay: Day[] = [];

    //현재 수정중인 알람 중복체크에서 제거
    if (alarmId) {
      const index = alarms.findIndex((e) => e['_id'] == alarmId);

      alarms.splice(index, 1);
    }

    newAlarm.day.forEach((day) => {
      alarms.find((alarm) => {
        alarm.day.find((e) => {
          if (e == day && alarm.time == +newAlarm.time) {
            conflictDay.push(e);

            assertResult = true;
          }
        });
      });
    });

    if (assertResult) {
      throw new ConflictAlarmException(conflictDay, newAlarm.time);
    }
  }

  public async assertRoutine(routineId: string) {
    const routine = await this._routineRepository.findOne(routineId);

    if (!routine) {
      throw new RoutineNotFoundException();
    }

    return routine;
  }

  public async assertUser(userId: string) {
    const user = await this._userRepository.findOne(userId);

    if (!user) {
      throw new UserNotFoundException();
    }
  }

  public assertTime(time: string) {
    const numberTime: number = +time;

    if (
      +time[2] > 5 || //60분 초과
      numberTime < 1 || //0000 이하
      numberTime > 2400 || // 2400 초과
      time.toString().length !== 4 // time이 4자리가 아니면
    ) {
      throw new InvalidTimeException(time);
    }
  }

  public async assertAlarm(alarmId: string) {
    const alarm = await this._alarmRepository.findOne(alarmId);

    if (!alarm) {
      throw new AlarmNotFoundException();
    }

    return alarm;
  }
}
