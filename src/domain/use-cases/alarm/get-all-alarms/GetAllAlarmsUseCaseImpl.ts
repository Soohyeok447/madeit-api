import { Injectable } from '@nestjs/common';
import { AlarmModel } from '../../../../domain/models/AlarmModel';
import { AlarmRepository } from '../../../../domain/repositories/alarm/AlarmRepository';
import { RoutineRepository } from '../../../../domain/repositories/routine/RoutineRepository';
import { AlarmNotFoundException } from '../common/exceptions/AlarmNotFoundException';
import { GetAllAlarmsResponse } from '../response.index';
import { AlarmCommonService } from '../service/AlarmCommonService';
import { GetAllAlarmsResponseDto } from './dtos/GetAllAlarmsResponseDto';
import { GetAllAlarmsUsecaseParams } from './dtos/GetAllAlarmsUsecaseParams';
import { GetAllAlarmsUseCase } from './GetAllAlarmsUseCase';

@Injectable()
export class GetAllAlarmsUseCaseImpl implements GetAllAlarmsUseCase {
  constructor(
    private readonly _alarmRepository: AlarmRepository,
    private readonly _routineRepository: RoutineRepository,
    private readonly _alarmService: AlarmCommonService,
  ) {}

  public async execute({
    userId,
  }: GetAllAlarmsUsecaseParams): GetAllAlarmsResponse {
    await this._alarmService.assertUser(userId);

    const alarms: AlarmModel[] = await this._alarmRepository.findAllByUserId(
      userId,
    );

    if (!alarms.length) {
      return [];
    }

    const output: GetAllAlarmsResponseDto[] = [];

    for (const alarm of alarms) {
      const mapping = {
        alarmId: alarm['_id'],
        routineId: alarm['routine_id'],
        time: alarm['time'],
        label: alarm['label'],
        day: alarm['day'],
      };

      output.push(mapping);
    }

    return output;
  }
}
