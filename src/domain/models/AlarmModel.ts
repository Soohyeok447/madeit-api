import { Day } from '../enums/Day';

export class AlarmModel {
  userId: string;

  label: string;

  time: number;

  day: Day[];

  routineId: string;
}
