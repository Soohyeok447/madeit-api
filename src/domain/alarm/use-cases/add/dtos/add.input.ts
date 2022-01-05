import { Day } from 'src/domain/common/enums/day.enum';

export class AddInput {
  userId: string;

  alias?: string;

  time: number;

  day: Day[];

  routineId: string;
}
