import { Routine } from "src/domain/models/routine.model";

export class AddRoutineInput {
  userId: string;

  routine: Routine;

  secret: string;
}
