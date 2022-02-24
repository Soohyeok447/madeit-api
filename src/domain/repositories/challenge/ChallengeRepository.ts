import { Category } from '../../enums/Category';
import { RoutineModel } from '../../models/RoutineModel';
import { CreateChallengeDto } from './dtos/CreateChallengeDto';
import { UpdateChallengeDto } from './dtos/UpdateChallengeDto';

export abstract class RoutineRepository {
  abstract create(data: CreateChallengeDto): Promise<RoutineModel>;

  abstract update(id: string, data: UpdateChallengeDto): Promise<RoutineModel>;

  abstract delete(id: string): Promise<void>;

  abstract findAll(size: number, next?: string): Promise<RoutineModel[] | []>;

  abstract findAllByCategory(
    category: Category,
    size: number,
    next?: string,
  ): Promise<RoutineModel[] | []>;

  abstract findOne(id: string): Promise<RoutineModel | null>;

  abstract findOneByRoutineName(name: string): Promise<RoutineModel | null>;
}
