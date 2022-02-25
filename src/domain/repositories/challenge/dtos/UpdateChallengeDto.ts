import { Category } from '../../../enums/Category';
import { RoutineType } from '../../../enums/RoutineType';

export class UpdateChallengeDto {
  public name?: string;

  public type?: RoutineType;

  public category?: Category;

  public introduction_script?: string;

  public motivation?: string;

  public price?: number;

  public related_products?: string[];

  public cardnews_id?;

  public thumbnail_id?;
}
