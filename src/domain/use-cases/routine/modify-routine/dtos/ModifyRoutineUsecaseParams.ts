import { Category } from '../../../../../domain/enums/Category';
import { RoutineType } from '../../../../../domain/enums/RoutineType';

export class ModifyRoutineUsecaseParams {
  public userId: string;

  public routineId: string;

  public name?: string;

  public type?: RoutineType;

  public category?: Category;

  public introductionScript?: string;

  public motivation?: string;

  public price?: number;

  public relatedProducts?: string[];
}
