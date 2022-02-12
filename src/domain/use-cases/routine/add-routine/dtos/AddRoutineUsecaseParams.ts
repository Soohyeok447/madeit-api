import { Category } from '../../../../../domain/enums/Category';
import { RoutineType } from '../../../../../domain/enums/RoutineType';

export class AddRoutineUsecaseParams {
  public userId: string;

  public name: string;

  public type: RoutineType;

  public category: Category;

  public introductionScript: string;

  public motivation: string;

  public price: string;

  public relatedProducts?: string[];
}
