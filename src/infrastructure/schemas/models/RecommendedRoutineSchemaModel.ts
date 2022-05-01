import { Category } from '../../../domain/common/enums/Category';
import { FixedField } from '../../../domain/common/enums/FixedField';
import { ObjectId } from '../../../domain/common/types';

export class RecommendedRoutineSchemaModel {
  public readonly _id?: ObjectId;

  public readonly title?: string;

  public readonly hour?: number;

  public readonly minute?: number;

  public readonly days?: number[];

  public readonly alarm_video_id?: string;

  public readonly content_video_id?: string;

  public readonly timer_duration?: number;

  public readonly thumbnail_id?: ObjectId;

  public readonly youtube_thumbnail?: string;

  public readonly cardnews_id?: ObjectId;

  public readonly category?: Category;

  public readonly introduction?: string;

  public readonly price?: number;

  public readonly fixed_fields?: FixedField[];

  public readonly point?: number;

  public readonly exp?: number;
}
