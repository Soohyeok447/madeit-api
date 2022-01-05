import { ApiProperty } from '@nestjs/swagger';
import { RoutineType } from 'src/domain/common/enums/routine_type.enum';

export class GetRoutineDetailResponse {
  @ApiProperty({ description: '루틴 id' })
  id: string;

  @ApiProperty({ description: '루틴 이름' })
  name: string;

  @ApiProperty({
    description: '루틴 타입',
    enum: RoutineType,
    enumName: 'RoutineType',
  })
  type: RoutineType;

  @ApiProperty({ description: '썸네일 이미지 url' })
  thumbnailUrl: string;

  @ApiProperty({ description: '루틴 소개 스크립트' })
  introductionScript: string;

  @ApiProperty({ description: '루틴 소개 이미지 url' })
  introductionImageUrl: string;

  @ApiProperty({ description: '동기부여 문장' })
  motivation: string;

  @ApiProperty({ description: '가격' })
  price: number;

  //product id
  @ApiProperty({ description: '관련 상품id 들' })
  relatedProducts?: string[];
}
