import { CreateRoutineDto } from 'src/domain/repositories/dto/routine/create.dto';

export class AddRoutineInput {
  userId: string;

  routine: CreateRoutineDto;
}
