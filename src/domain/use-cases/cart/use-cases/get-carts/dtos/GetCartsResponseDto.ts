import { ApiProperty } from '@nestjs/swagger';

export class GetCartsResponseDto {
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
