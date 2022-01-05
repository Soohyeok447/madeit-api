import { Day } from 'src/domain/common/enums/day.enum';

export class AddAlarmInput {
  userId: string;

  alias?: string;

  time: number;

  day: Day[];

  routineId: string;
}
