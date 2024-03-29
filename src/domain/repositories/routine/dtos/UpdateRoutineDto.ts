import { AlarmType } from '../../../common/types/AlarmType';

export class UpdateRoutineDto {
  public readonly title?: string;

  public readonly hour?: number;

  public readonly minute?: number;

  public readonly days?: number[];

  public readonly alarmVideoId?: string;

  public readonly alarmType?: AlarmType;

  public readonly contentVideoId?: string;

  public readonly timerDuration?: number;

  public readonly activation?: boolean;
}
