import { Day } from 'src/domain/enums/Day';

export class UpdateAlarmUsecaseDto {
  userId: string;

  alarmId: string;

  alias?: string;

  time: number;

  day: Day[];

  routineId: string;
}
