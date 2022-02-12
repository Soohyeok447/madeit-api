import { Injectable } from '@nestjs/common';
import { AlarmModel } from '../../../../domain/models/AlarmModel';
import { CreateAlarmDto } from '../../../../domain/repositories/alarm/dtos/CreateAlarmDto';
import { UpdateAlarmDto } from '../../../../domain/repositories/alarm/dtos/UpdateAlarmDto';

@Injectable()
export abstract class AlarmCommonService {
  public abstract assertDuplicateDate(
    newAlarm: CreateAlarmDto | UpdateAlarmDto,
    alarms: AlarmModel[],
    alarmId?: string,
  );

  public abstract assertRoutine(routineId: string);

  public abstract assertUser(userId: string);

  public abstract assertTime(time: string);

  public abstract assertAlarm(alarmId: string);
}
