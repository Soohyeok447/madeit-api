import { Injectable } from '@nestjs/common';
import { AlarmModel } from '../../../../domain/models/AlarmModel';
import { AlarmRepository } from '../../../../domain/repositories/alarm/AlarmRepository';
import { UpdateAlarmDto } from '../../../../domain/repositories/alarm/dtos/UpdateAlarmDto';
import { RoutineRepository } from '../../../repositories/routine/RoutineRepository';
import { UserRepository } from '../../../repositories/user/UserRepository';
import { AlarmNotFoundException } from '../common/exceptions/AlarmNotFoundException';
import { UpdateAlarmResponse } from '../response.index';
import { CommonAlarmService } from '../service/CommonAlarmService';
import { UpdateAlarmUsecaseParams } from './dtos/UpdateAlarmUsecaseParams';
import { UpdateAlarmUseCase } from './UpdateAlarmUseCase';

@Injectable()
export class UpdateAlarmUseCaseImpl implements UpdateAlarmUseCase {
  constructor(
    private readonly _alarmRepository: AlarmRepository,
    private readonly _userRepository: UserRepository,
    private readonly _routineRepository: RoutineRepository,

  ) { }

  public async execute({
    userId,
    alarmId,
    label,
    time,
    days,
    routineId,
  }: UpdateAlarmUsecaseParams): UpdateAlarmResponse {
    const user = await this._userRepository.findOne(userId);
    await CommonAlarmService.assertUser(user);

    const alarm = await this._alarmRepository.findOne(alarmId);
    await CommonAlarmService.assertAlarm(alarm);

    CommonAlarmService.assertTime(time);

    const routine = await this._routineRepository.findOne(routineId);
    await CommonAlarmService.assertRoutine(routine);

    const alarms = await this._alarmRepository.findAllByUserId(userId);

    const existAlarms: AlarmModel[] = alarms;

    //new alarm object to update
    const newAlarm: UpdateAlarmDto = CommonAlarmService.convertToAlarmObj({ userId, label, time, days, routineId });

    if (alarms.length) {
      //각각의 요일에 대한 시간 중복검사
      CommonAlarmService.assertDuplicateDate(newAlarm, existAlarms, alarmId);
    }

    await this._alarmRepository.update(alarmId, newAlarm);
  }
}
