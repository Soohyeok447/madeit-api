import { Day } from 'src/domain/models/enum/day.enum';

export class UpdateDto {
  public userId?: string;

  public label?: string;

  public time?: number;

  public day?: Day[];

  public routineId?: string;
}
