import { CreateRoutineDto } from 'src/domain/common/repositories/routine/dtos/create.dto';

export class AddRoutineInput {
  userId: string;

  routine: CreateRoutineDto;
}
