import { Injectable } from '@nestjs/common';
import { AddAlarmUsecaseDto } from '../use-cases/add-alarm/dtos/AddAlarmUsecaseDto';
import { GetAllAlarmsUsecaseDto } from '../use-cases/get-all-alarms/dtos/GetAllAlarmsUsecaseDto';
import { UpdateAlarmUsecaseDto } from '../use-cases/update-alarm/dtos/UpdateAlarmUsecaseDto';
import { AlarmConflictException } from '../common/exceptions/AlarmConflictException';
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
import { RoutineNotFoundException } from '../../../../domain/exception/RoutineNotFoundException';
import { UserNotFoundException } from '../../../../domain/exception/UserNotFoundException';
import { InvalidTimeException } from '../common/exceptions/InvalidTimeException';
import { DeleteAlarmUsecaseDto } from '../use-cases/delete-alarm/dtos/DeleteAlarmUsecaseDto';

@Injectable()
export class AlarmServiceImpl implements AlarmService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly alarmRepository: AlarmRepository,
    private readonly routineRepository: RoutineRepository,
  ) {}

  public async getAlarm({
    userId,
    alarmId,
  }: GetAlarmUsecaseDto): Promise<GetAlarmResponseDto> {
    await this.assertUser(userId);

    const alarm: AlarmModel = await this.assertAlarm(alarmId);

    const routine: RoutineModel = await this.assertRoutine(alarm.routineId);

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

    const alarms: AlarmModel[] = await this.alarmRepository.findAll(userId);

    if (!alarms) {
      throw new AlarmNotFoundException('알람이 없음');
    }

    const output: GetAllAlarmsResponseDto[] = [];

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
  }: AddAlarmUsecaseDto): Promise<void> {
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
  }: UpdateAlarmUsecaseDto): Promise<void> {
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

  public async deleteAlarm({
    userId,
    alarmId,
  }: DeleteAlarmUsecaseDto): Promise<void> {
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
