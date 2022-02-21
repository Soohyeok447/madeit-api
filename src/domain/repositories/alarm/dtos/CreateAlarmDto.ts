import { Day } from '../../../../domain/enums/Day';

export class CreateAlarmDto {
  public userId: string;

  public label?: string;

  public time: string;

  public days: Day[];

  public routineId: string;
}
