import { ApiProperty } from "@nestjs/swagger";

export class AddRoutineOutput {
  @ApiProperty({ description: '새롭게 생성된 루틴의 id' })
  newRoutineId: string;
}
