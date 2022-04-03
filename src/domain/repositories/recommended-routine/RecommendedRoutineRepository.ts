import { Category } from '../../common/enums/Category';
import { RecommendedRoutine } from '../../entities/RecommendedRoutine';
import { CreateRecommendedRoutineDto } from './dtos/CreateRecommendedRoutineDto';
import { UpdateRecommendedRoutineDto } from './dtos/UpdateRecommendedRoutineDto';

export abstract class RecommendedRoutineRepository {
  public abstract create(
    dto: CreateRecommendedRoutineDto,
  ): Promise<RecommendedRoutine>;

  public abstract update(
    id: string,
    dto: UpdateRecommendedRoutineDto,
  ): Promise<RecommendedRoutine>;

  public abstract delete(id: string): Promise<void>;

  public abstract findAll(
    size: number,
    next?: string,
  ): Promise<RecommendedRoutine[]>;

  public abstract findAllByCategory(
    category: Category,
    size: number,
    next?: string,
  ): Promise<RecommendedRoutine[]>;

  public abstract findOne(id: string): Promise<RecommendedRoutine | null>;

  public abstract findOneByRoutineName(
    title: string,
  ): Promise<RecommendedRoutine | null>;
}
