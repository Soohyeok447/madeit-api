import { ApiProperty } from '@nestjs/swagger';
import { Category } from 'src/domain/enums/Category';
import { RoutineType } from 'src/domain/enums/RoutineType';

export class GetRoutineDetailResponseDto {
  @ApiProperty({ description: '루틴 id' })
  id: string;

  @ApiProperty({ description: '루틴 이름' })
  name: string;

  @ApiProperty({
    description: '카테고리',
    enum: Category,
  })
  category: Category;

  @ApiProperty({
    description: '루틴 타입',
    enum: RoutineType,
  })
  type: RoutineType;

  @ApiProperty({ description: '썸네일 이미지' })
  thumbnail: string;

  @ApiProperty({ description: '카드뉴스', isArray: true, type: String })
  cardnews: string[];

  @ApiProperty({ description: '루틴 소개 스크립트' })
  introductionScript: string;

  @ApiProperty({ description: '동기부여 문장' })
  motivation: string;

  @ApiProperty({ description: '가격' })
  price: number;

  //product id
  @ApiProperty({ description: '관련 상품id 들' })
  relatedProducts?: string[];
}
