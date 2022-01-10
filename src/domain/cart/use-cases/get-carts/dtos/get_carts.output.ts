import { ApiProperty } from '@nestjs/swagger';
import { Routine } from 'src/domain/common/models/routine.model';

export class GetCartsOutput {
  @ApiProperty({
    description: '루틴 이름',
  })
  routineName: string;

  @ApiProperty({
    description: '루틴 id',
  })
  routineId: string;

  @ApiProperty({
    description: '카트 id',
  })
  cartId: string;
}
