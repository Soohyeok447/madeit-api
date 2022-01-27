import { ApiProperty } from '@nestjs/swagger';
import { RoutineModel } from '../../../../models/RoutineModel';

class Paging {
  @ApiProperty({ description: '더 불러오기 가능 여부', type: Boolean })
  hasMore: boolean;

  @ApiProperty({ description: '다음 커서', type: String, nullable: true })
  nextCursor: string;
}

export class GetAllRoutinesByCategoryResponseDto {
  @ApiProperty({
    description: '루틴 목록',
    type: [RoutineModel],
    nullable: true,
  })
  data: RoutineModel[];

  @ApiProperty({ description: ' 다음 페이지 정보', type: Paging })
  paging: Paging;
}
