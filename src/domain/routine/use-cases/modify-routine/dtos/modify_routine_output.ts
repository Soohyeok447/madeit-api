import { ApiProperty } from "@nestjs/swagger";
import { Routine } from "src/domain/common/models/routine.model";

export class ModifyRoutineOutput {
  @ApiProperty({ description: '수정된 루틴' })
  routine: Routine;
}
