import { Category } from '../../../../../domain/enums/Category';
import { Resolution } from '../../../../../domain/enums/Resolution';

export class GetAllRoutinesByCategoryUsecaseParams {
  next?: string;

  size: number;

  category: Category;

  resolution: Resolution;
}
