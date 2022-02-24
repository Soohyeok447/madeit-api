import { ApiProperty } from '@nestjs/swagger';
import { Category } from '../enums/Category';
import { RoutineType } from '../enums/RoutineType';

export class ChallengeModel {
  @ApiProperty({ description: '루틴 id' })
  id: string;

  @ApiProperty({ description: '루틴 이름' })
  name: string;

  @ApiProperty({ description: '루틴 알람 hour' })
  hour: number;

  @ApiProperty({ description: '루틴 알람 minute' })
  minute: number;

  //TODO 추가

  @ApiProperty({
    description: '카테고리',
    enum: Category,
    enumName: 'Category',
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

  @ApiProperty({ description: '카드 뉴스', isArray: true, type: String })
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
