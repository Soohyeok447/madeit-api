import { Day } from 'src/domain/__common__/enums/day.enum';

export class UpdateAlarmInput {
  userId: string;

  alarmId: string;

  alias?: string;

  time: number;

  day: Day[];

  routineId: string;
}
