import { Day } from 'src/domain/enums/Day';

export class UpdateAlarmUsecaseParams {
  userId: string;

  alarmId: string;

  label?: string;

  time: string;

  day: Day[];

  routineId: string;
}
