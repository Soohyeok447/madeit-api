import { AlarmType } from '../../../domain/common/types/AlarmType';
import { FixedField } from '../../../domain/common/enums/FixedField';
import * as mongoose from 'mongoose';

export class RoutineSchemaModel {
  public readonly _id?: mongoose.Types.ObjectId;

  public readonly user_id?: string;

  public readonly title?: string;

  public readonly hour?: number;

  public readonly minute?: number;

  public readonly days?: number[];

  public readonly alarm_video_id?: string;

  public readonly alarm_type?: AlarmType;

  public readonly content_video_id?: string;

  public readonly timer_duration?: number;

  public readonly activation?: boolean;

  public readonly fixed_fields?: FixedField[];

  public readonly exp?: number;

  public readonly point?: number;

  public readonly recommended_routine_id?: string;

  public readonly created_at?: string;

  public readonly updated_at?: string;

  public readonly deleted_at?: string;
}
