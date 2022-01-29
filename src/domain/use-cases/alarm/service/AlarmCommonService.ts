import { Injectable } from '@nestjs/common';
import { AlarmModel } from 'src/domain/models/AlarmModel';
import { CreateAlarmDto } from 'src/domain/repositories/alarm/dtos/CreateAlarmDto';
import { UpdateAlarmDto } from 'src/domain/repositories/alarm/dtos/UpdateAlarmDto';

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
