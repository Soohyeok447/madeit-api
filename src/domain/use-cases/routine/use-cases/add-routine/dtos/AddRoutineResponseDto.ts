import { ApiProperty } from '@nestjs/swagger';
import { RoutineModel } from '../../../../../models/RoutineModel';

export class AddRoutineResponseDto {
  @ApiProperty({ description: '새롭게 생성된 루틴' })
  routine: RoutineModel;
}
