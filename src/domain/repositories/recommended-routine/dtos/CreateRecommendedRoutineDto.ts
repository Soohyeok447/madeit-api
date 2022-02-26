import { Category } from '../../../enums/Category';
import { FixedField } from '../../../enums/FixedField';

export class CreateRecommendedRoutineDto {
  public title: string;

  public category: Category;

  public introduction: string;

  public fixed_fields: FixedField[];

  public hour?: number;

  public minute?: number;

  public days?: number[];

  public alarm_video_id?: string;

  public content_video_id?: string;

  public timer_duration?: number;

  public price?: number;
}
