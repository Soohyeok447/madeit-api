import { Category } from '../../../domain/common/enums/Category';
import { FixedField } from '../../../domain/common/enums/FixedField';

export class RecommendedRoutineSchemaModel {
  readonly _id?: string;

  readonly title?: string;

  readonly hour?: number;

  readonly minute?: number;

  readonly days?: number[];

  readonly alarm_video_id?: string;

  readonly content_video_id?: string;

  readonly timer_duration?: number;

  readonly thumbnail_id?: string;

  readonly cardnews_id?: string;

  readonly category?: Category;

  readonly introduction?: string;

  readonly price?: number;

  readonly fixed_fields?: FixedField[];

  readonly point?: number;

  readonly exp?: number;
}
