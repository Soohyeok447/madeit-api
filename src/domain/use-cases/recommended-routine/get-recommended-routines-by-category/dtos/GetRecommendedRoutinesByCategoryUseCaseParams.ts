import { Category } from '../../../../common/enums/Category';

export class GetRecommendedRoutinesByCategoryUseCaseParams {
  public readonly next?: string;

  public readonly size: number;

  public readonly category: Category;
}
