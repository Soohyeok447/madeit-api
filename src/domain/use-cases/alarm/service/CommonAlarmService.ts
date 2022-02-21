import { Injectable } from '@nestjs/common';
import { AlarmModel } from '../../../models/AlarmModel';
import { AlarmNotFoundException } from '../common/exceptions/AlarmNotFoundException';
import { RoutineNotFoundException } from '../../../common/exceptions/RoutineNotFoundException';
import { UserNotFoundException } from '../../../common/exceptions/UserNotFoundException';
import { InvalidTimeException } from '../common/exceptions/InvalidTimeException';
import { ConflictAlarmException } from '../common/exceptions/ConflictAlarmException';
import { Day } from '../../../enums/Day';
import { CreateAlarmDto } from '../../../repositories/alarm/dtos/CreateAlarmDto';
import { UpdateAlarmDto } from '../../../repositories/alarm/dtos/UpdateAlarmDto';
import { RoutineModel } from '../../../models/RoutineModel';
import { UserModel } from '../../../models/UserModel';

@Injectable()
export class CommonAlarmService {

  static assertDuplicateDate(
    newAlarm: CreateAlarmDto | UpdateAlarmDto,
    alarms: AlarmModel[],
    alarmId?: string,
  ) {
    let deepAlarms: AlarmModel[] = JSON.parse(JSON.stringify(alarms));

    //중복 검사 결과
    let assertResult: boolean;

    //중복된 요일
    let conflictDay: Day[] = [];

    //현재 수정중인 알람 중복체크에서 제거
    if (alarmId) {
      const index = deepAlarms.findIndex(e => e['_id'] === alarmId);

      deepAlarms.splice(index, 1);
    }

    newAlarm.days.forEach(day => {
      deepAlarms.forEach(alarm => {
        alarm.days.forEach(e => {
          if (e === day && +alarm.time === +newAlarm.time) {
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

  static async assertRoutine(routine: RoutineModel) {
    if (!routine) {
      throw new RoutineNotFoundException();
    }

    return routine;
  }

  static async assertUser(user: UserModel) {
    if (!user) {
      throw new UserNotFoundException();
    }
  }

  static assertTime(time: string) {
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

  static async assertAlarm(alarm: AlarmModel) {
    if (!alarm) {
      throw new AlarmNotFoundException();
    }

    return alarm;
  }

  static convertToAlarmObj({ userId, label, time, days, routineId }): UpdateAlarmDto | CreateAlarmDto {
    return {
      userId,
      label,
      time,
      days,
      routineId,
    };
  }
}
