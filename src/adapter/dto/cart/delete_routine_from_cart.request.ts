import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class DeleteRoutineFromCartRequest {
  @ApiProperty({ 
    description: '장바구니에 제거할 루틴id',
  })
  @IsString()
  routineId: string;
}
