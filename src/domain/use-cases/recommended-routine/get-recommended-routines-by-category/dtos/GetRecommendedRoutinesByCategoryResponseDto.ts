import { ApiProperty } from '@nestjs/swagger';
import { CommonRecommendedRoutineResponseDto } from '../../common/CommonRecommendedRoutineResponseDto';

export class GetRecommendedRoutinesByCategoryResponseDto {
  @ApiProperty({
    description: `
    더 불러오기 가능 여부`,
    type: Boolean,
    example: true,
    examples: [true, false],
  })
  public readonly hasMore: boolean;

  @ApiProperty({
    description: `
    다음 커서`,
    type: String,
    example: '61e9d170ea062bb516d580c7',
    examples: [null, 'id'],
  })
  public readonly nextCursor: string;

  @ApiProperty({
    description: `
    추천 루틴 목록`,
    type: CommonRecommendedRoutineResponseDto,
    isArray: true,
  })
  public readonly items: CommonRecommendedRoutineResponseDto[];
}
