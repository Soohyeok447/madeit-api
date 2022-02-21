import { Injectable } from '@nestjs/common';
import { AlarmRepository } from '../../../../domain/repositories/alarm/AlarmRepository';
import { UserRepository } from '../../../repositories/user/UserRepository';
import { DeleteAlarmResponse } from '../response.index';
import { CommonAlarmService } from '../service/CommonAlarmService';
import { DeleteAlarmUseCase } from './DeleteAlarmUseCase';
import { DeleteAlarmUsecaseParams } from './dtos/DeleteAlarmUsecaseParams';

@Injectable()
export class DeleteAlarmUseCaseImpl implements DeleteAlarmUseCase {
  constructor(
    private readonly _alarmRepository: AlarmRepository,
    private readonly _userRepository: UserRepository,

  ) { }

  public async execute({
    userId,
    alarmId,
  }: DeleteAlarmUsecaseParams): DeleteAlarmResponse {
    const user = await this._userRepository.findOne(userId);
    await CommonAlarmService.assertUser(user);

    const alarm = await this._alarmRepository.findOne(alarmId);
    await CommonAlarmService.assertAlarm(alarm);

    await this._alarmRepository.delete(alarmId);
  }
}
