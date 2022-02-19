import { Injectable } from '@nestjs/common';
import { AlarmModel } from '../../../../domain/models/AlarmModel';
import { RoutineModel } from '../../../../domain/models/RoutineModel';
import { AlarmRepository } from '../../../repositories/alarm/AlarmRepository';
import { UserRepository } from '../../../repositories/user/UserRepository';
import { GetAlarmResponse } from '../response.index';
import { CommonAlarmService } from '../service/CommonAlarmService';
import { GetAlarmResponseDto } from './dtos/GetAlarmResponseDto';
import { GetAlarmUsecaseParams } from './dtos/GetAlarmUsecaseParams';
import { GetAlarmUseCase } from './GetAlarmUseCase';

@Injectable()
export class GetAlarmUseCaseImpl implements GetAlarmUseCase {
  constructor(
    private readonly _userRepository: UserRepository,
    private readonly _alarmRepository: AlarmRepository,

  ) { }

  public async execute({
    userId,
    alarmId,
  }: GetAlarmUsecaseParams): GetAlarmResponse {
    const user = await this._userRepository.findOne(userId);
    await CommonAlarmService.assertUser(user);

    const alarm = await this._alarmRepository.findOne(alarmId);
    await CommonAlarmService.assertAlarm(alarm);

    const output: GetAlarmResponseDto = this.mapAlarm(alarm);

    return output;
  }

  private mapAlarm(alarm: AlarmModel): GetAlarmResponseDto {
    return {
      alarmId: alarm['id'],
      label: alarm['label'],
      time: alarm['time'],
      days: [...alarm['days']],
      routineId: alarm['routineId'],
    };
  }
}
