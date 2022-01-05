import { CreateRoutineDto } from 'src/domain/routine/common/dtos/create.dto';

export class AddRoutineInput {
  userId: string;

  routine: CreateRoutineDto;
}
