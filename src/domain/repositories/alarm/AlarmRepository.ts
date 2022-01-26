import { AlarmModel } from '../../models/AlarmModel';
import { CreateAlarmDto } from './dtos/CreateAlarmDto';
import { UpdateAlarmDto } from './dtos/UpdateAlarmDto';

export abstract class AlarmRepository {
  abstract create(data: CreateAlarmDto): Promise<void>;

  abstract update(
    userId: string,
    alarmId: string,
    data: UpdateAlarmDto,
  ): Promise<void>;

  abstract delete(alarmId: string): Promise<void>;

  abstract findAll(userId: string): Promise<AlarmModel[]>;

  abstract findOne(alarmId: string): Promise<AlarmModel>;
}
