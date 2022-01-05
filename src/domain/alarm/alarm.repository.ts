import { Alarm } from './alarm.model';
import { CreateDto } from './common/dtos/create.dto';
import { UpdateDto } from './common/dtos/update.dto';

export abstract class AlarmRepository {
  abstract create(data: CreateDto): Promise<void>;

  abstract update(
    userId: string,
    alarmId: string,
    data: UpdateDto,
  ): Promise<void>;

  abstract delete(alarmId: string): Promise<void>;

  abstract findAll(userId: string): Promise<Alarm[]>;

  abstract findOne(alarmId: string): Promise<Alarm>;
}
