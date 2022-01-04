import { Day } from 'src/domain/models/enum/day.enum';

export class AddInput {
  userId: string;

  alias?: string;

  time: number;

  day: Day[];

  routineId: string;
}
