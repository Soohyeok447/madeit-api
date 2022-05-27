import { Category } from '../../../domain/common/enums/Category';
import { FixedField } from '../../../domain/common/enums/FixedField';
import * as mongoose from 'mongoose';

export class RecommendedRoutineSchemaModel {
  public readonly _id?: mongoose.Types.ObjectId;

  public readonly title?: string;

  public readonly hour?: number;

  public readonly minute?: number;

  public readonly days: number[];

  public readonly alarm_video_id?: string;

  public readonly content_video_id?: string;

  public readonly timer_duration?: number;

  public readonly thumbnail_id?: mongoose.Types.ObjectId;

  public readonly youtube_thumbnail?: string;

  public readonly cardnews_id?: mongoose.Types.ObjectId;

  public readonly category?: Category;

  public readonly introduction?: string;

  public readonly price?: number;

  public readonly fixed_fields?: FixedField[];

  public readonly point?: number;

  public readonly exp?: number;

  public readonly created_at?: string;

  public readonly updated_at?: string;

  public readonly deleted_at?: string;
}
