import { Category } from '../../enums/Category';
import { RecommendedRoutineModel } from '../../models/RecommendedRoutineModel';
import { CreateRecommendedRoutineDto } from './dtos/CreateRecommendedRoutineDto';
import { UpdateRecommendedRoutineDto } from './dtos/UpdateRecommendedRoutineDto';

export abstract class RecommendedRoutineRepository {
  abstract create(
    data: CreateRecommendedRoutineDto,
  ): Promise<RecommendedRoutineModel>;

  abstract update(
    id: string,
    data: UpdateRecommendedRoutineDto,
  ): Promise<RecommendedRoutineModel>;

  abstract delete(id: string): Promise<void>;

  abstract findAll(
    size: number,
    next?: string,
  ): Promise<RecommendedRoutineModel[]>;

  abstract findAllByCategory(
    category: Category,
    size: number,
    next?: string,
  ): Promise<RecommendedRoutineModel[]>;

  abstract findOne(id: string): Promise<RecommendedRoutineModel | null>;

  abstract findOneByRoutineName(
    title: string,
  ): Promise<RecommendedRoutineModel | null>;
}
