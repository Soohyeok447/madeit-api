import { Category } from '../../../../domain/enums/Category';
import { RoutineType } from '../../../../domain/enums/RoutineType';

export class UpdateRoutineDto {
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
