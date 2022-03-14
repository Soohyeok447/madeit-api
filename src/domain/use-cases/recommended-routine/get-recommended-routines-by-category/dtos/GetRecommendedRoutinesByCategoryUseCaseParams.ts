import { Category } from '../../../../common/enums/Category';

export class GetRecommendedRoutinesByCategoryUseCaseParams {
  next?: string;

  size: number;

  category: Category;
}
