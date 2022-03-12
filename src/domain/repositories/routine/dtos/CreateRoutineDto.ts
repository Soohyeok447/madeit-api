import { FixedField } from '../../../common/enums/FixedField';

export class CreateRoutineDto {
  public user_id: string;

  public title: string;

  public hour: number;

  public minute: number;

  public days: number[];

  public alarm_video_id?: string;

  public content_video_id?: string;

  public timer_duration?: number;

  public fixed_fields?: FixedField[];

  public point?: number;

  public exp?: number;
}
