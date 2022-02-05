import { Day } from '../enums/Day';

export class AlarmModel {
  userId: string;

  label: string;

  time: string;

  day: Day[];

  routineId: string;
}
