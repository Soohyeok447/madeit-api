import { Routine } from "../models/routine.model";
import { CreateRoutineDto } from "./dto/routine/create.dto";
import { UpdateRoutineDto } from "./dto/routine/update.dto";

export abstract class RoutineRepository {
  abstract create(data: CreateRoutineDto): Promise<string>;

  abstract update(id: string, data: UpdateRoutineDto): Promise<void>;

  abstract delete(id: string): Promise<void>;

  abstract findAll(next?:string): Promise<{
    data: Routine[],
    paging: {
      nextCursor: string,
      hasMore: boolean,
    }
  }>;

  abstract findOne(id: string): Promise<Routine>;

  abstract findOneByRoutineName(name: string): Promise<Routine>;
}
