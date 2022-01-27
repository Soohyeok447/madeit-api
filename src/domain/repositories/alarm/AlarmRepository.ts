import { AlarmModel } from '../../models/AlarmModel';
import { CreateAlarmDto } from './dtos/CreateAlarmDto';
import { UpdateAlarmDto } from './dtos/UpdateAlarmDto';

export abstract class AlarmRepository {
  abstract create(data: CreateAlarmDto): Promise<AlarmModel>;

  abstract update(id: string, data: UpdateAlarmDto): Promise<void>;

  abstract delete(id: string): Promise<void>;

  abstract findAllByUserId(userId: string): Promise<AlarmModel[] | []>;

  abstract findOne(id: string): Promise<AlarmModel | null>;
}
