import { Day } from '../../../../domain/enums/Day';

export class UpdateAlarmDto {
  public userId: string;

  public label?: string;

  public time: string;

  public days: Day[];

  public routineId: string;
}
