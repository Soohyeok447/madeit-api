import { Injectable } from '@nestjs/common';
import { AlarmRepository } from '../../../../domain/repositories/alarm/AlarmRepository';
import { AlarmModel } from '../../../../domain/models/AlarmModel';
import { CreateAlarmDto } from '../../../../domain/repositories/alarm/dtos/CreateAlarmDto';
import { AlarmNotFoundException } from '../common/exceptions/AlarmNotFoundException';
import { AddAlarmResponse } from '../response.index';
import { AlarmCommonService } from '../service/AlarmCommonService';
import { AddAlarmUseCase } from './AddAlarmUseCase';
import { AddAlarmUsecaseParams } from './dtos/AddAlarmUsecaseParams';

@Injectable()
export class AddAlarmUseCaseImpl implements AddAlarmUseCase {
  constructor(
    private readonly _alarmRepository: AlarmRepository,
    private readonly _alarmService: AlarmCommonService,
  ) {}

  public async execute({
    userId,
    label,
    time,
    day,
    routineId,
  }: AddAlarmUsecaseParams): AddAlarmResponse {
    //유저 체크
    await this._alarmService.assertUser(userId);

    //루틴 체크
    await this._alarmService.assertRoutine(routineId);

    //시간 체크
    this._alarmService.assertTime(time);

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
    this._alarmService.assertDuplicateDate(newAlarm, existAlarms);

    await this._alarmRepository.create(newAlarm);
  }
}
