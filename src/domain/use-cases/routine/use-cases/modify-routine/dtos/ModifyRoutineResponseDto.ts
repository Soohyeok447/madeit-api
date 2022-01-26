import { ApiProperty } from '@nestjs/swagger';
import { RoutineModel } from '../../../../../models/RoutineModel';

export class ModifyRoutineResponseDto {
  @ApiProperty({ description: '수정된 루틴' })
  routine: RoutineModel;
}
