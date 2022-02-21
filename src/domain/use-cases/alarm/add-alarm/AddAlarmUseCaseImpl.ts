import { Injectable } from '@nestjs/common';
import { AlarmRepository } from '../../../../domain/repositories/alarm/AlarmRepository';
import { AlarmModel } from '../../../../domain/models/AlarmModel';
import { CreateAlarmDto } from '../../../../domain/repositories/alarm/dtos/CreateAlarmDto';
import { AlarmNotFoundException } from '../common/exceptions/AlarmNotFoundException';
import { AddAlarmResponse } from '../response.index';
import { CommonAlarmService } from '../service/CommonAlarmService';
import { AddAlarmUseCase } from './AddAlarmUseCase';
import { AddAlarmUsecaseParams } from './dtos/AddAlarmUsecaseParams';
import { UserRepository } from '../../../repositories/user/UserRepository';
import { RoutineRepository } from '../../../repositories/routine/RoutineRepository';

@Injectable()
export class AddAlarmUseCaseImpl implements AddAlarmUseCase {
  constructor(
    private readonly _alarmRepository: AlarmRepository,
    private readonly _userRepository: UserRepository,
    private readonly _routineRepository: RoutineRepository,

  ) { }

  public async execute({
    userId,
    label,
    time,
    days,
    routineId,
  }: AddAlarmUsecaseParams): AddAlarmResponse {
    const user = await this._userRepository.findOne(userId);
    await CommonAlarmService.assertUser(user);

    const routine = await this._routineRepository.findOne(routineId);
    await CommonAlarmService.assertRoutine(routine);

    CommonAlarmService.assertTime(time);

    const alarms = await this._alarmRepository.findAllByUserId(userId);

    const existAlarms: AlarmModel[] = alarms;

    const newAlarm: CreateAlarmDto = CommonAlarmService.convertToAlarmObj({ userId, label, time, days, routineId });

    if (alarms.length) {
      CommonAlarmService.assertDuplicateDate(newAlarm, existAlarms);
    }

    await this._alarmRepository.create(newAlarm);
  }
}
