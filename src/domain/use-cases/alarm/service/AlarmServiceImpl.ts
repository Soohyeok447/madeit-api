import { Injectable } from '@nestjs/common';
import { AddAlarmUsecaseDto } from '../use-cases/add-alarm/dtos/AddAlarmUsecaseDto';
import { GetAllAlarmsUsecaseDto } from '../use-cases/get-all-alarms/dtos/GetAllAlarmsUsecaseDto';
import { UpdateAlarmUsecaseDto } from '../use-cases/update-alarm/dtos/UpdateAlarmUsecaseDto';
import { GetAllAlarmsResponseDto } from '../use-cases/get-all-alarms/dtos/GetAllAlarmsResponseDto';
import { GetAlarmResponseDto } from '../use-cases/get-alarm/dtos/GetAlarmResponseDto';
import { AlarmService } from './interface/AlarmService';
import { UserRepository } from '../../../../domain/repositories/user/UserRepository';
import { AlarmRepository } from '../../../../domain/repositories/alarm/AlarmRepository';
import { RoutineRepository } from '../../../../domain/repositories/routine/RoutineRepository';
import { GetAlarmUsecaseDto } from '../use-cases/get-alarm/dtos/GetAlarmUsecaseDto';
import { AlarmModel } from '../../../../domain/models/AlarmModel';
import { RoutineModel } from '../../../../domain/models/RoutineModel';
import { AlarmNotFoundException } from '../common/exceptions/AlarmNotFoundException';
import { RoutineNotFoundException } from '../../../common/exceptions/RoutineNotFoundException';
import { UserNotFoundException } from '../../../common/exceptions/UserNotFoundException';
import { InvalidTimeException } from '../common/exceptions/InvalidTimeException';
import { DeleteAlarmUsecaseDto } from '../use-cases/delete-alarm/dtos/DeleteAlarmUsecaseDto';
import { ConflictAlarmException } from '../common/exceptions/ConflictAlarmException';
import { Day } from '../../../../domain/enums/Day';
import { CreateAlarmDto } from 'src/domain/repositories/alarm/dtos/CreateAlarmDto';
import { UpdateAlarmDto } from 'src/domain/repositories/alarm/dtos/UpdateAlarmDto';

@Injectable()
export class AlarmServiceImpl implements AlarmService {
  constructor(
    private readonly _userRepository: UserRepository,
    private readonly _alarmRepository: AlarmRepository,
    private readonly _routineRepository: RoutineRepository,
  ) {}

  public async getAlarm({
    userId,
    alarmId,
  }: GetAlarmUsecaseDto): Promise<GetAlarmResponseDto> {
    await this.assertUser(userId);

    const alarm: AlarmModel = await this._assertAlarm(alarmId);

    const routine: RoutineModel = await this._assertRoutine(alarm.routineId);

    const output: GetAlarmResponseDto = {
      alarmId: alarm['id'],
      label: alarm['label'],
      time: alarm['time'],
      day: [...alarm['day']],
      routineId: alarm['routineId'],
      routineName: routine['name'],
    };

    return output;
  }

  public async getAllAlarms({
    userId,
  }: GetAllAlarmsUsecaseDto): Promise<GetAllAlarmsResponseDto[]> {
    await this.assertUser(userId);

    const alarms: AlarmModel[] = await this._alarmRepository.findAllByUserId(
      userId,
    );

    if (!alarms) {
      throw new AlarmNotFoundException();
    }

    const output: GetAllAlarmsResponseDto[] = [];

    for (const alarm of alarms) {
      const routine = await this._routineRepository.findOne(alarm.routineId);

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
    label,
    time,
    day,
    routineId,
  }: AddAlarmUsecaseDto): Promise<void> {
    //유저 체크
    await this.assertUser(userId);

    //루틴 체크
    await this._assertRoutine(routineId);

    //시간 체크
    this._assertTime(time);

    const alarms = await this._alarmRepository.findAllByUserId(userId);

    if (!alarms.length) {
      throw new AlarmNotFoundException();
    }

    const existAlarms: AlarmModel[] = alarms;

    //new alarm object to create
    const newAlarm: CreateAlarmDto = {
      userId,
      label,
      time,
      day,
      routineId,
    };

    //각각의 요일에 대한 시간 중복검사
    this._assertDuplicateDate(newAlarm, existAlarms);

    await this._alarmRepository.create(newAlarm);
  }

  private _assertDuplicateDate(
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

  public async updateAlarm({
    userId,
    alarmId,
    label,
    time,
    day,
    routineId,
  }: UpdateAlarmUsecaseDto): Promise<void> {
    await this.assertUser(userId);

    await this._assertRoutine(routineId);

    this._assertTime(time);

    await this._assertAlarm(alarmId);

    const alarms = await this._alarmRepository.findAllByUserId(userId);

    if (!alarms.length) {
      throw new AlarmNotFoundException();
    }

    const existAlarms: AlarmModel[] = alarms;

    //new alarm object to update
    const newAlarm: UpdateAlarmDto = {
      userId,
      label,
      time,
      day,
      routineId,
    };

    //각각의 요일에 대한 시간 중복검사
    this._assertDuplicateDate(newAlarm, existAlarms, alarmId);

    await this._alarmRepository.update(alarmId, newAlarm);
  }

  private async _assertRoutine(routineId: string) {
    const routine = await this._routineRepository.findOne(routineId);

    if (!routine) {
      throw new RoutineNotFoundException();
    }

    return routine;
  }

  public async deleteAlarm({
    userId,
    alarmId,
  }: DeleteAlarmUsecaseDto): Promise<void> {
    await this.assertUser(userId);

    await this._assertAlarm(alarmId);

    await this._alarmRepository.delete(alarmId);
  }

  private async assertUser(userId: string) {
    const user = await this._userRepository.findOne(userId);

    if (!user) {
      throw new UserNotFoundException();
    }
  }

  private _assertTime(time: string) {
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

  private async _assertAlarm(alarmId: string) {
    const alarm = await this._alarmRepository.findOne(alarmId);

    if (!alarm) {
      throw new AlarmNotFoundException();
    }

    return alarm;
  }
}
