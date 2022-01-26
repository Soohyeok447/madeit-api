import { Day } from 'src/domain/enums/Day';

export class AddAlarmUsecaseDto {
  userId: string;

  alias?: string;

  time: number;

  day: Day[];

  routineId: string;
}
