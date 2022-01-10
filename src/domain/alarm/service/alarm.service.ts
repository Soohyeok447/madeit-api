import { Injectable } from '@nestjs/common';
import { AddAlarmInput } from '../use-cases/add-alarm/dtos/add_alarm.input';
import { DeleteAlarmInput } from '../use-cases/delete-alarm/dtos/delete_alarm.input';
import { GetAllAlarmsInput } from '../use-cases/get-all-alarms/dtos/get_all_alarms.input';
import { UpdateAlarmInput } from '../use-cases/update-alarm/dtos/update_alarm.input';
import { AlarmConflictException } from '../common/exceptions/alarm_conflict.exception';
import { AlarmNotFoundException } from '../../../infrastructure/exceptions/alarm_not_found.exception';
import { InvalidTimeException } from '../common/exceptions/invalid_time.exception';
import { UserNotFoundException } from '../../common/exceptions/user_not_found.exception';
import { AlarmRepository } from '../../common/repositories/alarm/alarm.repository';
import { UserRepository } from '../../common/repositories/user/users.repository';
import { AlarmService } from './interface/alarm.service';
import { RoutineRepository } from '../../common/repositories/routine/routine.repsotiroy';
import { RoutineNotFoundException } from '../../common/exceptions/routine_not_found.exception';
import { GetAlarmInput } from '../use-cases/get-alarm/dtos/get_alarm.input';
import { Alarm } from '../../common/models/alarm.model';
import { Routine } from '../../common/models/routine.model';
import { GetAllAlarmsOutput } from '../use-cases/get-all-alarms/dtos/get_all_alarms.output';
import { GetAlarmOutput } from '../use-cases/get-alarm/dtos/get_alarm.output';

@Injectable()
export class AlarmServiceImpl implements AlarmService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly alarmRepository: AlarmRepository,
    private readonly routineRepository: RoutineRepository,
  ) {}

  public async getAlarm({ userId, alarmId }: GetAlarmInput): Promise<GetAlarmOutput> {
  
    await this.assertUser(userId);

    const alarm: Alarm = await this.assertAlarm(alarmId);

    const routine: Routine = await this.assertRoutine(alarm.routineId);

    const output: GetAlarmOutput = {
      alarmId: alarm['id'],
      label: alarm['label'],
      time: alarm['time'],
      day: [...alarm['day']],
      routineId: alarm['routineId'],
      routineName: routine['name'],
    };

    return output;
  }

  public async getAllAlarms({ userId }: GetAllAlarmsInput): Promise<GetAllAlarmsOutput[]> {
    await this.assertUser(userId);

    const alarms: Alarm[] = await this.alarmRepository.findAll(userId);

    if (!alarms) {
      throw new AlarmNotFoundException('알람이 없음');
    }

    const output: GetAllAlarmsOutput[] = [];

    for (const alarm of alarms) {
      const routine = await this.routineRepository.findOne(alarm.routineId);

      const mapping = {
        alarmId: alarm['_id'],
        routineId: alarm['routine_id'],
        time: alarm['time'],
        label: alarm['label'],
        day: alarm['day'],
        routineName: routine['name'],
      };

      output.push(mapping);
    }

    return output;
  }

  public async addAlarm({
    userId,
    alias,
    time,
    day,
    routineId,
  }: AddAlarmInput): Promise<void> {
    const alarm = {
      userId,
      alias,
      time,
      day,
      routineId,
    };

    await this.assertUser(userId);

    await this.assertRoutine(routineId);

    this.assertTime(time);

    await this.alarmRepository.create(alarm);
  }

  public async updateAlarm({
    userId,
    alarmId,
    alias,
    time,
    day,
    routineId,
  }: UpdateAlarmInput): Promise<void> {
    const input = {
      alias,
      time,
      day,
      routineId,
    };

    await this.assertUser(userId);

    await this.assertRoutine(routineId);

    this.assertTime(time);

    await this.alarmRepository.update(userId, alarmId, input);
  }

  private async assertRoutine(routineId: string) {
    const routine = await this.routineRepository.findOne(routineId);

    if (!routine) {
      throw new RoutineNotFoundException();
    }

    return routine;
  }

  public async deleteAlarm({ userId, alarmId }: DeleteAlarmInput): Promise<void> {

    await this.assertUser(userId);

    await this.assertAlarm(alarmId);

    await this.alarmRepository.delete(alarmId);
  }

  private async assertUser(userId: string) {
    const user = await this.userRepository.findOne(userId);

    if (!user) {
      throw new UserNotFoundException();
    }
  }

  private assertTime(time: number) {
    const stringTime: string = time.toString();

    if (
      +stringTime[2] > 5 || //60분 초과
      time < 1 || //0000 이하
      time > 2400 || // 2400 초과
      time.toString().length !== 4 // time이 4자리가 아니면
    ) {
      throw new InvalidTimeException(`유효하지않은 time ${time}`);
    }
  }

  private async assertAlarm(alarmId: string) {
    const alarm = await this.alarmRepository.findOne(alarmId);

    if (!alarm) {
      throw new AlarmNotFoundException('알람이 없음');
    }
    return alarm;
  }
}
