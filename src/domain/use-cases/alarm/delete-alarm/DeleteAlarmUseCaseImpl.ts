import { Injectable } from '@nestjs/common';
import { AlarmRepository } from '../../../../domain/repositories/alarm/AlarmRepository';
import { DeleteAlarmResponse } from '../response.index';
import { AlarmCommonService } from '../service/AlarmCommonService';
import { DeleteAlarmUseCase } from './DeleteAlarmUseCase';
import { DeleteAlarmUsecaseParams } from './dtos/DeleteAlarmUsecaseParams';

@Injectable()
export class DeleteAlarmUseCaseImpl implements DeleteAlarmUseCase {
  constructor(
    private readonly _alarmService: AlarmCommonService,
    private readonly _alarmRepository: AlarmRepository,
  ) {}

  public async execute({
    userId,
    alarmId,
  }: DeleteAlarmUsecaseParams): DeleteAlarmResponse {
    await this._alarmService.assertUser(userId);

    await this._alarmService.assertAlarm(alarmId);

    await this._alarmRepository.delete(alarmId);
  }
}
