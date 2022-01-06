import { ApiProperty } from '@nestjs/swagger';
import { Routine } from 'src/domain/routine/routine.model';

export class GetCartsOutput {
  @ApiProperty({
    description: '루틴 이름',
  })
  name: string;

  @ApiProperty({
    description: '루틴 id',
  })
  routineId: string;
}
