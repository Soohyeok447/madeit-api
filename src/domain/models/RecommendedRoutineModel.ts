import { ApiProperty } from '@nestjs/swagger';
import { Category } from '../common/enums/Category';
import { FixedField } from '../common/enums/FixedField';

export class RecommendedRoutineModel {
  @ApiProperty({ description: '추천 루틴 id' })
  id: string;

  @ApiProperty({ description: '추천 루틴 title' })
  title: string;

  @ApiProperty({ description: '추천 루틴 알람 hour' })
  hour: number;

  @ApiProperty({ description: '추천 루틴 알람 minute' })
  minute: number;

  @ApiProperty({
    description: '추천 루틴 알람 요일',
    isArray: true,
    type: Number,
  })
  days: number[];

  @ApiProperty({ description: '알람 유튜브 주소' })
  alarmVideoId: string;

  @ApiProperty({ description: '루틴 유튜브 주소' })
  contentVideoId: string;

  @ApiProperty({ description: '타이머' })
  timerDuration: number;

  @ApiProperty({
    description: '카테고리',
    enum: Category,
    enumName: 'Category',
  })
  category: Category;

  @ApiProperty({ description: '썸네일 이미지' })
  thumbnail: string;

  @ApiProperty({ description: '카드 뉴스', isArray: true, type: String })
  cardnews: string[];

  @ApiProperty({ description: '루틴 소개 스크립트' })
  introduction: string;

  @ApiProperty({
    description: '루틴 알람 설정 시 고정이 될 필드 리스트',
    enum: FixedField,
    enumName: 'FixedField',
    isArray: true,
  })
  fixedFields: FixedField[];

  @ApiProperty({ description: '가격' })
  price: number;

  @ApiProperty({ description: '관련 상품id 들' })
  relatedProducts?: string[];

  @ApiProperty({ description: '포인트' })
  point: number;

  @ApiProperty({ description: '경험치' })
  exp: number;
}
