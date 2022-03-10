import { RoutineModel } from '../../models/RoutineModel';
import { CreateRoutineDto } from './dtos/CreateRoutineDto';
import { UpdateRoutineDto } from './dtos/UpdateRoutineDto';

export abstract class RoutineRepository {
  abstract create(data: CreateRoutineDto): Promise<RoutineModel>;

  abstract update(id: string, data: UpdateRoutineDto): Promise<RoutineModel>;

  abstract delete(id: string): Promise<void>;

  abstract findAll(size: number, next?: string): Promise<RoutineModel[]>;

  abstract findAllByUserId(userId: string): Promise<RoutineModel[]>;

  abstract findOne(id: string): Promise<RoutineModel | null>;
}
