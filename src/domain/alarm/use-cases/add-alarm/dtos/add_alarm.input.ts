import { Day } from 'src/domain/__common__/enums/day.enum';

export class AddAlarmInput {
  userId: string;

  alias?: string;

  time: number;

  day: Day[];

  routineId: string;
}
