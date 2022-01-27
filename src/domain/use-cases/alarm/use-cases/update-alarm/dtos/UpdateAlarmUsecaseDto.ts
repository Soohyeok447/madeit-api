import { Day } from 'src/domain/enums/Day';

export class UpdateAlarmUsecaseDto {
  userId: string;

  alarmId: string;

  label?: string;

  time: string;

  day: Day[];

  routineId: string;
}
