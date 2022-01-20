import { Routine } from '../../models/routine.model';
import { CreateRoutineDto } from './dtos/create.dto';
import { UpdateRoutineDto } from './dtos/update.dto';

export abstract class RoutineRepository {
  abstract create(data: CreateRoutineDto): Promise<string>;

  abstract update(id: string, data: UpdateRoutineDto): Promise<void>;

  abstract delete(id: string): Promise<void>;

  abstract findAll(size:number, next?: string ): Promise<Routine[]>;
  
  abstract findAllByCategory(category:number, size:number, next?: string ): Promise<Routine[]>;

  abstract findOne(id: string): Promise<Routine>;

  abstract findOneByRoutineName(name: string): Promise<Routine>;
}