import { Day } from 'src/domain/models/enum/day.enum';

export class UpdateInput {
  userId: string;

  alarmId: string;

  alias?: string;

  time: number;

  day: Day[];

  routineId: string;
}
