import { AlarmType } from '../../../common/types/AlarmType';
import { FixedField } from '../../../common/enums/FixedField';

export class CreateRoutineDto {
  public readonly userId: string;

  public readonly title: string;

  public readonly hour: number;

  public readonly minute: number;

  public readonly days: number[];

  public readonly alarmVideoId?: string;

  public readonly alarmType?: AlarmType;

  public readonly contentVideoId?: string;

  public readonly timerDuration?: number;

  public readonly fixedFields?: FixedField[];

  public readonly point?: number;

  public readonly exp?: number;

  public readonly recommendedRoutineId?: string;
}
