import { Day } from 'src/domain/enums/Day';

export class UpdateAlarmDto {
  public userId: string;

  public label?: string;

  public time: string;

  public day: Day[];

  public routineId: string;
}
