import { Alarm } from '../../models/alarm.model';
import { CreateAlarmDto } from './dtos/create.dto';
import { UpdateAlarmDto } from './dtos/update.dto';

export abstract class AlarmRepository {
  abstract create(data: CreateAlarmDto): Promise<void>;

  abstract update(
    userId: string,
    alarmId: string,
    data: UpdateAlarmDto,
  ): Promise<void>;

  abstract delete(alarmId: string): Promise<void>;

  abstract findAll(userId: string): Promise<Alarm[]>;

  abstract findOne(alarmId: string): Promise<Alarm>;
}
