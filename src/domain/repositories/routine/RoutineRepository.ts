import { Routine } from '../../entities/Routine';
import { CreateRoutineDto } from './dtos/CreateRoutineDto';
import { UpdateRoutineDto } from './dtos/UpdateRoutineDto';

export abstract class RoutineRepository {
  abstract create(dto: CreateRoutineDto): Promise<Routine>;

  abstract update(id: string, dto: UpdateRoutineDto): Promise<Routine>;

  abstract delete(id: string): Promise<void>;

  abstract findAllByUserId(userId: string): Promise<Routine[]>;

  abstract findOne(id: string): Promise<Routine | null>;
}
