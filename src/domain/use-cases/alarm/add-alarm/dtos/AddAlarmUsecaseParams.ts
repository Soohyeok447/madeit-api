import { Day } from '../../../../../domain/enums/Day';

export class AddAlarmUsecaseParams {
  userId: string;

  label?: string;

  time: string;

  day: Day[];

  routineId: string;
}
