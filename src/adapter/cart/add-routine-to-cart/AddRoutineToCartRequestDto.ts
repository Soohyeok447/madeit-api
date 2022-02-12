import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class AddRoutineToCartRequestDto {
  @ApiProperty({
    description: '장바구니에 추가할 루틴id',
    example: '61f28d9b1ead82c6e3db36c8',
  })
  @IsString()
  @Length(24)
  routineId: string;
}
