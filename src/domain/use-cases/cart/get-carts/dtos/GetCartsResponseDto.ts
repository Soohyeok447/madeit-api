import { ApiProperty } from '@nestjs/swagger';

export class GetCartsResponseDto {
  @ApiProperty({
    description: '루틴 id',
    example: '61f28d9b1ead82c6e3db36c8'
  })
  routineId: string;

  @ApiProperty({
    description: '카트 id',
    example: '61f28d9b1ead82c6e3db36c8'
  })
  cartId: string;
}
