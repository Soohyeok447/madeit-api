import { ApiProperty } from '@nestjs/swagger';
import { Routine } from 'src/domain/routine/routine.model';

export class GetCartOutput {
  @ApiProperty({
    description: '장바구니 리스트',
    isArray: true,
    type: Routine,
  })
  shoppingCart: Routine[];
}
