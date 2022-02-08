import { Injectable } from '@nestjs/common';
import { AlarmModel } from '../../../../domain/models/AlarmModel';
import { AlarmRepository } from '../../../../domain/repositories/alarm/AlarmRepository';
import { UpdateAlarmDto } from '../../../../domain/repositories/alarm/dtos/UpdateAlarmDto';
import { AlarmNotFoundException } from '../common/exceptions/AlarmNotFoundException';
import { UpdateAlarmResponse } from '../response.index';
import { AlarmCommonService } from '../service/AlarmCommonService';
import { UpdateAlarmUsecaseParams } from './dtos/UpdateAlarmUsecaseParams';
import { UpdateAlarmUseCase } from './UpdateAlarmUseCase';

@Injectable()
export class UpdateAlarmUseCaseImpl implements UpdateAlarmUseCase {
  constructor(
    private readonly _alarmService: AlarmCommonService,
    private readonly _alarmRepository: AlarmRepository,
  ) { }

  public async execute({
    userId,
    alarmId,
    label,
    time,
    day,
    routineId,
  }: UpdateAlarmUsecaseParams): UpdateAlarmResponse {
    await this._alarmService.assertUser(userId);

    await this._alarmService.assertAlarm(alarmId);
    
    this._alarmService.assertTime(time);
    
    await this._alarmService.assertRoutine(routineId);

    const alarms = await this._alarmRepository.findAllByUserId(userId);

    const existAlarms: AlarmModel[] = alarms;

    //new alarm object to update
    const newAlarm: UpdateAlarmDto = {
      userId,
      label,
      time,
      day,
      routineId,
    };

    if (alarms.length) {
      //각각의 요일에 대한 시간 중복검사
      this._alarmService.assertDuplicateDate(newAlarm, existAlarms, alarmId);
    }

    await this._alarmRepository.update(alarmId, newAlarm);
  }
}
