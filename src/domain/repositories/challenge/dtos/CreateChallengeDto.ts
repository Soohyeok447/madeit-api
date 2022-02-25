import { Category } from '../../../enums/Category';
import { RoutineType } from '../../../enums/RoutineType';

export class CreateChallengeDto {
  public name: string;

  public type: RoutineType;

  public category: Category;

  public introduction_script: string;

  public motivation: string;

  public price: number;

  public related_products?: string[];
}
