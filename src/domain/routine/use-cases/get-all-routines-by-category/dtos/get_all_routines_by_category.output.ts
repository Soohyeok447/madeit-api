import { ApiProperty } from '@nestjs/swagger';
import { Routine } from 'src/domain/routine/routine.model';


class Paging {
  @ApiProperty({ description: '더 불러오기 가능 여부', type: Boolean })
  hasMore: boolean;

  @ApiProperty({ description: '다음 커서', type: String, nullable: true })
  nextCursor: string;
}

export class GetAllRoutinesByCategoryOutput {
  @ApiProperty({ description: '루틴 목록', type: [Routine], nullable: true })
  data: Routine[];

  @ApiProperty({ description: ' 다음 페이지 정보', type: Paging })
  paging: Paging;
}

