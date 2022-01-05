import { Day } from '../common/enums/day.enum';

export class Alarm {
  userId: string;

  label: string;

  time: number;

  day: Day[];

  routineId: string;
}
