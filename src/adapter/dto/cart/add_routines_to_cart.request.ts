import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AddRoutineToCartRequest {
  @ApiProperty({ 
    description: '장바구니에 추가할 루틴id',
  })
  @IsString()
  routineId: string;
}
