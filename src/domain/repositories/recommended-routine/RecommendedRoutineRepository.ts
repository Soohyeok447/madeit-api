import { Category } from '../../common/enums/Category';
import { RecommendedRoutine } from '../../entities/RecommendedRoutine';
import { CreateRecommendedRoutineDto } from './dtos/CreateRecommendedRoutineDto';
import { UpdateRecommendedRoutineDto } from './dtos/UpdateRecommendedRoutineDto';

export abstract class RecommendedRoutineRepository {
  abstract create(
    dto: CreateRecommendedRoutineDto,
  ): Promise<RecommendedRoutine>;

  abstract update(
    id: string,
    dto: UpdateRecommendedRoutineDto,
  ): Promise<RecommendedRoutine>;

  abstract delete(id: string): Promise<void>;

  abstract findAll(size: number, next?: string): Promise<RecommendedRoutine[]>;

  abstract findAllByCategory(
    category: Category,
    size: number,
    next?: string,
  ): Promise<RecommendedRoutine[]>;

  abstract findOne(id: string): Promise<RecommendedRoutine | null>;

  abstract findOneByRoutineName(
    title: string,
  ): Promise<RecommendedRoutine | null>;
}
