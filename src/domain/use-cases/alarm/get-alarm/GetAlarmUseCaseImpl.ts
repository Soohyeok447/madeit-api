import { Injectable } from '@nestjs/common';
import { AlarmModel } from '../../../../domain/models/AlarmModel';
import { RoutineModel } from '../../../../domain/models/RoutineModel';
import { GetAlarmResponse } from '../response.index';
import { AlarmCommonService } from '../service/AlarmCommonService';
import { GetAlarmResponseDto } from './dtos/GetAlarmResponseDto';
import { GetAlarmUsecaseParams } from './dtos/GetAlarmUsecaseParams';
import { GetAlarmUseCase } from './GetAlarmUseCase';

@Injectable()
export class GetAlarmUseCaseImpl implements GetAlarmUseCase {
  constructor(private readonly _alarmService: AlarmCommonService) {}

  public async execute({
    userId,
    alarmId,
  }: GetAlarmUsecaseParams): GetAlarmResponse {
    await this._alarmService.assertUser(userId);

    const alarm: AlarmModel = await this._alarmService.assertAlarm(alarmId);

    const routine: RoutineModel = await this._alarmService.assertRoutine(
      alarm.routineId,
    );

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
}
