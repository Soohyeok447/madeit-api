import { Day } from '../../../../../domain/enums/Day';

export class UpdateAlarmUsecaseParams {
  userId: string;

  alarmId: string;

  label?: string;

  time: string;

  day: Day[];

  routineId: string;
}
