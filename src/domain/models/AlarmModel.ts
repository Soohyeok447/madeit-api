import { Day } from '../enums/Day';

export class AlarmModel {
  userId: string;

  label: string;

  time: string;

  days: Day[];

  routineId: string;
}
