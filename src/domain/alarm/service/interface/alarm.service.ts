import { Injectable } from '@nestjs/common';
import { AddAlarmInput } from 'src/domain/alarm/use-cases/add-alarm/dtos/add_alarm.input';
import { DeleteAlarmInput } from 'src/domain/alarm/use-cases/delete-alarm/dtos/delete_alarm.input';
import { GetAlarmInput } from 'src/domain/alarm/use-cases/get-alarm/dtos/get_alarm.input';
import { GetAllAlarmsInput } from 'src/domain/alarm/use-cases/get-all-alarms/dtos/get_all_alarms.input';

import { UpdateAlarmInput } from 'src/domain/alarm/use-cases/update-alarm/dtos/update_alarm.input';
import { GetAlarmOutput } from '../../use-cases/get-alarm/dtos/get_alarm.output';
import { GetAllAlarmsOutput } from '../../use-cases/get-all-alarms/dtos/get_all_alarms.output';

@Injectable()
export abstract class AlarmService {
  /**
   * 유저의 알람을 가져옴
   */
  public abstract getAlarm({ userId, alarmId }: GetAlarmInput): Promise<GetAlarmOutput>;

  /**
   * 유저의 알람 리스트를 가져옴
   */
  public abstract getAllAlarms({ userId }: GetAllAlarmsInput): Promise<GetAllAlarmsOutput[]>;

  /**
   * 알람 추가
   */
  public abstract addAlarm({
    userId,
    alias,
    time,
    day,
    routineId,
  }: AddAlarmInput): Promise<void>;

  /**
   * 알람 수정
   */
  public abstract updateAlarm({
    userId,
    alarmId,
    alias,
    time,
    day,
    routineId,
  }: UpdateAlarmInput): Promise<void>;

  /**
   * 알람 제거
   */
  public abstract deleteAlarm({ userId, alarmId }: DeleteAlarmInput): Promise<void>;
}
