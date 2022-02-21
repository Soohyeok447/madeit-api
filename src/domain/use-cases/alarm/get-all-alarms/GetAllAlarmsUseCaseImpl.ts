import { Injectable } from '@nestjs/common';
import { AlarmModel } from '../../../../domain/models/AlarmModel';
import { AlarmRepository } from '../../../../domain/repositories/alarm/AlarmRepository';
import { RoutineRepository } from '../../../../domain/repositories/routine/RoutineRepository';
import { UserRepository } from '../../../repositories/user/UserRepository';
import { AlarmNotFoundException } from '../common/exceptions/AlarmNotFoundException';
import { GetAllAlarmsResponse } from '../response.index';
import { CommonAlarmService } from '../service/CommonAlarmService';
import { GetAllAlarmsResponseDto } from './dtos/GetAllAlarmsResponseDto';
import { GetAllAlarmsUsecaseParams } from './dtos/GetAllAlarmsUsecaseParams';
import { GetAllAlarmsUseCase } from './GetAllAlarmsUseCase';

@Injectable()
export class GetAllAlarmsUseCaseImpl implements GetAllAlarmsUseCase {
  constructor(
    private readonly _alarmRepository: AlarmRepository,
    private readonly _userRepository: UserRepository,

  ) { }

  public async execute({
    userId,
  }: GetAllAlarmsUsecaseParams): GetAllAlarmsResponse {
    const user = await this._userRepository.findOne(userId);
    await CommonAlarmService.assertUser(user);

    const alarms: AlarmModel[] = await this._alarmRepository.findAllByUserId(
      userId,
    );

    if (!alarms.length) return [];

    const output: GetAllAlarmsResponseDto[] = [];

    for (const alarm of alarms) {
      const mappedAlarm = this.mapAlarm(alarm);

      output.push(mappedAlarm);
    }

    return output;
  }

  private mapAlarm(alarm: AlarmModel) {
    return {
      alarmId: alarm['_id'],
      routineId: alarm['routine_id'],
      time: alarm['time'],
      label: alarm['label'],
      days: alarm['days'],
    };
  }
}
