import { Day } from '../../../../../domain/enums/Day';

export class UpdateAlarmUsecaseParams {
  userId: string;

  alarmId: string;

  label?: string;

  time: string;

  days: Day[];

  routineId: string;
}
