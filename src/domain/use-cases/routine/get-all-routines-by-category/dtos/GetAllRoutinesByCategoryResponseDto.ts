import { ApiProperty } from '@nestjs/swagger';
import { RoutineModel } from '../../../../models/RoutineModel';

// class Paging {
//   @ApiProperty({ description: '더 불러오기 가능 여부', type: Boolean })
//   hasMore: boolean;

//   @ApiProperty({ description: '다음 커서', type: String, nullable: true })
//   nextCursor: string;
// }

export class GetAllRoutinesByCategoryResponseDto {
  @ApiProperty({
    description: '더 불러오기 가능 여부',
    type: Boolean,
    example: true,
    examples: [true, false]
  })
  hasMore: boolean;

  @ApiProperty({
    description: '다음 커서',
    type: String,
    nullable: true,
    example: '61e9d170ea062bb516d580c7',
    examples: [null, 'id']
  })
  nextCursor: string;

  @ApiProperty({
    description: '루틴 목록',
    type: [RoutineModel],
    nullable: true,
  })
  data: RoutineModel[];
}
