import { ApiProperty } from '@nestjs/swagger';
import { Category } from '../enums/category.enum';
import { RoutineType } from '../enums/routine_type.enum';

export class Routine {
  @ApiProperty({ description: '루틴 id' })
  id: string;

  @ApiProperty({ description: '루틴 이름' })
  name: string;

  @ApiProperty({
    description: '카테고리',
    enum: Category,
    enumName: 'Category'
  })
  category: Category;

  @ApiProperty({
    description: '루틴 타입',
    enum: RoutineType,
    enumName: 'RoutineType',
  })
  type: RoutineType;

  @ApiProperty({ description: '썸네일 이미지' })
  thumbnail: string;

  @ApiProperty({ description: '카드 뉴스', isArray: true })
  cardnews: string;

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
