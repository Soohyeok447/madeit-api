import { ApiProperty } from "@nestjs/swagger";
import { Routine } from "src/domain/__common__/models/routine.model";

export class AddRoutineOutput {
  @ApiProperty({ description: '새롭게 생성된 루틴' })
  routine: Routine;
}
