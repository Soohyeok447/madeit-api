import { Day } from 'src/domain/enums/Day';

export class AddAlarmUsecaseDto {
  userId: string;

  label?: string;

  time: string;

  day: Day[];

  routineId: string;
}
