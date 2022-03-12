import { Category } from '../../../common/enums/Category';
import { FixedField } from '../../../common/enums/FixedField';

export class UpdateRecommendedRoutineDto {
  public title?: string;

  public category?: Category;

  public introduction?: string;

  public fixed_fields?: FixedField[];

  public hour?: number;

  public minute?: number;

  public days?: number[];

  public alarm_video_id?: string;

  public content_video_id?: string;

  public timer_duration?: number;

  public relatedProducts?: string[];

  public price?: number;

  public cardnews_id?;

  public thumbnail_id?;
}
