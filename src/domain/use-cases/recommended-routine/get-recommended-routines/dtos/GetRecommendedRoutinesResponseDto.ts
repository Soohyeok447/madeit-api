import { ApiProperty } from '@nestjs/swagger';
import { Category } from '../../../../enums/Category';
import { FixedField } from '../../../../enums/FixedField';

export class RecommendedRoutineItems {
  @ApiProperty({
    description: `
    추천 루틴 id`,
    example: '621a69aade24891627ff5739',
  })
  id: string;

  @ApiProperty({
    description: `
    추천 루틴 제목`,
    example: '아침 기상',
  })
  title: string;

  @ApiProperty({
    description: `
    추천 루틴 카테고리`,
    example: 'Health',
    enum: Category,
  })
  category: Category;

  @ApiProperty({
    description: `
    추천 루틴의 설명`,
    example:
      '게으름 탈출을 위해 1순위로 해야 할 것은 바로 이른 시간에 기상하는 것이 아닐까요?',
  })
  introduction: string;

  @ApiProperty({
    description: `
    추천 루틴의 고정 필드값 리스트`,
    example: ['Title', 'TimerDuration'],
    enum: FixedField,
    isArray: true,
  })
  fixedFields: FixedField[];

  @ApiProperty({
    description: `
    알람 hour`,
    example: 9,
  })
  hour: number;

  @ApiProperty({
    description: `
    알람 minute`,
    example: 0,
  })
  minute: number;

  @ApiProperty({
    description: `
    알람 요일`,
    isArray: true,
    example: [1, 2, 3, 4, 5],
    minLength: 1,
    maxLength: 7,
  })
  days: number[];

  @ApiProperty({
    description: `
    알람 video id`,
    example: null,
  })
  alarmVideoId: string;

  @ApiProperty({
    description: `
    루틴 video id`,
    example: 'youtube id가 올 예정',
  })
  contentVideoId: string;

  @ApiProperty({
    description: `
    루틴 타이머 second`,
    example: null,
  })
  timerDuration: number;

  @ApiProperty({
    description: `
    추천 루틴 가격`,
    example: 0,
  })
  price: number;

  @ApiProperty({
    description: `
    추천 루틴 카드뉴스 url 리스트`,
    example: ['url', 'url'],
    isArray: true,
  })
  cardnews: string[];

  @ApiProperty({
    description: `
    추천 루틴 썸네일 url`,
    example: 'url',
  })
  thumbnail: string;

  @ApiProperty({
    description: `
    추천 루틴 포인트`,
    example: 0,
  })
  point: number;

  @ApiProperty({
    description: `
    추천 루틴 경험치`,
    example: 0,
    nullable: true,
    required: false,
  })
  exp: number;
}

export class GetRecommendedRoutinesResponseDto {
  @ApiProperty({
    description: `
    더 불러오기 가능 여부`,
    type: Boolean,
    example: true,
    examples: [true, false],
  })
  hasMore: boolean;

  @ApiProperty({
    description: `
    다음 커서`,
    type: String,
    example: '61e9d170ea062bb516d580c7',
    examples: [null, 'id'],
  })
  nextCursor: string;

  @ApiProperty({
    description: `
    추천 루틴 목록`,
    type: RecommendedRoutineItems,
    isArray: true,
  })
  items: RecommendedRoutineItems[];
}
