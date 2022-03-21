import { FixedField } from '../../../common/enums/FixedField';

export class CreateRoutineDto {
  public userId: string;

  public title: string;

  public hour: number;

  public minute: number;

  public days: number[];

  public alarmVideoId?: string;

  public contentVideoId?: string;

  public timerDuration?: number;

  public fixedFields?: FixedField[];

  public point?: number;

  public exp?: number;

  public recommendedRoutineId?: string;
}
