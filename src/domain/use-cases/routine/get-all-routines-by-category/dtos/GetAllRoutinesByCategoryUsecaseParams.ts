import { Category } from '../../../../../domain/enums/Category';

export class GetAllRoutinesByCategoryUsecaseParams {
  next?: string;

  size: number;

  category: Category;
}
