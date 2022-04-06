import { FixedField } from '../../../domain/common/enums/FixedField';
import { ObjectId } from '../../../domain/common/types';

export class RoutineSchemaModel {
  public readonly _id?: ObjectId;

  public readonly user_id?: string;

  public readonly title?: string;

  public readonly hour?: number;

  public readonly minute?: number;

  public readonly days?: number[];

  public readonly alarm_video_id?: string;

  public readonly content_video_id?: string;

  public readonly timer_duration?: number;

  public readonly activation?: boolean;

  public readonly fixed_fields?: FixedField[];

  public readonly exp?: number;

  public readonly point?: number;

  public readonly recommended_routine_id?: string;
}
