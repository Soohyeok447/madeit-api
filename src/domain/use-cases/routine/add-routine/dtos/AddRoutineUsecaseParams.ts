import { Category } from 'src/domain/enums/Category';
import { RoutineType } from 'src/domain/enums/RoutineType';

export class AddRoutineUsecaseParams {
  public userId: string;

  public name: string;

  public type: RoutineType;

  public category: Category;

  public introductionScript: string;

  public motivation: string;

  public price: number;

  public relatedProducts?: string[];
}
