import { Routine } from '../../entities/Routine';
import { CreateRoutineDto } from './dtos/CreateRoutineDto';
import { UpdateRoutineDto } from './dtos/UpdateRoutineDto';

export abstract class RoutineRepository {
  public abstract create(dto: CreateRoutineDto): Promise<Routine>;

  public abstract update(id: string, dto: UpdateRoutineDto): Promise<Routine>;

  public abstract delete(id: string): Promise<void>;

  public abstract findAllByUserId(userId: string): Promise<Routine[]>;

  public abstract findOne(id: string): Promise<Routine | null>;

  public abstract findAllByUserIdIncludeDeletedThings(
    userId: string,
  ): Promise<Routine[]>;

  public abstract findAllIncludeDeletedThings(): Promise<Routine[]>;
}
